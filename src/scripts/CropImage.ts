function cropImageAsFile(
    base64Data: string,
    x: number,
    y: number,
    width: number,
    height: number,
    fileName: string,
    fileType: string = 'image/png'
): Promise<String> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return reject(new Error('Could not get 2D context from canvas.'));
            }

            canvas.width = width;
            canvas.height = height;

            // Draw the cropped portion of the image onto the canvas
            ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

            // Convert the canvas content to a base64 data URL
            const base64String = canvas.toDataURL(fileType);
            resolve(base64String);
        };

        img.onerror = (error) => {
            reject(new Error('Failed to load image: ' + error));
        };

        // Set the image source to the Base64 data
        img.src = base64Data;
    });
}

export default cropImageAsFile;