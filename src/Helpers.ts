
const convertImageToBase64 = async (file: File, format: string) => {
    if(file == null || format == null) {
        return null
    }
    let img = null
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // Convert to base64
    let binary = '';
    bytes.forEach((byte) => binary += String.fromCharCode(byte));
    img = btoa(binary);

    console.log('Image converted to base64, length:', img.length);
    img = `data:${format};base64,${img}`
    return img
}

function base64ToFile(base64String: string, fileName: string): File {
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
}

const handleFormDataImage = (formData: FormData) => {
    const imageBase64 = formData.get('image') as string;
    if (imageBase64 && imageBase64.startsWith('data:image/')) {
        const imageFile = base64ToFile(imageBase64, 'cropped-image.png');
        formData.set('image', imageFile);
    }
}



export {convertImageToBase64, handleFormDataImage}