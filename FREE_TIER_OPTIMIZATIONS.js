// Add to server/server.js for free tier optimization

// Memory optimization for free tiers
if (process.env.NODE_ENV === 'production') {
  // Reduce memory usage
  process.env.NODE_OPTIONS = '--max-old-space-size=512';
  
  // Add caching headers for better performance
  app.use((req, res, next) => {
    // Cache static assets
    if (req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg)$/)) {
      res.set('Cache-Control', 'public, max-age=86400'); // 24 hours
    } else {
      res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
    }
    next();
  });
  
  // Compress responses
  const compression = require('compression');
  app.use(compression());
  
  // Health check optimization
  app.get('/health', (req, res) => {
    res.status(200).json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      service: 'ICCA Backend API',
      memory: process.memoryUsage(),
      uptime: process.uptime()
    });
  });
}