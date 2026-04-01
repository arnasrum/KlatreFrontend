function cropImageAsBase64(
    base64Data: string,
    x: number,
    y: number,
    width: number,
    height: number,
    fileType: string = 'image/png'
): Promise<string> {
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

            ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

            const base64String = canvas.toDataURL(fileType);
            resolve(base64String);
        };

        img.onerror = (error) => {
            reject(new Error('Failed to load image: ' + error));
        };

        img.src = base64Data;
    });
}

export default cropImageAsBase64;