'use client';

import { useState, useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { TokenService, TokenCreationParams, TokenCreationResult } from '../services/tokenService';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

export const useTokenCreation = () => {
  const { connected, publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [isCreating, setIsCreating] = useState(false);
  const [creationResult, setCreationResult] = useState<TokenCreationResult | null>(null);
  const [estimatedCost, setEstimatedCost] = useState<number>(0);

  const estimateCost = useCallback(async () => {
    if (!connected) return;
    
    try {
      const tokenService = new TokenService(connection.rpcEndpoint);
      const cost = await tokenService.estimateCreationCost();
      setEstimatedCost(cost);
    } catch (error) {
      console.error('Error estimating cost:', error);
      setEstimatedCost(0.05); // Conservative fallback for mainnet
    }
  }, [connected, connection.rpcEndpoint]);

  const createToken = useCallback(async (params: TokenCreationParams): Promise<TokenCreationResult> => {
    if (!connected || !publicKey || !signTransaction) {
      return {
        success: false,
        error: 'Wallet not connected or cannot sign transactions',
      };
    }

    setIsCreating(true);
    setCreationResult(null);

    try {
      // Create a dummy keypair for the feePayer parameter (not used in mainnet flow)
      const dummyKeypair = new (await import('@solana/web3.js')).Keypair();
      
      const tokenService = new TokenService(connection.rpcEndpoint);
      
      const result = await tokenService.createToken(
        params,
        { publicKey, signTransaction },
        dummyKeypair
      );

      setCreationResult(result);
      return result;

    } catch (error) {
      const errorResult: TokenCreationResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
      
      setCreationResult(errorResult);
      return errorResult;
    } finally {
      setIsCreating(false);
    }
  }, [connected, publicKey, signTransaction, connection.rpcEndpoint]);

  const resetCreation = useCallback(() => {
    setCreationResult(null);
    setEstimatedCost(0);
  }, []);

  return {
    isCreating,
    creationResult,
    estimatedCost,
    createToken,
    estimateCost,
    resetCreation,
    canCreate: connected && !!publicKey && !!signTransaction,
  };
}; 