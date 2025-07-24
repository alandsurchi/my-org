# 🔍 Pre-Migration Checklist

## Prerequisites
- [ ] Node.js (v18 or higher) installed
- [ ] MongoDB installed and running locally OR MongoDB Atlas account
- [ ] Git repository initialized and up to date
- [ ] Backup of current codebase created
- [ ] Supabase project access (for data export)

## Data Backup
- [ ] Export all Supabase data using the export script
- [ ] Verify all tables are exported:
  - [ ] news
  - [ ] projects  
  - [ ] staff
  - [ ] gallery
  - [ ] staff_accounts
  - [ ] website_images
  - [ ] email_subscriptions
  - [ ] user_analytics
  - [ ] user_profiles
- [ ] Download any uploaded files from Supabase Storage
- [ ] Save Supabase credentials and configuration

## Environment Setup
- [ ] MongoDB connection string ready
- [ ] Cloudinary account for image uploads (optional)
- [ ] JWT secret key generated
- [ ] Admin credentials defined
- [ ] CORS origins configured

## Code Preparation
- [ ] All current features documented
- [ ] List of custom modifications noted
- [ ] Third-party integrations identified
- [ ] API endpoints mapped
- [ ] Authentication flow documented

## Migration Plan Review
- [ ] Backend architecture understood
- [ ] Data model mapping verified
- [ ] API endpoint structure reviewed
- [ ] Frontend integration points identified
- [ ] Testing strategy defined

## Risk Assessment
- [ ] Rollback plan prepared
- [ ] Downtime expectations set
- [ ] User impact assessed
- [ ] Data loss prevention measures in place

## Post-Migration Testing
- [ ] User authentication flow
- [ ] CRUD operations for all entities
- [ ] File upload functionality
- [ ] Search functionality
- [ ] Multi-language support
- [ ] Responsive design
- [ ] Performance benchmarks

## Deployment Readiness
- [ ] Production environment prepared
- [ ] CI/CD pipeline updated
- [ ] Domain and SSL certificates ready
- [ ] Monitoring and logging configured
- [ ] Error tracking setup

---

**⚠️ Important Notes:**
1. Run the migration in a development environment first
2. Test thoroughly before migrating production data
3. Keep the Supabase project active until migration is verified
4. Document any custom changes or modifications
5. Have a rollback strategy ready

**Estimated Migration Time:** 4-6 hours for full migration and testing
