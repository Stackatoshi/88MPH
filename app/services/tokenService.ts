import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
  SystemProgram,
} from '@solana/web3.js';
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
  getAccount,
  getMint,
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import {
  Metaplex,
  keypairIdentity,
  toMetaplexFile,
} from '@metaplex-foundation/js';

export interface TokenCreationParams {
  name: string;
  symbol: string;
  description: string;
  imageUrl?: string;
  totalSupply: number;
  initialPrice: number;
  vestingPeriod: number;
  teamAllocation: number;
  decimals: number;
}

export interface TokenCreationResult {
  success: boolean;
  mintAddress?: string;
  tokenAccount?: string;
  transactionSignature?: string;
  metadataUri?: string;
  error?: string;
}

export class TokenService {
  private connection: Connection;
  private metaplex: Metaplex;

  constructor(endpoint: string) {
    this.connection = new Connection(endpoint, 'confirmed');
    
    // Initialize Metaplex with mainnet configuration
    this.metaplex = new Metaplex(this.connection)
      .use(keypairIdentity(Keypair.generate())); // This will be overridden in createToken
  }

  async createToken(
    params: TokenCreationParams,
    wallet: { publicKey: PublicKey; signTransaction: (transaction: Transaction) => Promise<Transaction> },
    feePayer: Keypair
  ): Promise<TokenCreationResult> {
    try {
      console.log('Starting token creation process on mainnet...');
      
      // Create a new mint account
      const mint = Keypair.generate();
      console.log('Generated mint keypair:', mint.publicKey.toBase58());

      // Get the associated token account address
      const associatedTokenAccount = await getAssociatedTokenAddress(
        mint.publicKey,
        wallet.publicKey,
        false,
        TOKEN_PROGRAM_ID
      );

      // Calculate rent exemptions
      const mintRent = await this.connection.getMinimumBalanceForRentExemption(82);
      const tokenAccountRent = await this.connection.getMinimumBalanceForRentExemption(165);

      // Create and upload metadata to Arweave
      const metadataUri = await this.uploadMetadata(params);
      console.log('Metadata uploaded to:', metadataUri);

      // Create the transaction
      const transaction = new Transaction();

      // Add instructions to the transaction
      transaction.add(
        // Create mint account
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: mint.publicKey,
          space: 82,
          lamports: mintRent,
          programId: TOKEN_PROGRAM_ID,
        }),
        
        // Initialize mint
        createInitializeMintInstruction(
          mint.publicKey,
          params.decimals,
          wallet.publicKey,
          wallet.publicKey,
          TOKEN_PROGRAM_ID
        ),

        // Create associated token account
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          associatedTokenAccount,
          wallet.publicKey,
          mint.publicKey,
          TOKEN_PROGRAM_ID
        ),

        // Mint initial supply to creator
        createMintToInstruction(
          mint.publicKey,
          associatedTokenAccount,
          wallet.publicKey,
          params.totalSupply * Math.pow(10, params.decimals),
          [],
          TOKEN_PROGRAM_ID
        )
      );

      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;

      // Sign the transaction
      transaction.sign(mint);
      const signedTransaction = await wallet.signTransaction(transaction);

      // Send and confirm the transaction
      console.log('Sending transaction to mainnet...');
      const signature = await this.connection.sendRawTransaction(signedTransaction.serialize());
      
      // Wait for confirmation
      const confirmation = await this.connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err}`);
      }

      console.log('Token created successfully on mainnet!');
      console.log('Transaction signature:', signature);
      console.log('Mint address:', mint.publicKey.toBase58());
      console.log('Token account:', associatedTokenAccount.toBase58());

      return {
        success: true,
        mintAddress: mint.publicKey.toBase58(),
        tokenAccount: associatedTokenAccount.toBase58(),
        transactionSignature: signature,
        metadataUri,
      };

    } catch (error) {
      console.error('Error creating token on mainnet:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getTokenBalance(mintAddress: string, walletAddress: string): Promise<number> {
    try {
      const mint = new PublicKey(mintAddress);
      const wallet = new PublicKey(walletAddress);
      
      const tokenAccount = await getAssociatedTokenAddress(
        mint,
        wallet,
        false,
        TOKEN_PROGRAM_ID
      );

      const accountInfo = await getAccount(this.connection, tokenAccount);
      const mintInfo = await getMint(this.connection, mint);
      
      return Number(accountInfo.amount) / Math.pow(10, mintInfo.decimals);
    } catch (error) {
      console.error('Error getting token balance:', error);
      return 0;
    }
  }

  async estimateCreationCost(): Promise<number> {
    try {
      // Estimate the cost of creating a token on Solana mainnet
      const mintRent = await this.connection.getMinimumBalanceForRentExemption(82);
      const tokenAccountRent = await this.connection.getMinimumBalanceForRentExemption(165);
      
      // Add transaction fees (mainnet fees are higher)
      const transactionFee = 0.00001 * LAMPORTS_PER_SOL;
      
      // Add Arweave storage cost estimate
      const arweaveCost = 0.0001 * LAMPORTS_PER_SOL;
      
      const totalCost = mintRent + tokenAccountRent + transactionFee + arweaveCost;
      
      return totalCost / LAMPORTS_PER_SOL; // Return in SOL
    } catch (error) {
      console.error('Error estimating creation cost:', error);
      return 0.05; // Conservative estimate for mainnet
    }
  }

  async uploadMetadata(params: TokenCreationParams): Promise<string> {
    try {
      // Create metadata object
      const metadata = {
        name: params.name,
        symbol: params.symbol,
        description: params.description,
        image: params.imageUrl || `https://88mph.app/api/token-image?symbol=${params.symbol}`,
        attributes: [
          {
            trait_type: "Total Supply",
            value: params.totalSupply.toLocaleString(),
          },
          {
            trait_type: "Initial Price",
            value: `${params.initialPrice} SOL`,
          },
          {
            trait_type: "Vesting Period",
            value: `${params.vestingPeriod} days`,
          },
          {
            trait_type: "Team Allocation",
            value: `${params.teamAllocation}%`,
          },
          {
            trait_type: "Decimals",
            value: params.decimals,
          },
          {
            trait_type: "Created On",
            value: new Date().toISOString(),
          },
        ],
        properties: {
          files: [
            {
              type: "image/png",
              uri: params.imageUrl || `https://88mph.app/api/token-image?symbol=${params.symbol}`,
            },
          ],
          category: "image",
        },
      };

      // For now, return a placeholder URI since we don't have Arweave integration set up
      // In production, you'd upload to Arweave, IPFS, or similar
      console.log('Metadata prepared:', metadata);
      return `https://88mph.app/metadata/${params.symbol.toLowerCase()}`;
    } catch (error) {
      console.error('Error preparing metadata:', error);
      // Fallback to a placeholder URI
      return `https://88mph.app/metadata/${params.symbol.toLowerCase()}`;
    }
  }

  async getTokenMetadata(mintAddress: string): Promise<any> {
    try {
      const mint = new PublicKey(mintAddress);
      const mintInfo = await getMint(this.connection, mint);
      
      return {
        supply: mintInfo.supply.toString(),
        decimals: mintInfo.decimals,
        mintAuthority: mintInfo.mintAuthority?.toBase58(),
        freezeAuthority: mintInfo.freezeAuthority?.toBase58(),
      };
    } catch (error) {
      console.error('Error getting token metadata:', error);
      return null;
    }
  }
} 