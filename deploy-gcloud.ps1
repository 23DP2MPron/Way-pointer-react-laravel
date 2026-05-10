# WayPointer Quick Deploy Script for Google Cloud (PowerShell)
# This script automates the deployment process for Windows users

Write-Host "🚀 WayPointer Google Cloud Deployment Script" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

# Check if gcloud is installed
if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
    Write-Host "❌ gcloud CLI is not installed. Please install it first." -ForegroundColor Red
    Write-Host "Visit: https://cloud.google.com/sdk/docs/install"
    exit 1
}

# Get project ID
$PROJECT_ID = Read-Host "Enter your Google Cloud Project ID"
gcloud config set project $PROJECT_ID

Write-Host "✓ Project set to: $PROJECT_ID" -ForegroundColor Green

# Enable required APIs
Write-Host "📦 Enabling required APIs..." -ForegroundColor Yellow
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable containerregistry.googleapis.com
Write-Host "✓ APIs enabled" -ForegroundColor Green

# Set region
$REGION = "europe-west1"
Write-Host "🌍 Using region: $REGION" -ForegroundColor Yellow

# Ask if database setup is needed
$SETUP_DB = Read-Host "Do you need to set up Cloud SQL database? (y/n)"

if ($SETUP_DB -eq "y") {
    Write-Host "🗄️  Setting up Cloud SQL..." -ForegroundColor Yellow
    
    $DB_PASSWORD = Read-Host "Enter database password" -AsSecureString
    $DB_PASSWORD_PLAIN = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($DB_PASSWORD))
    
    # Create Cloud SQL instance
    gcloud sql instances create waypointer-db `
        --database-version=MYSQL_8_0 `
        --tier=db-f1-micro `
        --region=$REGION `
        --root-password=$DB_PASSWORD_PLAIN
    
    # Create database
    gcloud sql databases create waypointer --instance=waypointer-db
    
    # Create user
    gcloud sql users create waypointer `
        --instance=waypointer-db `
        --password=$DB_PASSWORD_PLAIN
    
    Write-Host "✓ Database created" -ForegroundColor Green
}

# Build and deploy backend
Write-Host "🔨 Building backend..." -ForegroundColor Yellow
gcloud builds submit --tag gcr.io/$PROJECT_ID/waypointer-backend .

Write-Host "🚀 Deploying backend to Cloud Run..." -ForegroundColor Yellow
gcloud run deploy waypointer-backend `
    --image gcr.io/$PROJECT_ID/waypointer-backend `
    --platform managed `
    --region $REGION `
    --allow-unauthenticated `
    --port 8080 `
    --memory 512Mi

# Get backend URL
$BACKEND_URL = gcloud run services describe waypointer-backend --region $REGION --format 'value(status.url)'
Write-Host "✓ Backend deployed at: $BACKEND_URL" -ForegroundColor Green

# Build and deploy frontend
Write-Host "🔨 Building frontend..." -ForegroundColor Yellow

# Update frontend environment
Set-Location waypointer-frontend
"VITE_API_URL=$BACKEND_URL/api" | Out-File -FilePath .env.production -Encoding utf8

gcloud builds submit --tag gcr.io/$PROJECT_ID/waypointer-frontend .

Write-Host "🚀 Deploying frontend to Cloud Run..." -ForegroundColor Yellow
gcloud run deploy waypointer-frontend `
    --image gcr.io/$PROJECT_ID/waypointer-frontend `
    --platform managed `
    --region $REGION `
    --allow-unauthenticated `
    --port 8080 `
    --memory 256Mi

# Get frontend URL
$FRONTEND_URL = gcloud run services describe waypointer-frontend --region $REGION --format 'value(status.url)'
Write-Host "✓ Frontend deployed at: $FRONTEND_URL" -ForegroundColor Green

Set-Location ..

# Summary
Write-Host ""
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "🎉 Deployment Complete!" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Your application URLs:"
Write-Host "   Backend:  $BACKEND_URL"
Write-Host "   Frontend: $FRONTEND_URL"
Write-Host ""
Write-Host "📝 Next steps:"
Write-Host "   1. Run database migrations"
Write-Host '   2. Set up custom domain (optional)'
Write-Host "   3. Configure environment variables"
Write-Host ""
Write-Host "📚 For detailed instructions, see GOOGLE_CLOUD_DEPLOYMENT.md"
Write-Host ""
