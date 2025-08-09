'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Zap, ExternalLink } from 'lucide-react';
import { useTokenCreation } from '../hooks/useTokenCreation';
import { TokenCreationParams } from '../services/tokenService';

interface TokenCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenParams: TokenCreationParams;
}

export const TokenCreationModal: React.FC<TokenCreationModalProps> = ({
  isOpen,
  onClose,
  tokenParams,
}) => {
  const { isCreating, creationResult, estimatedCost, createToken, estimateCost, resetCreation } = useTokenCreation();
  const [currentStep, setCurrentStep] = useState(0);
  const [stepStatus, setStepStatus] = useState<'pending' | 'processing' | 'completed' | 'error'>('pending');

  const steps = [
    'Preparing Transaction',
    'Creating Mint Account',
    'Setting Up Token Account',
    'Minting Initial Supply',
    'Finalizing Token',
  ];

  useEffect(() => {
    if (isOpen) {
      estimateCost();
      resetCreation();
      setCurrentStep(0);
      setStepStatus('pending');
    }
  }, [isOpen, estimateCost, resetCreation]);

  useEffect(() => {
    if (isCreating && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentStep, isCreating, steps.length]);

  const handleCreateToken = async () => {
    try {
      setStepStatus('processing');
      const result = await createToken(tokenParams);
      
      if (result.success) {
        setStepStatus('completed');
      } else {
        setStepStatus('error');
      }
    } catch (error) {
      setStepStatus('error');
    }
  };

  const getStepIcon = (stepIndex: number) => {
    if (stepIndex < currentStep) {
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    } else if (stepIndex === currentStep && stepStatus === 'processing') {
      return <div className="w-5 h-5 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />;
    } else if (stepIndex === currentStep && stepStatus === 'error') {
      return <AlertCircle className="w-5 h-5 text-red-400" />;
    } else {
      return <div className="w-5 h-5 border-2 border-gray-600 rounded-full" />;
    }
  };

  const getStepTextColor = (stepIndex: number) => {
    if (stepIndex < currentStep) {
      return 'text-green-400';
    } else if (stepIndex === currentStep && stepStatus === 'processing') {
      return 'text-neon-cyan';
    } else if (stepIndex === currentStep && stepStatus === 'error') {
      return 'text-red-400';
    } else {
      return 'text-gray-400';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Zap className="w-8 h-8 text-neon-cyan" />
            <div>
              <h2 className="text-2xl font-orbitron font-bold">Launch Your Token</h2>
              <div className="flex items-center space-x-2 mt-1">
                <div className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded text-xs text-green-400 font-mono">
                  SOLANA MAINNET
                </div>
                <span className="text-xs text-gray-400">Real token deployment</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Token Preview */}
        <div className="bg-black/30 rounded-xl p-4 mb-6 border border-gray-700">
          <h3 className="text-lg font-orbitron font-bold mb-3">Token Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Name:</span>
              <span className="ml-2 font-semibold">{tokenParams.name}</span>
            </div>
            <div>
              <span className="text-gray-400">Symbol:</span>
              <span className="ml-2 font-semibold">{tokenParams.symbol}</span>
            </div>
            <div>
              <span className="text-gray-400">Total Supply:</span>
              <span className="ml-2 font-semibold">{tokenParams.totalSupply.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-400">Initial Price:</span>
              <span className="ml-2 font-semibold">{tokenParams.initialPrice} SOL</span>
            </div>
          </div>
        </div>

        {/* Cost Estimate */}
        <div className="bg-black/30 rounded-xl p-4 mb-6 border border-gray-700">
          <h3 className="text-lg font-orbitron font-bold mb-3">Estimated Cost</h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Network fees (rent + transaction):</span>
            <span className="text-neon-cyan font-mono font-bold">
              {estimatedCost > 0 ? `${estimatedCost.toFixed(4)} SOL` : 'Calculating...'}
            </span>
          </div>
          <div className="mt-2 space-y-1 text-xs text-gray-500">
            <p>• Mint account creation: ~0.002 SOL</p>
            <p>• Token account creation: ~0.002 SOL</p>
            <p>• Transaction fees: ~0.00001 SOL</p>
            <p className="text-neon-cyan font-semibold">Total: ~{estimatedCost > 0 ? estimatedCost.toFixed(4) : '0.004'} SOL</p>
          </div>
          <div className="mt-3 p-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <p className="text-xs text-blue-400">
              <strong>⚠️ Mainnet Warning:</strong> This will create a real token on Solana mainnet. 
              Make sure you have sufficient SOL balance and double-check all parameters.
            </p>
          </div>
        </div>

        {/* Creation Steps */}
        {!creationResult && (
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-orbitron font-bold">Creation Process</h3>
            {steps.map((step, index) => (
              <div key={index} className="flex items-center space-x-3">
                {getStepIcon(index)}
                <span className={getStepTextColor(index)}>{step}</span>
              </div>
            ))}
          </div>
        )}

        {/* Result */}
        {creationResult && (
          <div className="mb-6">
            {creationResult.success ? (
              <div className="space-y-6">
                {/* Success Message */}
                <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <h3 className="text-lg font-orbitron font-bold text-green-400">Token Created Successfully!</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-400">Mint Address:</span>
                      <span className="ml-2 font-mono text-green-400">{creationResult.mintAddress}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Token Account:</span>
                      <span className="ml-2 font-mono text-green-400">{creationResult.tokenAccount}</span>
                    </div>
                    {creationResult.transactionSignature && (
                      <div>
                        <span className="text-gray-400">Transaction:</span>
                        <span className="ml-2 font-mono text-green-400 break-all">
                          {creationResult.transactionSignature.slice(0, 8)}...{creationResult.transactionSignature.slice(-8)}
                        </span>
                      </div>
                    )}
                    {creationResult.metadataUri && (
                      <div>
                        <span className="text-gray-400">Metadata URI:</span>
                        <span className="ml-2 font-mono text-green-400 break-all">
                          {creationResult.metadataUri}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        if (creationResult.mintAddress) {
                          navigator.clipboard.writeText(creationResult.mintAddress);
                        }
                      }}
                      className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/30 transition-colors"
                    >
                      Copy Mint Address
                    </button>
                    <a
                      href={`https://solscan.io/token/${creationResult.mintAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-colors flex items-center space-x-2"
                    >
                      <span>View on Solscan</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <a
                      href={`https://solana.fm/address/${creationResult.mintAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-500/30 transition-colors flex items-center space-x-2"
                    >
                      <span>View on Solana.fm</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    {creationResult.transactionSignature && (
                      <a
                        href={`https://solscan.io/tx/${creationResult.transactionSignature}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-lg text-orange-400 hover:bg-orange-500/30 transition-colors flex items-center space-x-2"
                      >
                        <span>View Transaction</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Liquidity Pool Creation Section */}
                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">💧</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-orbitron font-bold text-blue-400">Create Liquidity Pool on Meteora</h3>
                      <p className="text-sm text-gray-400">Your token is created! Now add liquidity for trading</p>
                    </div>
                  </div>
                  
                  {/* Meteora Focus */}
                  <div className="bg-black/30 rounded-lg p-6 border border-blue-500/30 mb-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">M</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-blue-400">Meteora DLMM Pool</h4>
                        <p className="text-sm text-gray-400">Dynamic Liquidity Market Maker with optimal settings</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-3">
                        <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Base Fee</span>
                            <span className="text-blue-400 font-semibold">0.20%</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Optimal for new tokens</p>
                        </div>
                        
                        <div className="bg-cyan-500/10 rounded-lg p-3 border border-cyan-500/20">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Bin Step</span>
                            <span className="text-cyan-400 font-semibold">20</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Balanced price granularity</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Pool Type</span>
                            <span className="text-green-400 font-semibold">DLMM</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Dynamic Liquidity Market Maker</p>
                        </div>
                        
                        <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Quote Token</span>
                            <span className="text-purple-400 font-semibold">SOL</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Standard Solana pairing</p>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-300 mb-4">
                      These settings provide optimal liquidity distribution and fee generation for new tokens. 
                      The 0.20% base fee balances user attraction with LP profitability, while bin step 20 
                      offers good price granularity without excessive fragmentation.
                    </p>
                    
                    <a
                      href={`https://app.meteora.ag/pool/create?tokenA=${creationResult.mintAddress}&tokenB=So11111111111111111111111111111111112&baseFee=0.002&binStep=20`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg text-white font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <span>🚀 Create LP on Meteora</span>
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>

                  <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <span className="text-yellow-400 text-lg">💡</span>
                      <div className="text-sm text-yellow-400">
                        <p className="font-semibold mb-2">Pro Tips for Meteora DLMM:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• <strong>Initial Price:</strong> Set to 0.00 for market discovery</li>
                          <li>• <strong>Liquidity Range:</strong> Start with wide range (±50%) for new tokens</li>
                          <li>• <strong>Amounts:</strong> Begin with 1-5% of your token supply</li>
                          <li>• <strong>Monitoring:</strong> Check pool performance regularly</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                  <h3 className="text-lg font-orbitron font-bold text-red-400">Token Creation Failed</h3>
                </div>
                <p className="text-red-400">{creationResult.error}</p>
                <button
                  onClick={resetCreation}
                  className="mt-3 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-600 rounded-lg font-inter font-semibold hover:border-gray-500 transition-colors"
          >
            {creationResult ? 'Close' : 'Cancel'}
          </button>
          
          {!creationResult && (
            <button
              onClick={handleCreateToken}
              disabled={isCreating}
              className="px-8 py-3 bg-gradient-to-r from-neon-pink to-neon-purple rounded-lg font-inter font-bold hover:shadow-glow-purple transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Launching on Mainnet...' : '🚀 Launch on Solana Mainnet'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 