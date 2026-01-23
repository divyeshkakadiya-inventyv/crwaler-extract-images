# Deployment Guide - Fusion Polymer Industries Website

## Pre-Deployment Checklist

### 1. Update Configuration
Before deploying, update `config.json` with real company information:

- [ ] Replace logo URL with actual company logo
- [ ] Update phone number in `branding.topBar.phone`
- [ ] Update email in `branding.topBar.email`
- [ ] Update WhatsApp number in `branding.topBar.whatsapp`
- [ ] Update social media links in `footer.socialMedia`
- [ ] Update company address in `contact.contactInfo`
- [ ] Replace placeholder product images with real images
- [ ] Replace placeholder client logos with real logos
- [ ] Update hero slider images

### 2. Image Optimization
Optimize all images before deployment:

```bash
# Install image optimization tools (optional)
npm install -g imagemin-cli

# Optimize images
imagemin images/*.png --out-dir=images/optimized
imagemin images/*.jpg --out-dir=images/optimized
```

Or use online tools:
- [TinyPNG](https://tinypng.com/) - PNG/JPG compression
- [SVGOMG](https://jakearchibald.github.io/svgomg/) - SVG optimization

### 3. Test Locally
```bash
# Start local server
cd /path/to/project
python3 -m http.server 8000

# Open in browser
http://localhost:8000
```

Test checklist:
- [ ] All navigation links work
- [ ] Hero slider auto-plays and manual controls work
- [ ] Mobile menu opens/closes properly
- [ ] Contact form validates and submits
- [ ] All images load correctly
- [ ] Responsive design works on mobile (375px), tablet (768px), desktop (1920px)
- [ ] No console errors

## Deployment Options

### Option 1: Static Hosting (Recommended for Beginners)

#### Netlify (Free)
1. Create account at [netlify.com](https://netlify.com)
2. Drag and drop your project folder
3. Site will be live at `https://your-site-name.netlify.app`
4. Optional: Add custom domain in settings

#### Vercel (Free)
1. Create account at [vercel.com](https://vercel.com)
2. Install Vercel CLI: `npm install -g vercel`
3. Run: `vercel` in project directory
4. Follow prompts

#### GitHub Pages (Free)
1. Create GitHub repository
2. Push code to repository
3. Go to Settings → Pages
4. Select branch and save
5. Site will be live at `https://username.github.io/repo-name`

### Option 2: Traditional Web Hosting

#### Via FTP/SFTP
1. Get hosting credentials from your provider
2. Use FileZilla or similar FTP client
3. Upload all files to `public_html` or `www` directory
4. Ensure `index.html` is in the root directory

#### Via cPanel
1. Log into cPanel
2. Go to File Manager
3. Navigate to `public_html`
4. Upload all files
5. Extract if uploaded as ZIP

## Post-Deployment Steps

### 1. Configure Domain (if using custom domain)
- Update DNS records to point to hosting provider
- Wait 24-48 hours for DNS propagation
- Enable SSL certificate (most hosts provide free Let's Encrypt)

### 2. Enable HTTPS
Most modern hosts provide free SSL certificates:
- **Netlify/Vercel**: Automatic
- **cPanel**: Use "SSL/TLS" section to install Let's Encrypt
- After SSL is enabled, uncomment HTTPS redirect in `.htaccess`

### 3. Submit to Search Engines
```bash
# Create sitemap.xml (basic example)
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.yourwebsite.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

Submit to:
- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)

### 4. Setup Analytics (Optional)
Add Google Analytics:
1. Create account at [analytics.google.com](https://analytics.google.com)
2. Get tracking code
3. Add before `</head>` in `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 5. Setup Form Backend (Important!)
The contact form currently logs to console. To receive actual emails:

#### Option A: FormSpree (Easiest)
1. Sign up at [formspree.io](https://formspree.io)
2. Update form in `index.html`:
```html
<form id="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

#### Option B: EmailJS
1. Sign up at [emailjs.com](https://www.emailjs.com/)
2. Add EmailJS SDK to `index.html`
3. Update `handleFormSubmit()` in `script.js`

#### Option C: Custom Backend
Create a simple PHP backend or use serverless functions (Netlify/Vercel Functions)

## Performance Optimization

### 1. Image Optimization
- Use WebP format for better compression
- Implement lazy loading (already included)
- Use appropriate image sizes

### 2. Minification (Production)
```bash
# Install minification tools
npm install -g html-minifier clean-css-cli uglify-js

# Minify files
html-minifier --collapse-whitespace --remove-comments index.html -o index.min.html
cleancss -o styles.min.css styles.css
uglifyjs script.js -o script.min.js -c -m
```

Update `index.html` to use minified files in production.

### 3. CDN (Optional)
For better global performance:
- Upload images to Cloudinary or ImageKit
- Update image URLs in `config.json`

## Monitoring & Maintenance

### Regular Tasks
- [ ] Update product images monthly
- [ ] Check for broken links quarterly
- [ ] Review and respond to contact form submissions
- [ ] Monitor website analytics
- [ ] Keep content fresh and updated

### Performance Monitoring
- Use [Google PageSpeed Insights](https://pagespeed.web.dev/)
- Use [GTmetrix](https://gtmetrix.com/)
- Target: 90+ score on mobile and desktop

## Troubleshooting

### Images not loading
- Check image URLs in `config.json`
- Ensure images are uploaded to server
- Check browser console for 404 errors

### Form not submitting
- Check browser console for errors
- Verify form action URL (if using FormSpree/EmailJS)
- Test with simple console.log first

### Mobile menu not working
- Ensure JavaScript is enabled
- Check for console errors
- Clear browser cache

### Slow loading
- Optimize images (compress to < 200KB each)
- Enable caching in `.htaccess`
- Use CDN for images

## Support

For technical issues:
1. Check browser console (F12) for errors
2. Test in incognito mode
3. Clear browser cache
4. Try different browser

## Files Structure
```
project/
├── index.html          # Main HTML file
├── styles.css          # Styles
├── script.js           # JavaScript
├── config.json         # Configuration
├── favicon.svg         # Favicon
├── robots.txt          # SEO
├── .htaccess          # Server config
├── images/            # Image assets
└── README.md          # Documentation
```

## Security Best Practices

1. **Keep software updated**: Regularly update any dependencies
2. **Use HTTPS**: Always enable SSL certificate
3. **Validate forms**: Already implemented client-side validation
4. **Sanitize inputs**: Implement server-side validation for form backend
5. **Regular backups**: Backup website files and database (if any) weekly

## Next Steps After Deployment

1. Test website on multiple devices
2. Share with stakeholders for feedback
3. Monitor form submissions
4. Track analytics
5. Gather user feedback
6. Plan content updates

---

**Deployment Date**: _____________
**Deployed By**: _____________
**Live URL**: _____________
**Hosting Provider**: _____________
