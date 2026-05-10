# WayPointer - Google Cloud Deployment Guide

This guide will help you deploy the WayPointer application to Google Cloud Platform.

## Prerequisites

1. Google Cloud account with billing enabled
2. Google Cloud SDK (gcloud) installed on your machine
3. Docker installed locally (for testing)
4. Git repository with your code

## Option 1: Deploy to Google Cloud Run (Recommended)

Cloud Run is a fully managed serverless platform that automatically scales your containers.

### Step 1: Install Google Cloud SDK

Download and install from: https://cloud.google.com/sdk/docs/install

### Step 2: Initialize gcloud

```bash
gcloud init
gcloud auth login
```

### Step 3: Create a new Google Cloud Project

```bash
gcloud projects create waypointer-app --name="WayPointer"
gcloud config set project waypointer-app
```

### Step 4: Enable required APIs

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### Step 5: Set up Cloud SQL (MySQL Database)

```bash
# Create Cloud SQL instance
gcloud sql instances create waypointer-db \
  --database-version=MYSQL_8_0 \
  --tier=db-f1-micro \
  --region=europe-west1

# Set root password
gcloud sql users set-password root \
  --host=% \
  --instance=waypointer-db \
  --password=YOUR_SECURE_PASSWORD

# Create database
gcloud sql databases create waypointer --instance=waypointer-db

# Create database user
gcloud sql users create waypointer \
  --instance=waypointer-db \
  --password=YOUR_SECURE_PASSWORD
```

### Step 6: Build and Deploy Backend

```bash
# Navigate to project root
cd D:\way-pointer

# Build Docker image
gcloud builds submit --tag gcr.io/waypointer-app/backend

# Deploy to Cloud Run
gcloud run deploy waypointer-backend \
  --image gcr.io/waypointer-app/backend \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --set-env-vars "APP_ENV=production,APP_DEBUG=false,DB_CONNECTION=mysql,DB_HOST=/cloudsql/waypointer-app:europe-west1:waypointer-db,DB_DATABASE=waypointer,DB_USERNAME=waypointer,DB_PASSWORD=YOUR_SECURE_PASSWORD" \
  --add-cloudsql-instances waypointer-app:europe-west1:waypointer-db
```

### Step 7: Run Database Migrations

```bash
# Get the backend URL
BACKEND_URL=$(gcloud run services describe waypointer-backend --region europe-west1 --format 'value(status.url)')

# Run migrations (you'll need to exec into the container or use Cloud Shell)
gcloud run services update waypointer-backend \
  --region europe-west1 \
  --command "php,artisan,migrate,--force"
```

### Step 8: Build and Deploy Frontend

```bash
# Navigate to frontend directory
cd waypointer-frontend

# Update .env.production with backend URL
echo "VITE_API_URL=${BACKEND_URL}/api" > .env.production

# Build Docker image
gcloud builds submit --tag gcr.io/waypointer-app/frontend

# Deploy to Cloud Run
gcloud run deploy waypointer-frontend \
  --image gcr.io/waypointer-app/frontend \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 256Mi
```

### Step 9: Get Your Application URLs

```bash
# Backend URL
gcloud run services describe waypointer-backend --region europe-west1 --format 'value(status.url)'

# Frontend URL
gcloud run services describe waypointer-frontend --region europe-west1 --format 'value(status.url)'
```

## Option 2: Deploy Using Cloud Build (Automated CI/CD)

### Step 1: Connect GitHub Repository

```bash
# Connect your GitHub repository to Cloud Build
gcloud alpha builds triggers create github \
  --repo-name=way-pointer \
  --repo-owner=YOUR_GITHUB_USERNAME \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

### Step 2: Push to GitHub

Every push to the main branch will automatically trigger a build and deployment.

```bash
git add .
git commit -m "Deploy to Google Cloud"
git push origin main
```

## Option 3: Deploy to App Engine

### Step 1: Deploy Backend

```bash
cd D:\way-pointer
gcloud app deploy app.yaml
```

### Step 2: Deploy Frontend

For App Engine, you'll need to serve the frontend as static files or use Cloud Storage + Cloud CDN.

## Environment Variables

Create a `.env.production` file for backend:

```env
APP_NAME=WayPointer
APP_ENV=production
APP_KEY=base64:YOUR_GENERATED_KEY
APP_DEBUG=false
APP_URL=https://your-backend-url.run.app

