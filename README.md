# PaySlab - Blockchain-Powered Nigerian Trade Platform

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.1.3-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Base-0052FF?style=for-the-badge&logo=ethereum&logoColor=white" alt="Base Blockchain" />
  <img src="https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white" alt="Solidity" />
  <img src="https://img.shields.io/badge/Foundry-000000?style=for-the-badge&logo=ethereum&logoColor=white" alt="Foundry" />
  <img src="https://img.shields.io/badge/USDC-2775CA?style=for-the-badge&logo=ethereum&logoColor=white" alt="USDC" />
</div>

## 🌍 Overview

PaySlab is a revolutionary blockchain platform that solves Nigeria's $50B USD access crisis by enabling instant NGN→USDC conversion and providing smart contract-powered trade protection for international commerce.

### 🚨 The Problem We Solve

- **Nigerian traders cannot access USD** for international trade due to banking restrictions
- **30%+ black market premiums** force businesses to pay extreme costs
- **2-6 months bank approval** delays critical business operations
- **$45B in blocked trade** annually hurts Nigeria's GDP growth

### ✅ Our Solution

- **Instant NGN→USDC conversion** at fair rates (1.5% fee vs 30%+ black market)
- **Smart contract escrow** that auto-releases payments based on verified delivery milestones
- **Professional Letter of Credit** with SGS quality inspection for agricultural exports
- **Complete trade management** with shipment tracking and document management

## 🎯 Key Features

### 💱 Currency Conversion
- **Real-time NGN to USDC conversion** with competitive rates
- **95% cost savings** compared to black market rates
- **10-minute processing** vs 6-month bank approval
- **Transparent fee structure** with no hidden costs

### 🛒 Trade Management
- **Escrow-protected transactions** with milestone-based payments
- **Shipment tracking** with DHL/FedEx integration
- **Document management** with PDF downloads
- **Supplier communication** and dispute resolution

### 📋 Letter of Credit
- **Smart contract automation** for agricultural exports
- **SGS quality inspection** integration
- **48-hour approval** vs 6-8 weeks traditional banking
- **95% cheaper** than traditional bank LoCs ($1,200 vs $5,000+)

### 💳 Wallet Management
- **Dual currency support** (NGN and USDC)
- **Transaction history** with detailed filtering
- **Secure deposit/withdrawal** with multiple payment methods
- **Balance privacy controls** and address management

### 📊 Dashboard Analytics
- **Real-time trade monitoring** with progress tracking
- **Exchange rate comparisons** vs bank rates
- **Transaction analytics** and performance metrics
- **Quick actions** for common operations

## 🛠️ Technology Stack

### Frontend
- **Next.js 15.1.3** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Phosphor Icons** - Beautiful icon system

### Blockchain Integration
- **Base Network** - Low-cost Ethereum L2
- **USDC** - Stable cryptocurrency for payments
- **Smart Contracts** - Automated escrow and LoC execution
- **Wagmi** - React hooks for Ethereum

### Design System
- **Purple Brand Colors** - #8b61c2 primary, #7952a8 hover
- **Responsive Design** - Mobile-first approach
- **Accessible UI** - WCAG AA compliant
- **Smooth Animations** - 200ms transitions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/payslab-frontend.git
   cd payslab-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your environment variables:
   ```env
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
   NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
payslab-frontend/
├── app/                          # Next.js App Router
│   ├── components/               # Reusable components
│   │   ├── core/                # Layout components
│   │   │   ├── Layout.tsx       # Main layout wrapper
│   │   │   ├── Navbar.tsx       # Top navigation
│   │   │   └── Sidebar.tsx      # Side navigation
│   │   ├── ui/                  # UI components
│   │   │   ├── Button.tsx       # Button component
│   │   │   ├── Card.tsx         # Card component
│   │   │   ├── StatusBadge.tsx  # Status indicators
│   │   │   └── ProgressTracker.tsx # Progress visualization
│   │   ├── trades/              # Trade-specific components
│   │   └── users/               # User-specific components
│   ├── convert/                 # NGN to USDC conversion
│   ├── credit/                  # Letter of Credit application
│   ├── dashboard/               # Main dashboard
│   ├── trades/                  # Trade management
│   ├── users/                   # User management
│   ├── wallet/                  # Wallet management
│   └── types/                   # TypeScript type definitions
├── public/                      # Static assets
└── utils/                       # Utility functions
```

