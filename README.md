# Customizable Industrial Website

A fully customizable industrial website built with HTML, CSS, Tailwind, and JavaScript. All content, colors, and images are configured through a single JSON file.

## Features

✅ **Fully Customizable** - All content editable via `config.json`
✅ **Dynamic Colors** - Change entire color scheme from config
✅ **Responsive Design** - Works on all devices
✅ **Smooth Animations** - Modern micro-animations and transitions
✅ **WhatsApp Integration** - Floating WhatsApp button
✅ **SEO Optimized** - Proper meta tags and semantic HTML
✅ **Zero Copyright Issues** - Unique structure and design

## File Structure

```
crwaler-extract-images/
├── index.html          # Main HTML structure
├── styles.css          # Custom CSS styles
├── script.js           # JavaScript functionality
├── config.json         # Configuration file (EDIT THIS!)
└── README.md           # This file
```

## Quick Start

1. **Open the website**
   - Simply double-click `index.html` to open in your browser
   - Or use a local server for better performance

2. **Customize the website**
   - Edit `config.json` to change all content
   - No coding knowledge required!

## How to Customize

### Change Colors

Edit the `colors` section in `config.json`:

```json
"colors": {
  "primary": "#0066cc",      // Main brand color
  "secondary": "#28a745",    // Secondary color (buttons, accents)
  "accent": "#ff6b6b",       // Accent color
  "dark": "#1a1a1a",         // Dark text/background
  "light": "#f8f9fa"         // Light background
}
```

### Change Company Information

Edit the `branding` section:

```json
"branding": {
  "companyName": "YOUR COMPANY NAME",
  "tagline": "Your tagline here",
  "logo": "https://your-logo-url.com/logo.png"
}
```

### Change Images

Replace image URLs in various sections:
- Hero images: `hero.images`
- Product images: `products.items[].image`
- Industry images: `industries.items[].image`
- Client logos: `clients.logos`

**Tip:** Use services like:
- [Unsplash](https://unsplash.com) - Free high-quality images
- [PlaceHolder.com](https://placeholder.com) - Quick placeholder images
- Upload your own images to a hosting service

### Add/Remove Products

Edit the `products.items` array:

```json
"products": {
  "items": [
    {
      "name": "Product Name",
      "image": "https://image-url.com/product.jpg",
      "category": "Category Name"
    }
    // Add more products here
  ]
}
```

### Modify Contact Form

Edit `contact.formFields` to add/remove fields:

```json
"formFields": [
  {
    "name": "fieldname",
    "label": "Field Label",
    "type": "text",           // text, email, tel, textarea
    "required": true
  }
]
```

### Change Navigation Menu

Edit `navigation` array:

```json
"navigation": [
  { "text": "Menu Item", "link": "#section-id" }
]
```

## Using Your Own Images

### Method 1: Online Hosting
1. Upload images to services like:
   - [Imgur](https://imgur.com)
   - [Cloudinary](https://cloudinary.com)
   - [ImageKit](https://imagekit.io)
2. Copy the direct image URL
3. Paste URL in `config.json`

### Method 2: Local Images
1. Create an `images/` folder in the same directory
2. Put your images there
3. Reference them as: `"image": "images/your-image.jpg"`

## Sections Included

1. **Header** - Logo and navigation
2. **Hero** - Eye-catching banner with images
3. **About** - Company description
4. **Products** - Product showcase grid
5. **Clients** - Client logos carousel
6. **Industries** - Industries you serve
7. **Why Choose** - Feature highlights
8. **Stats** - Success metrics
9. **Contact** - Contact form and info
10. **Footer** - Copyright and links

## Advanced Customization

### Modify Styles

Edit `styles.css` to change:
- Font families
- Spacing and padding
- Card designs
- Animations

### Add Functionality

Edit `script.js` to:
- Add custom interactions
- Integrate with APIs
- Add form validation
- Connect to backend

## Browser Compatibility

✅ Chrome (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Edge (latest)
✅ Mobile browsers

## Performance Tips

1. **Optimize Images**
   - Compress images before uploading
   - Use appropriate image sizes
   - Consider WebP format

2. **Use CDN**
   - Host images on CDN for faster loading

3. **Local Server**
   - Use a local server instead of opening HTML directly
   - Try: `python -m http.server` or VS Code Live Server

## Deployment Options

### Option 1: Static Hosting (Free)
- [Netlify](https://netlify.com) - Drag & drop deployment
- [Vercel](https://vercel.com) - Zero config deployment
- [GitHub Pages](https://pages.github.com) - Free hosting

### Option 2: Traditional Hosting
- Upload all files to your web hosting via FTP
- Make sure `index.html` is in the root directory

## Support

### Common Issues

**Q: Images not loading?**
- Check if image URLs are correct
- Make sure URLs start with `http://` or `https://`
- Try opening the URL directly in browser

**Q: Changes not showing?**
- Clear browser cache (Ctrl+Shift+R)
- Check if you saved `config.json`
- Verify JSON format is correct

**Q: Mobile menu not working?**
- Make sure JavaScript is enabled
- Check browser console for errors (F12)

## License

Free to use and modify for personal and commercial projects.

## Credits

Built with:
- [Tailwind CSS](https://tailwindcss.com)
- Modern HTML5 & CSS3
- Vanilla JavaScript

---

**Need Help?** Check the `config.json` file - it has detailed examples for each section!
