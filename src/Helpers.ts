
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

export {convertImageToBase64}