## 🎨 Design System

### Colors
```css
/* Primary Purple */
--primary: #8b61c2;
--primary-hover: #7952a8;

/* Status Colors */
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
--info: #3b82f6;
```

### Typography
- **Font Family**: Geist Sans (system font)
- **Headings**: Bold, clear hierarchy
- **Body Text**: 14px base size, good contrast
- **Monospace**: For addresses and codes

## 💼 Use Cases

### For Nigerian Importers
1. **Convert NGN to USDC** instantly
2. **Pay suppliers** with escrow protection
3. **Track shipments** in real-time
4. **Manage documents** and invoices

### For Nigerian Exporters
1. **Apply for Letter of Credit** in 48 hours
2. **Get SGS quality certification**
3. **Receive payments** automatically on delivery
4. **Access global markets** with confidence

### For International Suppliers
1. **Receive secure payments** via smart contracts
2. **Trust Nigerian buyers** with LoC guarantees
3. **Track quality standards** objectively
4. **Reduce payment risks** to zero

## 🔐 Security Features

- **Smart Contract Escrow** - Funds held securely until conditions met
- **Multi-signature Wallets** - Enhanced security for large transactions
- **KYC/AML Compliance** - Full regulatory compliance
- **Audit Trail** - Complete transaction history on blockchain

## 🌟 Why PaySlab?

### vs Traditional Banking
- ✅ **95% cheaper** (1.5% vs 30%+ fees)
- ✅ **1000x faster** (minutes vs months)
- ✅ **24/7 available** (vs bank hours)
- ✅ **No minimums** ($100 vs $50,000+)

### vs Black Market
- ✅ **95% cost savings** (1.5% vs 30%+ premium)
- ✅ **Zero fraud risk** (smart contracts vs cash)
- ✅ **Large amounts** ($100K+ vs small cash limits)
- ✅ **Legal compliance** (regulated vs underground)

### vs Other Crypto Solutions
- ✅ **Nigerian-first** (built for NGN flows)
- ✅ **Trade integration** (convert + trade + protect)
- ✅ **Regulatory compliance** (CBN guidelines)
- ✅ **Professional quality** (SGS inspection)

## 📈 Market Impact

- **$50B Total Addressable Market** - Nigerian trade volume
- **$45B Blocked Trade** - Our immediate opportunity
- **90% SME Exclusion** - Current banking system failure
- **2,000% Cost Reduction** - Our solution advantage

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 📞 Contact & Support

- **Website**: [https://payslab.com](https://payslab.com)
- **Email**: support@payslab.com
- **Twitter**: [@PaySlabHQ](https://twitter.com/PaySlabHQ)
- **Telegram**: [PaySlab Community](https://t.me/payslab)

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Docker
```bash
docker build -t payslab-frontend .
docker run -p 3000:3000 payslab-frontend
```

## 🎯 Roadmap

- [ ] **Q1 2025**: Launch MVP with conversion and basic trades
- [ ] **Q2 2025**: Add Letter of Credit functionality
- [ ] **Q3 2025**: Integrate with major Nigerian banks
- [ ] **Q4 2025**: Expand to Ghana, Kenya, other African markets

---

<div align="center">
  <p><strong>PaySlab: Turning Nigeria's USD crisis into USD opportunity through blockchain innovation</strong></p>
  <p>Made with ❤️ for Nigerian traders</p>
</div>
