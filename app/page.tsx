'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, TrendingUp, Clock, Users, DollarSign } from 'lucide-react';
import { WalletConnectButton } from './components/WalletConnectButton';
import { NetworkIndicator } from './components/NetworkIndicator';
import { WalletNotification } from './components/WalletNotification';

interface LaunchItem {
  name: string;
  symbol: string;
  marketCap: string;
  holders: number;
  timeLeft: string;
  change24h: number;
}

const mockLaunches: LaunchItem[] = [
  {
    name: "DeLorean Token",
    symbol: "DMC",
    marketCap: "$2.4M",
    holders: 1885,
    timeLeft: "23h 45m",
    change24h: 284.5
  },
  {
    name: "Flux Capacitor",
    symbol: "FLUX",
    marketCap: "$890K",
    holders: 967,
    timeLeft: "15h 22m",
    change24h: 156.8
  },
  {
    name: "Time Travel",
    symbol: "1955",
    marketCap: "$456K",
    holders: 523,
    timeLeft: "8h 33m",
    change24h: 89.3
  },
  {
    name: "McFly Coin",
    symbol: "MCFLY",
    marketCap: "$234K",
    holders: 312,
    timeLeft: "4h 17m",
    change24h: 45.7
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white">
      <WalletNotification />
      {/* Header */}
      <header className="px-4 py-6 md:px-8">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Zap className="w-8 h-8 text-neon-cyan" />
            <h1 className="text-2xl font-orbitron font-bold bg-gradient-to-r from-neon-pink to-neon-blue bg-clip-text text-transparent">
              88mph
            </h1>
            <NetworkIndicator />
          </div>
          
          {/* Navigation Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors font-inter font-medium">
              Home
            </Link>
            <Link href="/swap" className="text-gray-300 hover:text-white transition-colors font-inter font-medium">
              Swap
            </Link>
            <Link href="/create" className="text-gray-300 hover:text-white transition-colors font-inter font-medium">
              Create
            </Link>
            <Link href="/liquidity" className="text-gray-300 hover:text-white transition-colors font-inter font-medium">
              Liquidity
            </Link>
          </div>
          
          <WalletConnectButton />
        </nav>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-16 md:px-8 md:py-24">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-orbitron font-black mb-6 leading-tight">
            When this baby hits{' '}
            <span className="bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue bg-clip-text text-transparent animate-pulse">
              88mph
            </span>
          </h2>
          <p className="text-xl md:text-2xl font-inter text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            The most electrifying memecoin launchpad on Solana. Launch your token at light speed 
            and travel to the moon faster than Doc Brown&apos;s DeLorean.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/create" className="px-8 py-4 bg-gradient-to-r from-neon-blue to-neon-cyan rounded-full font-inter font-bold text-lg hover:shadow-glow-blue transition-all duration-300 transform hover:scale-105 inline-block">
              Create Token
            </Link>
            <Link href="/swap" className="px-8 py-4 bg-gradient-to-r from-neon-pink to-neon-purple rounded-full font-inter font-bold text-lg hover:shadow-glow-pink transition-all duration-300 transform hover:scale-105 inline-block">
              Swap Tokens
            </Link>
            <Link href="/liquidity" className="px-8 py-4 border-2 border-neon-cyan rounded-full font-inter font-semibold text-lg hover:bg-neon-cyan hover:shadow-glow-cyan transition-all duration-300 transform hover:scale-105 inline-block">
              Liquidity Pools
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-12 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-black/20 backdrop-blur-sm rounded-xl border border-gray-700/50">
              <div className="text-3xl md:text-4xl font-orbitron font-bold text-neon-cyan mb-2">$12.8M</div>
              <div className="text-gray-400 font-inter">Total Volume</div>
            </div>
            <div className="text-center p-6 bg-black/20 backdrop-blur-sm rounded-xl border border-gray-700/50">
              <div className="text-3xl md:text-4xl font-orbitron font-bold text-neon-pink mb-2">247</div>
              <div className="text-gray-400 font-inter">Tokens Launched</div>
            </div>
            <div className="text-center p-6 bg-black/20 backdrop-blur-sm rounded-xl border border-gray-700/50">
              <div className="text-3xl md:text-4xl font-orbitron font-bold text-neon-purple mb-2">15.2K</div>
              <div className="text-gray-400 font-inter">Active Traders</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Launches */}
      <section className="px-4 py-16 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl md:text-3xl font-orbitron font-bold flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-neon-cyan" />
              <span>Trending Launches</span>
            </h3>
            <button className="text-neon-blue hover:text-neon-cyan font-inter font-semibold transition-colors">
              View All →
            </button>
          </div>
          
          <div className="grid gap-4">
            {mockLaunches.map((launch, index) => (
              <div 
                key={index}
                className="bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-neon-blue/50 transition-all duration-300 hover:shadow-glow-blue"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-neon-pink to-neon-purple rounded-full flex items-center justify-center font-orbitron font-bold text-lg">
                      {launch.symbol[0]}
                    </div>
                    <div>
                      <h4 className="font-inter font-bold text-lg">{launch.name}</h4>
                      <p className="text-gray-400 font-mono">${launch.symbol}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-neon-cyan" />
                      <span className="font-semibold">{launch.marketCap}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-neon-purple" />
                      <span>{launch.holders.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-neon-pink" />
                      <span>{launch.timeLeft}</span>
                    </div>
                    <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full font-semibold">
                      +{launch.change24h}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-orbitron font-bold mb-6">
            Ready to go back to the future?
          </h3>
          <p className="text-xl text-gray-300 mb-8 font-inter">
            Join the time travelers launching the next generation of memecoins on Solana.
          </p>
          <Link href="/create" className="px-12 py-4 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue rounded-full font-inter font-bold text-xl hover:shadow-glow-purple transition-all duration-300 transform hover:scale-105 inline-block">
            Start Your Journey
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 md:px-8 border-t border-gray-700/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <Zap className="w-6 h-6 text-neon-cyan" />
            <span className="font-orbitron font-bold text-lg">88mph</span>
          </div>
          <div className="text-gray-400 font-inter text-sm text-center md:text-left">
            © 2025 88mph. Built for time travelers, by time travelers.
          </div>
        </div>
      </footer>
    </div>
  );
} 