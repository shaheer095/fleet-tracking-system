mkdir -p server/src/{config,models,middleware,routes,utils}@echo off
setlocal enabledelayedexpansion

REM Colors
REM Note: Windows CMD doesn't support ANSI colors natively, using basic output

echo.
echo ============================================
echo  Fleet ^& Shipment Tracking System
echo  Backend Setup Script
echo ============================================
echo.

REM Check if Node.js is installed
echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo OK: Node.js %NODE_VERSION% found
echo.

REM Check if npm is installed
echo Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo OK: npm %NPM_VERSION% found
echo.

REM Create project structure
echo Creating project structure...
if not exist src mkdir src
if not exist src\config mkdir src\config
if not exist src\models mkdir src\models
if not exist src\middleware mkdir src\middleware
if not exist src\routes mkdir src\routes
if not exist src\utils mkdir src\utils
if not exist seeders mkdir seeders
echo OK: Project structure created
echo.

REM Create .env file
echo Setting up environment variables...
if not exist .env (
    (
        echo # Server Configuration
        echo PORT=5000
        echo NODE_ENV=development
        echo.
        echo # MongoDB Configuration
        echo MONGO_URI=mongodb://localhost:27017/fleet-tracking
        echo.
        echo # JWT Configuration
        echo JWT_SECRET=your-secret-key-change-in-production
        echo JWT_EXPIRES_IN=7d
        echo REFRESH_TOKEN_SECRET=your-refresh-token-secret
        echo.
        echo # Client Configuration
        echo CLIENT_URL=http://localhost:5173
        echo SOCKET_URL=http://localhost:5000
        echo.
        echo # Email Configuration
        echo EMAIL_HOST=smtp.gmail.com
        echo EMAIL_PORT=587
        echo EMAIL_USER=your_email@gmail.com
        echo EMAIL_PASSWORD=your_app_password
        echo.
        echo # Cloudinary Configuration
        echo CLOUDINARY_CLOUD_NAME=your_cloud_name
        echo CLOUDINARY_API_KEY=your_api_key
        echo CLOUDINARY_API_SECRET=your_api_secret
        echo.
        echo # Mapbox Configuration
        echo MAPBOX_TOKEN=your_mapbox_token
    ) > .env
    echo OK: .env file created
    echo WARNING: Update .env file with your configuration
) else (
    echo OK: .env file already exists
)
echo.

REM Install dependencies
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    exit /b 1
)
echo OK: Dependencies installed
echo.

REM Copy files
echo Organizing files...
echo    Copying models...
for %%f in (server-src-models-*.js) do copy "%%f" "src\models\" >nul 2>&1

echo    Copying routes...
for %%f in (server-src-routes-*.js) do copy "%%f" "src\routes\" >nul 2>&1

echo    Copying middleware...
for %%f in (server-src-middleware-*.js) do copy "%%f" "src\middleware\" >nul 2>&1
for %%f in (middleware-*.js) do copy "%%f" "src\middleware\" >nul 2>&1

echo    Copying config...
for %%f in (server-src-config-*.js) do copy "%%f" "src\config\" >nul 2>&1

echo    Copying utils...
for %%f in (utils-*.js) do copy "%%f" "src\utils\" >nul 2>&1

echo    Copying server file...
copy "server-src-server.js" "src\server.js" >nul 2>&1

echo    Copying seeders...
for %%f in (seeders-*.js) do copy "%%f" "seeders\" >nul 2>&1

echo    Setting up .gitignore...
copy "gitignore" ".gitignore" >nul 2>&1

echo OK: Files organized
echo.

echo ============================================
echo OK: Setup completed successfully!
echo ============================================
echo.

echo Next Steps:
echo   1. Edit .env file with your configuration
echo   2. Ensure MongoDB is running or set MongoDB Atlas URI
echo   3. Run: npm run dev
echo   4. Test: curl http://localhost:5000/api/v1/health
echo   5. (Optional) Seed database: npm run seed
echo.

echo Available Commands:
echo   npm run dev    - Start development server with auto-reload
echo   npm start      - Start production server
echo   npm run seed   - Populate database with test data
echo.

echo Test Credentials (after seeding):
echo   Email: admin@fleet.com
echo   Password: password123
echo   Role: super_admin
echo.

echo Documentation:
echo   - README.md - Complete documentation
echo   - QUICK-START.md - Quick reference
echo   - DAY1-SETUP.md - Detailed setup guide
echo.

echo Good luck! Happy coding!
echo.

pause
