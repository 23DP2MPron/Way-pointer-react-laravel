# Quick Start: Deploy to Google Cloud

## 🚀 Fastest Way to Deploy

### Prerequisites
- Google Cloud account with billing enabled
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed

### Option 1: Automated Script (Recommended)

**For Windows (PowerShell):**
```powershell
cd D:\way-pointer
.\deploy-gcloud.ps1
```

**For Linux/Mac (Bash):**
```bash
cd /path/to/way-pointer
chmod +x deploy-gcloud.sh
./deploy-gcloud.sh
```

The script will:
1. Enable required Google Cloud APIs
2. Set up Cloud SQL database (optional)
3. Build and deploy backend
4. Build and deploy frontend
5. Provide you with application URLs

### Option 2: Manual Deployment

#### Step 1: Set up Google Cloud
```bash
gcloud init
gcloud config set project YOUR_PROJECT_ID
```

#### Step 2: Enable APIs
```bash
gcloud services enable cloudbuild.googleapis.com run.googleapis.com sqladmin.googleapis.com
```

#### Step 3: Deploy Backend
```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/waypointer-backend .
gcloud run deploy waypointer-backend \
  --image gcr.io/YOUR_PROJECT_ID/waypointer-backend \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated
```

#### Step 4: Deploy Frontend
```bash
cd waypointer-frontend
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/waypointer-frontend .
gcloud run deploy waypointer-frontend \
  --image gcr.io/YOUR_PROJECT_ID/waypointer-frontend \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated
```

## 📚 Detailed Documentation

For complete deployment guide with database setup, custom domains, monitoring, and troubleshooting, see:
- [GOOGLE_CLOUD_DEPLOYMENT.md](./GOOGLE_CLOUD_DEPLOYMENT.md)

## 💰 Estimated Costs

- **Cloud Run Backend**: $5-20/month
- **Cloud Run Frontend**: $2-10/month
- **Cloud SQL (MySQL)**: $7/month
- **Total**: ~$15-40/month (depending on traffic)

## 🔧 Configuration Files

- `Dockerfile` - Backend container configuration
- `waypointer-frontend/Dockerfile` - Frontend container configuration
- `docker-compose.yml` - Local testing with Docker
- `cloudbuild.yaml` - Automated CI/CD pipeline
- `app.yaml` - App Engine configuration (alternative)

## 🆘 Need Help?

1. Check [GOOGLE_CLOUD_DEPLOYMENT.md](./GOOGLE_CLOUD_DEPLOYMENT.md) for detailed instructions
2. View logs: `gcloud run logs read SERVICE_NAME --region europe-west1`
3. Google Cloud documentation: https://cloud.google.com/docs

## 🔐 Security Notes

- Never commit `.env` files with real credentials
- Use Google Secret Manager for sensitive data
- Enable Cloud Armor for DDoS protection
- Set up automated backups for Cloud SQL

## ✅ Post-Deployment Checklist

- [ ] Run database migrations
- [ ] Configure environment variables
- [ ] Set up custom domain (optional)
- [ ] Enable automated backups
- [ ] Set up monitoring and alerts
- [ ] Test all functionality
- [ ] Configure CORS settings
- [ ] Set up SSL/TLS certificates (automatic with Cloud Run)
