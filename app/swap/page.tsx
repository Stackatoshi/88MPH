'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Settings, Zap, TrendingUp, Info, RefreshCw } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletConnectButton } from '../components/WalletConnectButton';
import { NetworkIndicator } from '../components/NetworkIndicator';
import Link from 'next/link';

interface Token {
  symbol: string;
  name: string;
  address: string;
  logoURI?: string;
  decimals: number;
  price?: number;
}

interface SwapFormData {
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
  slippage: number;
}

const popularTokens: Token[] = [
  {
    symbol: 'SOL',
    name: 'Solana',
    address: 'So11111111111111111111111111111111112',
    decimals: 9,
    price: 1,
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    decimals: 6,
    price: 1,
  },
  {
    symbol: 'USDT',
    name: 'Tether',
    address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    decimals: 6,
    price: 1,
  },
  {
    symbol: 'BONK',
    name: 'Bonk',
    address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    decimals: 5,
    price: 0.000001,
  },
];

export default function SwapPage() {
  const { connected } = useWallet();
  const [formData, setFormData] = useState<SwapFormData>({
    fromToken: popularTokens[0],
    toToken: popularTokens[1],
    fromAmount: '',
    toAmount: '',
    slippage: 0.5,
  });
  const [showSlippageSettings, setShowSlippageSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [swapRoutes, setSwapRoutes] = useState<any[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);

  // Mock swap routes - in production this would come from Jupiter API
  useEffect(() => {
    if (formData.fromAmount && parseFloat(formData.fromAmount) > 0) {
      const mockRoutes = [
        {
          id: 'jupiter-1',
          name: 'Jupiter',
          priceImpact: 0.12,
          fee: 0.3,
          estimatedTime: '~2s',
          best: true,
        },
        {
          id: 'raydium-1',
          name: 'Raydium',
          priceImpact: 0.15,
          fee: 0.25,
          estimatedTime: '~3s',
          best: false,
        },
        {
          id: 'orca-1',
          name: 'Orca',
          priceImpact: 0.18,
          fee: 0.35,
          estimatedTime: '~4s',
          best: false,
        },
      ];
      setSwapRoutes(mockRoutes);
      setSelectedRoute(mockRoutes[0]);
    }
  }, [formData.fromAmount]);

  const handleFromAmountChange = (amount: string) => {
    setFormData(prev => ({ ...prev, fromAmount: amount }));
    // Mock calculation - in production this would use Jupiter API
    if (amount && parseFloat(amount) > 0 && formData.fromToken.price && formData.toToken.price) {
      const fromValue = parseFloat(amount) * formData.fromToken.price;
      const toValue = fromValue / formData.toToken.price;
      setFormData(prev => ({ ...prev, toAmount: toValue.toFixed(6) }));
    } else {
      setFormData(prev => ({ ...prev, toAmount: '' }));
    }
  };

  const handleSwapTokens = () => {
    setFormData(prev => ({
      ...prev,
      fromToken: prev.toToken,
      toToken: prev.fromToken,
      fromAmount: prev.toAmount,
      toAmount: prev.fromAmount,
    }));
  };

  const handleSwap = async () => {
    if (!connected) return;
    
    setIsLoading(true);
    // Simulate swap process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    
    // Show success message or redirect
    alert('Swap completed successfully!');
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-6">
            <Zap className="w-16 h-16 mx-auto text-neon-cyan" />
            <h1 className="text-3xl font-orbitron font-bold">Connect Your Wallet</h1>
            <p className="text-gray-400 max-w-md">
              You need to connect your wallet to swap tokens. Connect your Solana wallet to get started.
            </p>
            <WalletConnectButton />
            <Link href="/" className="inline-flex items-center space-x-2 text-neon-blue hover:text-neon-cyan transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white">
      {/* Header */}
      <header className="px-4 py-6 md:px-8">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-6 h-6 text-neon-cyan" />
              <Zap className="w-8 h-8 text-neon-cyan" />
              <h1 className="text-2xl font-orbitron font-bold bg-gradient-to-r from-neon-pink to-neon-blue bg-clip-text text-transparent">
                88mph
              </h1>
            </Link>
            <NetworkIndicator />
          </div>
          <WalletConnectButton />
        </nav>
      </header>

      {/* Main Content */}
      <main className="px-4 md:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4">Swap Tokens</h2>
            <p className="text-gray-400">Get the best rates across all Solana DEXs</p>
          </div>

          {/* Swap Card */}
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
            {/* From Token */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-inter font-semibold text-gray-400">From</label>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Balance: 0.00</span>
                  <button className="text-xs text-neon-blue hover:text-neon-cyan transition-colors">
                    MAX
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-black/20 rounded-xl border border-gray-700/50">
                <div className="w-10 h-10 bg-gradient-to-br from-neon-pink to-neon-purple rounded-full flex items-center justify-center font-orbitron font-bold text-sm">
                  {formData.fromToken.symbol[0]}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="0.0"
                    value={formData.fromAmount}
                    onChange={(e) => handleFromAmountChange(e.target.value)}
                    className="w-full bg-transparent text-2xl font-orbitron font-bold text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>
                <button className="flex items-center space-x-2 px-3 py-2 bg-black/30 rounded-lg hover:bg-black/50 transition-colors">
                  <span className="font-semibold">{formData.fromToken.symbol}</span>
                  <TrendingUp className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center my-4">
              <button
                onClick={handleSwapTokens}
                className="w-12 h-12 bg-black/30 rounded-full flex items-center justify-center hover:bg-black/50 transition-colors border border-gray-700/50"
              >
                <ArrowRight className="w-5 h-5 text-neon-cyan" />
              </button>
            </div>

            {/* To Token */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-inter font-semibold text-gray-400">To</label>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Balance: 0.00</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-black/20 rounded-xl border border-gray-700/50">
                <div className="w-10 h-10 bg-gradient-to-br from-neon-blue to-neon-cyan rounded-full flex items-center justify-center font-orbitron font-bold text-sm">
                  {formData.toToken.symbol[0]}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="0.0"
                    value={formData.toAmount}
                    readOnly
                    className="w-full bg-transparent text-2xl font-orbitron font-bold text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>
                <button className="flex items-center space-x-2 px-3 py-2 bg-black/30 rounded-lg hover:bg-black/50 transition-colors">
                  <span className="font-semibold">{formData.toToken.symbol}</span>
                  <TrendingUp className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Swap Routes */}
            {swapRoutes.length > 0 && (
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-inter font-semibold">Best Routes</h4>
                  <button className="text-xs text-neon-blue hover:text-neon-cyan transition-colors flex items-center space-x-1">
                    <RefreshCw className="w-3 h-3" />
                    <span>Refresh</span>
                  </button>
                </div>
                
                {swapRoutes.map((route) => (
                  <div
                    key={route.id}
                    onClick={() => setSelectedRoute(route)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedRoute?.id === route.id
                        ? 'border-neon-blue bg-neon-blue/10'
                        : 'border-gray-700/50 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          route.best ? 'bg-green-400' : 'bg-gray-500'
                        }`} />
                        <span className="font-semibold">{route.name}</span>
                        {route.best && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                            Best
                          </span>
                        )}
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-gray-400">Price Impact: {route.priceImpact}%</div>
                        <div className="text-gray-400">Fee: {route.fee}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Swap Button */}
            <button
              onClick={handleSwap}
              disabled={!formData.fromAmount || !formData.toAmount || isLoading}
              className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-neon-pink to-neon-purple rounded-xl font-inter font-bold text-lg hover:shadow-glow-purple transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Swapping...' : 'Swap'}
            </button>

            {/* Settings */}
            <div className="mt-4 flex items-center justify-between text-sm">
              <button
                onClick={() => setShowSlippageSettings(!showSlippageSettings)}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Slippage: {formData.slippage}%</span>
              </button>
              
              <div className="flex items-center space-x-2 text-gray-400">
                <Info className="w-4 h-4" />
                <span>Powered by Jupiter</span>
              </div>
            </div>

            {/* Slippage Settings */}
            {showSlippageSettings && (
              <div className="mt-4 p-4 bg-black/20 rounded-lg border border-gray-700/50">
                <h5 className="text-sm font-semibold mb-3">Slippage Tolerance</h5>
                <div className="flex space-x-2 mb-3">
                  {[0.1, 0.5, 1.0].map((value) => (
                    <button
                      key={value}
                      onClick={() => setFormData(prev => ({ ...prev, slippage: value }))}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        formData.slippage === value
                          ? 'bg-neon-blue text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {value}%
                    </button>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Custom"
                    value={formData.slippage}
                    onChange={(e) => setFormData(prev => ({ ...prev, slippage: parseFloat(e.target.value) || 0 }))}
                    className="flex-1 px-3 py-1 bg-black/30 border border-gray-700 rounded-lg text-white text-sm focus:border-neon-blue focus:outline-none"
                  />
                  <span className="text-gray-400 text-sm flex items-center">%</span>
                </div>
              </div>
            )}
          </div>

          {/* Popular Tokens */}
          <div className="mt-8">
            <h3 className="text-lg font-orbitron font-bold mb-4">Popular Tokens</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {popularTokens.map((token) => (
                <button
                  key={token.address}
                  onClick={() => setFormData(prev => ({ ...prev, fromToken: token }))}
                  className={`p-3 rounded-lg border transition-all ${
                    formData.fromToken.address === token.address
                      ? 'border-neon-blue bg-neon-blue/10'
                      : 'border-gray-700/50 hover:border-gray-600 bg-black/20'
                  }`}
                >
                  <div className="text-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-neon-pink to-neon-purple rounded-full flex items-center justify-center mx-auto mb-2 font-orbitron font-bold text-sm">
                      {token.symbol[0]}
                    </div>
                    <div className="text-sm font-semibold">{token.symbol}</div>
                    <div className="text-xs text-gray-400">{token.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 