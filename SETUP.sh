#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}  Fleet & Shipment Tracking System${NC}"
echo -e "${BLUE}  Backend Setup Script${NC}"
echo -e "${BLUE}============================================${NC}\n"

# Check if Node.js is installed
echo -e "${YELLOW}🔍 Checking Node.js installation...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo -e "${YELLOW}Please install Node.js from https://nodejs.org/${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node --version) found${NC}\n"

# Check if npm is installed
echo -e "${YELLOW}🔍 Checking npm installation...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm $(npm --version) found${NC}\n"

# Create project structure
echo -e "${YELLOW}📁 Creating project structure...${NC}"
mkdir -p src/{config,models,middleware,routes,utils}
mkdir -p seeders
echo -e "${GREEN}✅ Project structure created${NC}\n"

# Copy environment file
echo -e "${YELLOW}⚙️  Setting up environment variables...${NC}"
if [ ! -f .env ]; then
    cat > .env << EOF
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/fleet-tracking

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your-refresh-token-secret

# Client Configuration
CLIENT_URL=http://localhost:5173
SOCKET_URL=http://localhost:5000

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Mapbox Configuration (for maps)
MAPBOX_TOKEN=your_mapbox_token
EOF
    echo -e "${GREEN}✅ .env file created${NC}"
    echo -e "${YELLOW}⚠️  Update .env file with your configuration${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi
echo ""

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Dependencies installed${NC}\n"

# Copy files to correct locations
echo -e "${YELLOW}📋 Organizing files...${NC}"

# Models
echo -e "   Copying models..."
cp server-src-models-*.js src/models/ 2>/dev/null

# Routes
echo -e "   Copying routes..."
cp server-src-routes-*.js src/routes/ 2>/dev/null

# Middleware
echo -e "   Copying middleware..."
cp server-src-middleware-*.js src/middleware/ 2>/dev/null

# Config
echo -e "   Copying config..."
cp server-src-config-*.js src/config/ 2>/dev/null

# Utils
echo -e "   Copying utils..."
cp utils-*.js src/utils/ 2>/dev/null

# Middleware errors
echo -e "   Copying error handling..."
cp middleware-*.js src/middleware/ 2>/dev/null

# Server file
echo -e "   Copying server file..."
cp server-src-server.js src/server.js 2>/dev/null

# Seeders
echo -e "   Copying seeders..."
cp seeders-*.js seeders/ 2>/dev/null

# Gitignore
echo -e "   Setting up .gitignore..."
cp gitignore .gitignore 2>/dev/null

echo -e "${GREEN}✅ Files organized${NC}\n"

# Create directories that might be missing
mkdir -p src/utils
mkdir -p src/middleware

# Verify MongoDB
echo -e "${YELLOW}🗄️  Checking MongoDB...${NC}"
if command -v mongod &> /dev/null; then
    echo -e "${GREEN}✅ MongoDB is installed${NC}"
else
    echo -e "${YELLOW}⚠️  MongoDB not found locally${NC}"
    echo -e "${YELLOW}   You can use MongoDB Atlas instead${NC}"
    echo -e "${YELLOW}   Update MONGO_URI in .env file${NC}"
fi
echo ""

# Summary
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}✅ Setup completed successfully!${NC}"
echo -e "${GREEN}============================================${NC}\n"

echo -e "${BLUE}📝 Next Steps:${NC}"
echo -e "   1. Edit .env file with your configuration"
echo -e "   2. Ensure MongoDB is running or set MongoDB Atlas URI"
echo -e "   3. Run: ${YELLOW}npm run dev${NC}"
echo -e "   4. Test: ${YELLOW}curl http://localhost:5000/api/v1/health${NC}"
echo -e "   5. (Optional) Seed database: ${YELLOW}npm run seed${NC}\n"

echo -e "${BLUE}📋 Available Commands:${NC}"
echo -e "   ${YELLOW}npm run dev${NC}    - Start development server with auto-reload"
echo -e "   ${YELLOW}npm start${NC}      - Start production server"
echo -e "   ${YELLOW}npm run seed${NC}   - Populate database with test data\n"

echo -e "${BLUE}🔑 Test Credentials (after seeding):${NC}"
echo -e "   Email: admin@fleet.com"
echo -e "   Password: password123"
echo -e "   Role: super_admin\n"

echo -e "${YELLOW}📚 Documentation:${NC}"
echo -e "   - README.md - Complete documentation"
echo -e "   - QUICK-START.md - Quick reference"
echo -e "   - DAY1-SETUP.md - Detailed setup guide\n"

echo -e "${GREEN}Good luck! Happy coding! 🚀${NC}\n"
