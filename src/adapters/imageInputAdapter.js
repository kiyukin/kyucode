const fs = require('fs');
const path = require('path');
const config = require('../config');

function getImagesFromDirectory() {
    const images = fs.readdirSync(config.SCREENSHOT_DIR);
    const imageFiles = [];

    images.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        if (['.png', '.jpg', '.jpeg'].includes(ext)) {
            const stats = fs.statSync(path.join(config.SCREENSHOT_DIR, file));
            imageFiles.push({
                filename: file,
                path: path.join(config.SCREENSHOT_DIR, file),
                extension: ext,
                size: stats.size
            });
        }
    });

    if (imageFiles.length === 0) {
        console.warn('No images found. Please add images to the screenshots folder.');
    }

    return imageFiles;
}

module.exports = { getImagesFromDirectory };