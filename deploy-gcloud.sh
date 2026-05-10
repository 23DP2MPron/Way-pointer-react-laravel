#!/bin/bash

# WayPointer Quick Deploy Script for Google Cloud
# This script automates the deployment process

set -e

echo "🚀 WayPointer Google Cloud Deployment Script"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI is not installed. Please install it first.${NC}"
    echo "Visit: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Get project ID
read -p "Enter your Google Cloud Project ID: " PROJECT_ID
gcloud config set project $PROJECT_ID

echo -e "${GREEN}✓ Project set to: $PROJECT_ID${NC}"

# Enable required APIs
echo -e "${YELLOW}📦 Enabling required APIs...${NC}"
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable containerregistry.googleapis.com
echo -e "${GREEN}✓ APIs enabled${NC}"

# Set region
REGION="europe-west1"
echo -e "${YELLOW}🌍 Using region: $REGION${NC}"

# Ask if database setup is needed
read -p "Do you need to set up Cloud SQL database? (y/n): " SETUP_DB

if [ "$SETUP_DB" = "y" ]; then
    echo -e "${YELLOW}🗄️  Setting up Cloud SQL...${NC}"
    
    read -p "Enter database password: " -s DB_PASSWORD
    echo
    
    # Create Cloud SQL instance
    gcloud sql instances create waypointer-db \
        --database-version=MYSQL_8_0 \
        --tier=db-f1-micro \
        --region=$REGION \
        --root-password=$DB_PASSWORD
    
    # Create database
    gcloud sql databases create waypointer --instance=waypointer-db
    
    # Create user
    gcloud sql users create waypointer \
        --instance=waypointer-db \
        --password=$DB_PASSWORD
    
    echo -e "${GREEN}✓ Database created${NC}"
fi

# Build and deploy backend
echo -e "${YELLOW}🔨 Building backend...${NC}"
gcloud builds submit --tag gcr.io/$PROJECT_ID/waypointer-backend .

echo -e "${YELLOW}🚀 Deploying backend to Cloud Run...${NC}"
gcloud run deploy waypointer-backend \
    --image gcr.io/$PROJECT_ID/waypointer-backend \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --port 8080 \
    --memory 512Mi

# Get backend URL
BACKEND_URL=$(gcloud run services describe waypointer-backend --region $REGION --format 'value(status.url)')
echo -e "${GREEN}✓ Backend deployed at: $BACKEND_URL${NC}"

# Build and deploy frontend
echo -e "${YELLOW}🔨 Building frontend...${NC}"

# Update frontend environment
cd waypointer-frontend
echo "VITE_API_URL=$BACKEND_URL/api" > .env.production

gcloud builds submit --tag gcr.io/$PROJECT_ID/waypointer-frontend .

echo -e "${YELLOW}🚀 Deploying frontend to Cloud Run...${NC}"
gcloud run deploy waypointer-frontend \
    --image gcr.io/$PROJECT_ID/waypointer-frontend \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --port 8080 \
    --memory 256Mi

# Get frontend URL
FRONTEND_URL=$(gcloud run services describe waypointer-frontend --region $REGION --format 'value(status.url)')
echo -e "${GREEN}✓ Frontend deployed at: $FRONTEND_URL${NC}"

cd ..

# Summary
echo ""
echo "=============================================="
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "=============================================="
echo ""
echo "📍 Your application URLs:"
echo "   Backend:  $BACKEND_URL"
echo "   Frontend: $FRONTEND_URL"
echo ""
echo "📝 Next steps:"
echo "   1. Run database migrations"
echo "   2. Set up custom domain (optional)"
echo "   3. Configure environment variables"
echo ""
echo "📚 For detailed instructions, see GOOGLE_CLOUD_DEPLOYMENT.md"
echo ""
