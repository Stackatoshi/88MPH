# 88mph - Memecoin Launchpad

The most electrifying memecoin launchpad on Solana. Launch your token at light speed and travel to the moon faster than Doc Brown's DeLorean.

## 🚀 Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Solana Wallet Integration** with multiple wallet support
- **Responsive Design** with mobile-first approach
- **Modern UI** with neon gradients and animations
- **Real-time Balance Display** when wallet is connected
- **Network Indicator** showing current Solana network

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Fonts**: Inter & Orbitron (Google Fonts)
- **Blockchain**: Solana
- **Wallets**: Phantom, Solflare, Torus

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd 88-MPH
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔗 Wallet Integration

The app includes full Solana wallet integration with the following features:

### Supported Wallets
- **Phantom** - Most popular Solana wallet
- **Solflare** - Feature-rich Solana wallet
- **Torus** - Web3Auth integration

### Features
- **Connect/Disconnect** wallet functionality
- **Real-time balance** display in SOL
- **Network indicator** showing current Solana network (Mainnet)
- **Address display** with truncated format
- **Auto-connect** on page reload
- **Notification system** for connection status

### Usage
1. Click the "Connect Wallet" button in the top-right corner
2. Select your preferred wallet from the modal
3. Approve the connection in your wallet
4. View your balance and network status
5. Disconnect using the wallet button

## 🏗️ Project Structure

```
88-MPH/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with fonts and metadata
│   ├── page.tsx           # Home page component
│   ├── globals.css        # Global styles with Tailwind
│   ├── providers/         # Context providers
│   │   └── WalletProvider.tsx  # Solana wallet provider
│   ├── components/        # Reusable components
│   │   ├── WalletConnectButton.tsx
│   │   ├── NetworkIndicator.tsx
│   │   └── WalletNotification.tsx
│   └── hooks/            # Custom hooks
│       └── useWalletConnection.ts
├── public/                # Static assets
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── next.config.js         # Next.js configuration
```

## 🎨 Customization

### Colors
The project uses custom neon colors defined in `tailwind.config.js`:
- `neon-pink`: #FF1B8D
- `neon-blue`: #00D2FF
- `neon-purple`: #8B5CF6
- `neon-cyan`: #06FFA5

### Fonts
- **Inter**: Used for body text and UI elements
- **Orbitron**: Used for headings and branding

### Wallet Styling
Custom CSS has been added to match the neon theme:
- Gradient buttons with hover effects
- Themed modal dialogs
- Network-specific color coding

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Development

This project was converted from Vite to Next.js to provide:
- Better SEO capabilities
- Server-side rendering
- Improved performance
- Better developer experience
- Built-in routing and API routes

### Wallet Development
- **Network**: Currently set to Solana Mainnet for production
- **Auto-connect**: Enabled for better UX
- **Error handling**: Comprehensive error handling for wallet operations
- **TypeScript**: Full type safety for wallet interactions

## 🎯 Future Enhancements

- Add token creation functionality
- Implement token launch process
- Add real-time token data integration
- Create token management dashboard
- Add transaction history
- Implement token swapping functionality
- Add social features and sharing
- Create mobile app version

## 🔒 Security

- Wallet connections are handled securely through official Solana wallet adapters
- No private keys are stored or transmitted
- All transactions require explicit user approval
- Network validation to prevent wrong network usage

## 📄 License

© 2025 88mph. Built for time travelers, by time travelers.
