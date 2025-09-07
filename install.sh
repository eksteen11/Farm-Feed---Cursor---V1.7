#!/bin/bash

echo "🚀 Setting up Farm Feed - South African Grain & Feed Trading Platform"
echo "=================================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    echo "   Please upgrade Node.js and try again."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "🔧 Creating .env.local file..."
    cat > .env.local << EOF
# Farm Feed Environment Variables
NEXT_PUBLIC_APP_NAME=Farm Feed
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Add your API keys and configuration here
# PAYSTACK_PUBLIC_KEY=your_paystack_public_key
# PAYSTACK_SECRET_KEY=your_paystack_secret_key
EOF
    echo "✅ .env.local file created"
fi

echo ""
echo "🎉 Setup complete! You can now start the development server:"
echo ""
echo "   npm run dev"
echo ""
echo "📱 Open your browser and navigate to: http://localhost:3000"
echo ""
echo "🔐 Demo accounts available:"
echo "   Buyer: sarah@feedmill.co.za / password"
echo "   Seller: john@maizefarm.co.za / password"
echo "   Admin: admin@farmfeed.co.za / password"
echo ""
echo "📚 For more information, check the README.md file"
echo ""
echo "Happy coding! 🚀"






