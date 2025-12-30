import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import os
from pathlib import Path
import time

class ImageCrawler:
    def __init__(self, base_url, output_dir='downloaded_images'):
        self.base_url = base_url
        self.domain = urlparse(base_url).netloc
        self.visited_urls = set()
        self.downloaded_images = set()
        self.output_dir = output_dir
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        
        # Create output directory
        Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    def is_valid_url(self, url):
        """Check if URL belongs to the same domain"""
        parsed = urlparse(url)
        return parsed.netloc == self.domain or parsed.netloc == ''
    
    def get_image_name(self, url):
        """Extract filename from URL"""
        parsed = urlparse(url)
        filename = os.path.basename(parsed.path)
        
        # If no filename, generate one
        if not filename or '.' not in filename:
            filename = f"image_{hash(url)}.jpg"
        
        return filename
    
    def download_image(self, img_url):
        """Download a single image"""
        if img_url in self.downloaded_images:
            return
        
        try:
            response = self.session.get(img_url, timeout=10)
            response.raise_for_status()
            
            filename = self.get_image_name(img_url)
            filepath = os.path.join(self.output_dir, filename)
            
            # Handle duplicate filenames
            counter = 1
            base_name, ext = os.path.splitext(filename)
            while os.path.exists(filepath):
                filename = f"{base_name}_{counter}{ext}"
                filepath = os.path.join(self.output_dir, filename)
                counter += 1
            
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            self.downloaded_images.add(img_url)
            print(f"✓ Downloaded: {filename} from {img_url}")
            
        except Exception as e:
            print(f"✗ Failed to download {img_url}: {str(e)}")
    
    def extract_images(self, soup, page_url):
        """Extract all images from a page"""
        images = []
        
        # Find all img tags
        for img in soup.find_all('img'):
            img_url = img.get('src') or img.get('data-src')
            if img_url:
                img_url = urljoin(page_url, img_url)
                images.append(img_url)
        
        # Find images in CSS backgrounds (basic extraction)
        for tag in soup.find_all(style=True):
            style = tag['style']
            if 'url(' in style:
                # Basic regex-like extraction
                start = style.find('url(') + 4
                end = style.find(')', start)
                if start > 3 and end > start:
                    url = style[start:end].strip('\'"')
                    url = urljoin(page_url, url)
                    images.append(url)
        
        return images
    
    def crawl_page(self, url):
        """Crawl a single page"""
        if url in self.visited_urls:
            return
        
        self.visited_urls.add(url)
        print(f"\n→ Crawling: {url}")
        
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract and download images
            images = self.extract_images(soup, url)
            for img_url in images:
                self.download_image(img_url)
            
            # Find all links to crawl
            for link in soup.find_all('a', href=True):
                next_url = urljoin(url, link['href'])
                
                # Only crawl URLs from the same domain
                if self.is_valid_url(next_url) and next_url not in self.visited_urls:
                    # Remove URL fragments
                    next_url = next_url.split('#')[0]
                    time.sleep(0.5)  # Be polite, don't hammer the server
                    self.crawl_page(next_url)
            
        except Exception as e:
            print(f"✗ Error crawling {url}: {str(e)}")
    
    def start(self):
        """Start the crawling process"""
        print(f"Starting crawl of {self.base_url}")
        print(f"Images will be saved to: {os.path.abspath(self.output_dir)}")
        print("=" * 60)
        
        self.crawl_page(self.base_url)
        
        print("\n" + "=" * 60)
        print(f"✓ Crawling complete!")
        print(f"✓ Visited {len(self.visited_urls)} pages")
        print(f"✓ Downloaded {len(self.downloaded_images)} images")
        print(f"✓ Images saved to: {os.path.abspath(self.output_dir)}")


if __name__ == "__main__":
    # Configuration
    website_url = "https://www.fusionpolymer.com/"
    output_directory = "fusionpolymer_images"
    
    # Create and run crawler
    crawler = ImageCrawler(website_url, output_directory)
    crawler.start()