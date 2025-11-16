# Annapoorna - Blockchain Donation dApp

A transparent donation platform built on the Aptos blockchain that enables secure donations and redemptions for food distribution programs.

## Features

- **Blockchain-Powered**: All transactions recorded on Aptos blockchain for complete transparency
- **Secure Donations**: Make donations with APT tokens through connected Petra wallet
- **Redemption System**: Authorized admins can distribute funds to beneficiaries
- **Transaction History**: View all donations and redemptions on the blockchain
- **Admin Dashboard**: Monitor donation pool statistics and manage the system
- **Responsive Design**: Modern, mobile-friendly interface

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: TailwindCSS
- **Blockchain**: Aptos Network
- **Smart Contracts**: Move language
- **Wallet Integration**: Petra Wallet via @aptos-labs/wallet-adapter
- **Icons**: Lucide React

## Smart Contract

The Move smart contract (`move/sources/donation.move`) includes:

- `initialize`: Set up the donation pool
- `donate`: Accept donations with messages
- `redeem`: Distribute funds to beneficiaries (admin only)
- View functions for querying pool stats, balances, and donor information

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Petra Wallet browser extension
- Aptos CLI (for smart contract deployment)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Deploy the Move smart contract:
```bash
cd move
aptos move compile
aptos move publish
```

3. Update the `MODULE_ADDRESS` in `src/config/constants.ts` with your deployed module address

4. Start the development server:
```bash
npm run dev
```

## Usage

### For Donors

1. Connect your Petra wallet
2. Navigate to the Donate page
3. Enter donation amount and optional message
4. Confirm the transaction in your wallet

### For Admins

1. Connect your admin wallet
2. Initialize the donation pool (first time only)
3. Access the Admin dashboard to view statistics
4. Use the Redeem page to distribute funds to beneficiaries

## Project Structure

```
├── move/                       # Move smart contracts
│   ├── sources/
│   │   └── donation.move      # Main donation contract
│   └── Move.toml
├── src/
│   ├── components/            # React components
│   │   └── Navbar.tsx
│   ├── contexts/              # React contexts
│   │   └── WalletContext.tsx
│   ├── hooks/                 # Custom hooks
│   │   └── useContract.ts
│   ├── pages/                 # Page components
│   │   ├── Home.tsx
│   │   ├── Donate.tsx
│   │   ├── Redeem.tsx
│   │   ├── History.tsx
│   │   └── Admin.tsx
│   ├── config/                # Configuration
│   │   └── constants.ts
│   └── App.tsx
└── package.json
```

## Smart Contract Functions

### Entry Functions
- `initialize(admin: &signer)` - Initialize the donation pool
- `donate(donor: &signer, pool_address: address, amount: u64, message: vector<u8>)` - Make a donation
- `redeem(admin: &signer, beneficiary: address, amount: u64, purpose: vector<u8>)` - Redeem funds

### View Functions
- `get_pool_balance(pool_address: address): u64` - Get current pool balance
- `get_total_donations(pool_address: address): u64` - Get total donations
- `get_total_redemptions(pool_address: address): u64` - Get total redemptions
- `get_donor_stats(donor_address: address): (u64, u64)` - Get donor statistics
- `is_admin(pool_address: address, user_address: address): bool` - Check admin status

## Build for Production

```bash
npm run build
```

## Contributing

Contributions are welcome! Please ensure all smart contract changes are thoroughly tested before deployment.

## License

MIT
