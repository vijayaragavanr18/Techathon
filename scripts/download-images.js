const https = require('https');
const fs = require('fs');
const path = require('path');

const images = {
  products: [
    {
      name: 'organic-nipple-cream.jpg',
      url: 'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=300&h=200&fit=crop'
    },
    {
      name: 'maternity-support-belt.jpg',
      url: 'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=300&h=200&fit=crop'
    },
    {
      name: 'stretch-mark-cream.jpg',
      url: 'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=300&h=200&fit=crop'
    },
    {
      name: 'herbal-sitz-bath.jpg',
      url: 'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=300&h=200&fit=crop'
    },
    {
      name: 'infant-probiotic-drops.jpg',
      url: 'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=300&h=200&fit=crop'
    }
  ],
  medicines: [
    {
      name: 'prenatal-vitamins.jpg',
      url: 'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=300&h=200&fit=crop'
    },
    {
      name: 'iron-supplement.jpg',
      url: 'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=300&h=200&fit=crop'
    },
    {
      name: 'folic-acid.jpg',
      url: 'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=300&h=200&fit=crop'
    },
    {
      name: 'calcium-vitamin-d.jpg',
      url: 'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=300&h=200&fit=crop'
    }
  ]
};

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const writeStream = fs.createWriteStream(filepath);
        response.pipe(writeStream);
        writeStream.on('finish', () => {
          writeStream.close();
          resolve();
        });
      } else {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function downloadAllImages() {
  const baseDir = path.join(__dirname, '..', 'public', 'images');

  for (const [category, items] of Object.entries(images)) {
    const categoryDir = path.join(baseDir, category);
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }

    for (const item of items) {
      const filepath = path.join(categoryDir, item.name);
      try {
        await downloadImage(item.url, filepath);
        console.log(`Downloaded ${item.name}`);
      } catch (error) {
        console.error(`Error downloading ${item.name}:`, error);
      }
    }
  }
}

downloadAllImages().catch(console.error); 