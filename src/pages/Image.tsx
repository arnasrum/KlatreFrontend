
interface ImageProps {
    data: string | null,
    className?: string
}



export default function Image(props: ImageProps) {
    if (!props.data) {
        return(
            <>
                <p>No image</p>
            </>
        )
    }

    // Add validation for base64 data
    const imageData = props.data.toString();
    if (!imageData || imageData.trim() === '') {
        return(
            <>
                <p>Empty image data</p>
            </>
        )
    }

    const image = imageData;

    const handleImageError = (e: React.SyntheticEvent) => {
        console.error('Image failed to load:', {
            dataLength: imageData.length,
            dataPreview: imageData.substring(0, 50) + '...',
            error: e
        });
    };

    const handleImageLoad = () => {
        console.log('Image loaded successfully');
    };

    return(
        <img
            src={image}
            alt="Boulder image"
            onError={handleImageError}
            onLoad={handleImageLoad}
            style={{ maxWidth: '300px', height: 'auto' }}
        />
    );
}