# UptimeRobot Configuration (Keep your free backend awake)

## Setup Instructions:
1. Go to https://uptimerobot.com
2. Create free account
3. Add new monitor:
   - Type: HTTP(s)
   - URL: https://your-backend.onrender.com/health
   - Monitoring Interval: 5 minutes
   - Alert Contacts: Your email

## Why This Helps:
- Render free tier sleeps after 15 minutes of inactivity
- UptimeRobot pings your backend every 5 minutes
- Keeps your app responsive for users
- 100% free solution

## Alternative: Cron-job.org
- Visit https://cron-job.org
- Create free account  
- Add job to ping your backend every 10 minutes
- URL: https://your-backend.onrender.com/health