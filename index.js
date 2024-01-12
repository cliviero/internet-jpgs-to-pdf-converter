const { PDFDocument } = require('pdf-lib');
const axios = require('axios');
const fs = require('fs').promises;

async function createPDFWithFullPageImages(urls, fileName) {
    const pdfDoc = await PDFDocument.create();

    for (const imageUrl of urls) {
        // Download the image from the Internet using axios
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data);

        // Add a new page to the document with the same size as the image
        const image = await pdfDoc.embedJpg(imageBuffer);
        const page = pdfDoc.addPage([image.width, image.height]);

        // Draw the image on the page
        page.drawImage(image, {
            x: 0,
            y: 0,
            width: image.width,
            height: image.height,
        });
    }

    // Save the document to a file with the provided name
    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(`${fileName}.pdf`, pdfBytes);
}

const config = require('./config.json');

if (config.fileName && config.imageUrls && config.imageUrls.length > 0) {
    createPDFWithFullPageImages(config.imageUrls, config.fileName);
} else {
    console.error('Invalid or incomplete configuration in config.json.');
}