DB_CONNECTION=mysql
DB_HOST=/cloudsql/PROJECT_ID:REGION:INSTANCE_NAME
DB_PORT=3306
DB_DATABASE=waypointer
DB_USERNAME=waypointer
DB_PASSWORD=YOUR_SECURE_PASSWORD

CACHE_DRIVER=file
QUEUE_CONNECTION=sync
SESSION_DRIVER=cookie

# API Keys
VITE_PEXELS_API_KEY=your_pexels_key
VITE_GEONAMES_USERNAME=your_geonames_username
VITE_OPENTRIPMAP_API_KEY=your_opentripmap_key
```

## Custom Domain Setup

### Step 1: Map Custom Domain

```bash
# Map domain to Cloud Run service
gcloud run domain-mappings create \
  --service waypointer-frontend \
  --domain www.waypointer.com \
  --region europe-west1
```

### Step 2: Update DNS Records

Follow the instructions provided by gcloud to add DNS records to your domain registrar.

## Monitoring and Logs

### View Logs

```bash
# Backend logs
gcloud run logs read waypointer-backend --region europe-west1

# Frontend logs
gcloud run logs read waypointer-frontend --region europe-west1
```

### Set up Monitoring

```bash
# Enable Cloud Monitoring
gcloud services enable monitoring.googleapis.com
```

Visit: https://console.cloud.google.com/monitoring

## Cost Estimation

**Cloud Run (Recommended):**
- Backend: ~$5-20/month (depending on traffic)
- Frontend: ~$2-10/month
- Cloud SQL (db-f1-micro): ~$7/month
- **Total: ~$15-40/month**

**App Engine:**
- Similar pricing to Cloud Run
- May be slightly more expensive

## Scaling

Cloud Run automatically scales based on traffic:
- Min instances: 0 (scales to zero when not in use)
- Max instances: 10 (configurable)
- Concurrent requests: 80 per instance

## Troubleshooting

### Issue: Container fails to start

```bash
# Check logs
gcloud run logs read waypointer-backend --region europe-west1 --limit 50
```

### Issue: Database connection fails

- Verify Cloud SQL instance is running
- Check connection string format
- Ensure Cloud SQL Admin API is enabled

### Issue: Frontend can't connect to backend

- Update VITE_API_URL in frontend environment
- Check CORS settings in Laravel backend
- Verify backend is publicly accessible

## Security Best Practices

1. **Use Secret Manager for sensitive data:**

```bash
# Store secrets
echo -n "your-secret-value" | gcloud secrets create db-password --data-file=-

# Grant access to Cloud Run
gcloud secrets add-iam-policy-binding db-password \
  --member=serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com \
  --role=roles/secretmanager.secretAccessor
```

2. **Enable Cloud Armor for DDoS protection**
3. **Set up Cloud CDN for frontend assets**
4. **Use Identity-Aware Proxy for admin routes**

## Backup Strategy

### Automated Database Backups

```bash
# Enable automated backups
gcloud sql instances patch waypointer-db \
  --backup-start-time=03:00 \
  --enable-bin-log
```

### Manual Backup

```bash
gcloud sql backups create --instance=waypointer-db
```

## Useful Commands

```bash
# List all Cloud Run services
gcloud run services list

# Delete a service
gcloud run services delete waypointer-backend --region europe-west1

# Update service with new image
gcloud run services update waypointer-backend \
  --image gcr.io/waypointer-app/backend:latest \
  --region europe-west1

# View service details
gcloud run services describe waypointer-backend --region europe-west1
```

## Support

For issues with Google Cloud Platform:
- Documentation: https://cloud.google.com/docs
- Support: https://cloud.google.com/support

For WayPointer application issues:
- GitHub: https://github.com/YOUR_USERNAME/way-pointer
