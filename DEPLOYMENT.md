# SentinelDID Deployment Guide

## Prerequisites

Before deploying SentinelDID, ensure you have the following installed:

1. **Node.js** (v18 or higher)
2. **Yarn** (v4.x)
3. **Midnight CLI** - Install from Midnight Network documentation
4. **Lace Wallet** - Browser extension for Midnight Testnet

## Environment Setup

### 1. Install Dependencies

```bash
# Install root dependencies
yarn install

# Install workspace dependencies
yarn workspaces foreach install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Contract address (replace with actual deployed contract address)
CONTRACT_ADDRESS=your_deployed_contract_address_here

# Development settings
NODE_ENV=development
```

## Deployment Steps

### Step 1: Build and Deploy Smart Contract

```bash
# Navigate to contract folder
cd Sentineldid-contract-folder

# Build the contract
yarn build

# Deploy to Midnight Testnet (requires wallet setup)
yarn deploy

# Note the deployed contract address for the .env file
```

### Step 2: Update Environment Configuration

After deploying the contract, update the `.env` file with the actual contract address:

```bash
CONTRACT_ADDRESS=0x1234567890abcdef...  # Replace with actual address
```

### Step 3: Start the Application

From the root directory:

```bash
# Start all services using Turbo
yarn start
```

This will start:
- Frontend UI on `http://localhost:3000`
- Backend API on `http://localhost:3001`
- Contract build process

### Step 4: Verify Deployment

1. Open `http://localhost:3000` in your browser
2. Connect your Lace wallet
3. Fill out the KYC form
4. Test minting a DID NFT

## Production Deployment

### Security Considerations

1. **Database**: Replace in-memory KYC storage with secure database
2. **HTTPS**: Enable SSL/TLS certificates
3. **Environment Variables**: Use secure secret management
4. **CORS**: Configure proper CORS origins
5. **Rate Limiting**: Implement API rate limiting
6. **Input Validation**: Add comprehensive input sanitization

### Recommended Production Stack

- **Frontend**: Deploy to Vercel, Netlify, or similar
- **Backend**: Deploy to Railway, Heroku, or cloud providers
- **Database**: PostgreSQL or MongoDB with encryption
- **Monitoring**: Add logging and error tracking

## Troubleshooting

### Common Issues

1. **Port Conflicts**: Ensure ports 3000 and 3001 are available
2. **Wallet Connection**: Verify Lace wallet is installed and connected to Midnight Testnet
3. **Contract Address**: Ensure CONTRACT_ADDRESS in .env matches deployed contract
4. **CLI Errors**: Verify midnight-cli is properly installed and configured

### Debug Mode

Enable debug logging:

```bash
NODE_ENV=development yarn start
```

### Logs Location

- Frontend: Browser console
- Backend: Terminal output
- Contract: Midnight CLI output

## API Endpoints

- `POST /mint-nft` - Mint a new DID NFT
- `GET /check-did/:didId` - Check if DID exists
- `POST /verify-age` - Verify age using ZK proofs
- `GET /stats` - Get system statistics

## Support

For issues and support:
1. Check the logs for error messages
2. Verify all prerequisites are installed
3. Ensure wallet is properly connected
4. Review the contract deployment status

## Next Steps

After successful deployment:
1. Test the full user journey
2. Implement additional security measures
3. Add monitoring and analytics
4. Consider scaling infrastructure
5. Audit smart contract security
