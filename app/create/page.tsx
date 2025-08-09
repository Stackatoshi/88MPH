'use client';

import React, { useState } from 'react';
import { ArrowLeft, Upload, Zap, TrendingUp, Clock, Users, DollarSign, Link as LinkIcon, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletConnectButton } from '../components/WalletConnectButton';
import { NetworkIndicator } from '../components/NetworkIndicator';
import { TokenCreationModal } from '../components/TokenCreationModal';
import Link from 'next/link';

interface TokenFormData {
  name: string;
  symbol: string;
  description: string;
  image: File | null;
  video: File | null;
  socialLinks: {
    twitter: string;
    telegram: string;
    website: string;
  };
  tokenomics: {
    totalSupply: string;
    initialPrice: string;
    vestingPeriod: string;
    teamAllocation: string;
  };
}

export default function CreateToken() {
  const { connected } = useWallet();
  const [currentStep, setCurrentStep] = useState(1);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [formData, setFormData] = useState<TokenFormData>({
    name: '',
    symbol: '',
    description: '',
    image: null,
    video: null,
    socialLinks: {
      twitter: '',
      telegram: '',
      website: '',
    },
    tokenomics: {
      totalSupply: '1000000',
      initialPrice: '0.0001',
      vestingPeriod: '12',
      teamAllocation: '10',
    },
  });

  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleFileUpload = (file: File) => {
    if (file.type.startsWith('image/')) {
      setFormData(prev => ({ ...prev, image: file }));
    } else if (file.type.startsWith('video/')) {
      setFormData(prev => ({ ...prev, video: file }));
    }
    
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const steps = [
    { id: 1, name: 'Token Basics', icon: Zap },
    { id: 2, name: 'Tokenomics', icon: TrendingUp },
    { id: 3, name: 'Review & Launch', icon: CheckCircle },
  ];

  const renderStep1 = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-orbitron font-bold mb-4">Token Details</h3>
            <p className="text-gray-400 mb-6">Choose carefully, these can&apos;t be changed once the token is created.</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-inter font-semibold mb-2">Coin Name</label>
                <input
                  type="text"
                  placeholder="Name your coin"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-neon-blue focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-inter font-semibold mb-2">Ticker</label>
                <input
                  type="text"
                  placeholder="Add a coin ticker (e.g. DOGE)"
                  value={formData.symbol}
                  onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value }))}
                  className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-neon-blue focus:outline-none transition-colors"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-inter font-semibold mb-2">Description (Optional)</label>
              <textarea
                placeholder="Write a short description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-neon-blue focus:outline-none transition-colors resize-none"
              />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-orbitron font-bold mb-4 flex items-center space-x-2">
              <LinkIcon className="w-5 h-5" />
              <span>Social Links (Optional)</span>
            </h4>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Twitter/X URL"
                value={formData.socialLinks.twitter}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                }))}
                className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-neon-blue focus:outline-none transition-colors"
              />
              <input
                type="text"
                placeholder="Telegram URL"
                value={formData.socialLinks.telegram}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  socialLinks: { ...prev.socialLinks, telegram: e.target.value }
                }))}
                className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-neon-blue focus:outline-none transition-colors"
              />
              <input
                type="text"
                placeholder="Website URL"
                value={formData.socialLinks.website}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  socialLinks: { ...prev.socialLinks, website: e.target.value }
                }))}
                className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-neon-blue focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Right Column - File Upload */}
        <div>
          <h3 className="text-xl font-orbitron font-bold mb-4">Token Media</h3>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-neon-blue bg-neon-blue/10' 
                : 'border-gray-700 hover:border-neon-blue'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {previewUrl ? (
              <div className="space-y-4">
                <div className="relative">
                  {formData.image && (
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                  {formData.video && (
                    <video 
                      src={previewUrl} 
                      controls 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                  <button
                    onClick={() => {
                      setFormData(prev => ({ ...prev, image: null, video: null }));
                      setPreviewUrl('');
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
                <p className="text-sm text-gray-400">
                  {formData.image ? formData.image.name : formData.video?.name}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-16 h-16 mx-auto text-gray-500" />
                <div>
                  <p className="text-lg font-inter font-semibold mb-2">
                    Select video or image to upload
                  </p>
                  <p className="text-gray-400 mb-4">
                    or drag and drop it here
                  </p>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-cyan rounded-lg font-inter font-semibold cursor-pointer hover:shadow-glow-blue transition-all duration-300"
                  >
                    Choose File
                  </label>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Image - max 15mb. &apos;.jpg&apos;, &apos;.gif&apos; or &apos;.png&apos; recommended</p>
                  <p>Video - max 30mb. &apos;.mp4&apos; recommended</p>
                  <p>Image - min. 1000x1000px, 1:1 square recommended</p>
                  <p>Video - 16:9 or 9:16, 1080p+ recommended</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-orbitron font-bold mb-4">Tokenomics</h3>
        <p className="text-gray-400 mb-6">Configure your token&apos;s economic parameters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-inter font-semibold mb-2">Total Supply</label>
            <input
              type="text"
              placeholder="1000000"
              value={formData.tokenomics.totalSupply}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                tokenomics: { ...prev.tokenomics, totalSupply: e.target.value }
              }))}
              className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-neon-blue focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-inter font-semibold mb-2">Initial Price (SOL)</label>
            <input
              type="text"
              placeholder="0.0001"
              value={formData.tokenomics.initialPrice}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                tokenomics: { ...prev.tokenomics, initialPrice: e.target.value }
              }))}
              className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-neon-blue focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-inter font-semibold mb-2">Vesting Period (months)</label>
            <input
              type="text"
              placeholder="12"
              value={formData.tokenomics.vestingPeriod}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                tokenomics: { ...prev.tokenomics, vestingPeriod: e.target.value }
              }))}
              className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-neon-blue focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-inter font-semibold mb-2">Team Allocation (%)</label>
            <input
              type="text"
              placeholder="10"
              value={formData.tokenomics.teamAllocation}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                tokenomics: { ...prev.tokenomics, teamAllocation: e.target.value }
              }))}
              className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-neon-blue focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
          <h4 className="text-lg font-orbitron font-bold mb-4">Token Preview</h4>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Name:</span>
              <span className="font-semibold">{formData.name || 'Your Token'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Symbol:</span>
              <span className="font-semibold">{formData.symbol || 'TKN'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Supply:</span>
              <span className="font-semibold">{formData.tokenomics.totalSupply || '0'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Initial Price:</span>
              <span className="font-semibold">{formData.tokenomics.initialPrice || '0'} SOL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Market Cap:</span>
              <span className="font-semibold text-neon-cyan">
                {((parseFloat(formData.tokenomics.totalSupply) || 0) * (parseFloat(formData.tokenomics.initialPrice) || 0)).toFixed(2)} SOL
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-orbitron font-bold mb-4">Review & Launch</h3>
        <p className="text-gray-400 mb-6">Review your token details before launching to the Solana network.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-black/20 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
            <h4 className="text-lg font-orbitron font-bold mb-4">Token Information</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Name:</span>
                <span className="font-semibold">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Symbol:</span>
                <span className="font-semibold">{formData.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Description:</span>
                <span className="font-semibold">{formData.description || 'No description'}</span>
              </div>
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
            <h4 className="text-lg font-orbitron font-bold mb-4">Tokenomics</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Supply:</span>
                <span className="font-semibold">{formData.tokenomics.totalSupply}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Initial Price:</span>
                <span className="font-semibold">{formData.tokenomics.initialPrice} SOL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Vesting Period:</span>
                <span className="font-semibold">{formData.tokenomics.vestingPeriod} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Team Allocation:</span>
                <span className="font-semibold">{formData.tokenomics.teamAllocation}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-black/20 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
            <h4 className="text-lg font-orbitron font-bold mb-4">Launch Summary</h4>
            <div className="space-y-4">
              <div className="text-center p-4 bg-gradient-to-r from-neon-pink to-neon-purple rounded-lg">
                <div className="text-2xl font-orbitron font-bold">Ready to Launch!</div>
                <div className="text-sm text-gray-300 mt-2">Your token is ready to hit 88mph</div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Wallet connected</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Token details verified</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Tokenomics configured</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Ready for Mainnet deployment</span>
                </div>
              </div>
            </div>
          </div>

          <button
            className="w-full px-8 py-4 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue rounded-lg font-inter font-bold text-xl hover:shadow-glow-purple transition-all duration-300 transform hover:scale-105"
            onClick={() => setShowTokenModal(true)}
          >
            Launch Token
          </button>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-6">
            <Zap className="w-16 h-16 mx-auto text-neon-cyan" />
            <h1 className="text-3xl font-orbitron font-bold">Connect Your Wallet</h1>
            <p className="text-gray-400 max-w-md">
              You need to connect your wallet to create a token. Connect your Solana wallet to get started.
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

      {/* Progress Steps */}
      <div className="px-4 md:px-8 mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center space-x-3 ${
                  currentStep >= step.id ? 'text-neon-cyan' : 'text-gray-500'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= step.id 
                      ? 'border-neon-cyan bg-neon-cyan/20' 
                      : 'border-gray-600'
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className="font-inter font-semibold hidden md:block">{step.name}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-neon-cyan' : 'bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 md:px-8 pb-16">
        <div className="max-w-6xl mx-auto">
          {renderCurrentStep()}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12">
            <button
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="px-6 py-3 border-2 border-neon-pink rounded-lg font-inter font-semibold hover:bg-neon-pink hover:shadow-glow-pink transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <button
              onClick={() => setCurrentStep(prev => Math.min(3, prev + 1))}
              disabled={currentStep === 3}
              className="px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-cyan rounded-lg font-inter font-semibold hover:shadow-glow-blue transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === 3 ? 'Launch Token' : 'Next'}
            </button>
          </div>
        </div>
      </main>

      {/* Token Creation Modal */}
      {showTokenModal && (
        <TokenCreationModal
          isOpen={showTokenModal}
          onClose={() => setShowTokenModal(false)}
          tokenParams={{
            name: formData.name,
            symbol: formData.symbol,
            description: formData.description,
            imageUrl: formData.image ? URL.createObjectURL(formData.image) : undefined,
            totalSupply: parseInt(formData.tokenomics.totalSupply),
            initialPrice: parseFloat(formData.tokenomics.initialPrice),
            vestingPeriod: parseInt(formData.tokenomics.vestingPeriod),
            teamAllocation: parseInt(formData.tokenomics.teamAllocation),
            decimals: 9
          }}
        />
      )}
    </div>
  );
} 