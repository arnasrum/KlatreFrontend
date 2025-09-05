import React, { useState, forwardRef, useImperativeHandle } from "react";
import "./ImageField.css";
import ReusableButton from "./ReusableButton.tsx";
import  {default as Cropper} from 'react-easy-crop';
import cropImageAsBase64 from "../scripts/CropImage.ts"
import Modal from "./Modal.tsx";

type CroppedArea = { x: number; y: number; width: number; height: number };
type CroppedAreaPixels = { x: number; y: number; width: number; height: number };

interface ImageDimensions {
    width: number;
    height: number;
    aspectRatio: number;
}

interface ImageFieldProps {
    name?: string;
    value?: string;
    onChange?: (event: { target: { name?: string; value: string } }) => void;
}

const ImageField = forwardRef<HTMLInputElement, ImageFieldProps>(({
    name,
    value,
    onChange
}, ref) => {
    const [imgSource, setImageSource] = useState("");
    const [croppedImage, setCroppedImage] = useState(value || "");
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels>();
    const [showCropModal, setShowCropModal] = useState(false);
    const [crop, setCrop] = useState({x: 0, y: 0})
    const [zoom, setZoom] = useState(1);
    const [imageDimensions, setImageDimensions] = useState<ImageDimensions | null>(null);
    const [selectedAspectRatio, setSelectedAspectRatio] = useState<number | null>(null);

    // Common aspect ratios
    const aspectRatios = [
        { label: "Original", value: null },
        { label: "Square (1:1)", value: 1 },
        { label: "4:3", value: 4/3 },
        { label: "3:2", value: 3/2 },
        { label: "16:9", value: 16/9 },
        { label: "21:9", value: 21/9 },
        { label: "3:4 (Portrait)", value: 3/4 },
        { label: "2:3 (Portrait)", value: 2/3 },
        { label: "9:16 (Portrait)", value: 9/16 },
    ];

    // Expose input-like methods to parent via ref
    useImperativeHandle(ref, () => ({
        value: croppedImage,
        name: name || '',
        focus: () => {},
        blur: () => {}
    } as HTMLInputElement));

    function getImageDimensions(imageSrc: string): Promise<ImageDimensions> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                resolve({
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                    aspectRatio: img.naturalWidth / img.naturalHeight
                });
            };
            img.onerror = reject;
            img.src = imageSrc;
        });
    }

    // Calculate optimal crop container dimensions based on image aspect ratio
    const getCropContainerStyle = () => {
        if (!imageDimensions) return { height: '450px' };
        
        const maxWidth = window.innerWidth * 0.8; // 80% of viewport width
        const maxHeight = window.innerHeight * 0.6; // 60% of viewport height
        
        let containerWidth, containerHeight;
        
        if (imageDimensions.aspectRatio > 1) {
            // Landscape image
            containerWidth = Math.min(maxWidth, 800);
            containerHeight = containerWidth / imageDimensions.aspectRatio;
            if (containerHeight > maxHeight) {
                containerHeight = maxHeight;
                containerWidth = containerHeight * imageDimensions.aspectRatio;
            }
        } else {
            // Portrait image
            containerHeight = Math.min(maxHeight, 600);
            containerWidth = containerHeight * imageDimensions.aspectRatio;
            if (containerWidth > maxWidth) {
                containerWidth = maxWidth;
                containerHeight = containerWidth / imageDimensions.aspectRatio;
            }
        }
        
        return {
            width: `${containerWidth}px`,
            height: `${containerHeight}px`,
        };
    };

    // Calculate minimum zoom to show entire image
    const getZoomLimits = () => {
        if (!imageDimensions) return { min: 0.1, max: 3 };
        
        // Allow zooming out to see the entire image plus some padding
        const minZoom = 0.1;
        const maxZoom = Math.max(3, Math.min(imageDimensions.width / 400, imageDimensions.height / 400));
        
        return { min: minZoom, max: maxZoom };
    };

    function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            setCrop({x: 0, y: 0});
            setZoom(1);
            const reader = new FileReader();
            reader.addEventListener("load", async () => {
                const imageSrc = reader.result?.toString() || "";
                setImageSource(imageSrc);
                
                try {
                    const dimensions = await getImageDimensions(imageSrc);
                    setImageDimensions(dimensions);
                    setSelectedAspectRatio(dimensions.aspectRatio); // Default to original aspect ratio
                    setShowCropModal(true);
                } catch (error) {
                    console.error("Error getting image dimensions:", error);
                    setShowCropModal(true);
                }
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    function handleCropping(croppedArea: CroppedArea, croppedAreaPixels: CroppedAreaPixels) {
        setCroppedAreaPixels(croppedAreaPixels);
    }

    const handleCropDone = () => {
        setShowCropModal(false);
        if (!croppedAreaPixels) {return}

        cropImageAsBase64(imgSource,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            "newImg.png")
                .then((base64String: string) => {
                    setCroppedImage(base64String);
                    onChange?.({ target: { name, value: base64String } });
                })
    };

    const handleCropCancel = () => {
        setShowCropModal(false);
        setImageSource("");
        setCroppedAreaPixels(undefined);
        setCrop({x: 0, y: 0});
        setZoom(1);
        setImageDimensions(null);
        setSelectedAspectRatio(null);
    };

    function handleDeleteClick() {
        setImageSource("")
        setCroppedImage("")
        setCroppedAreaPixels(undefined)
        setCrop({x: 0, y: 0})
        setZoom(1)
        setImageDimensions(null);
        setSelectedAspectRatio(null);
        onChange?.({ target: { name, value: "" } });
    }

    const handleAspectRatioChange = (aspectRatio: number | null) => {
        setSelectedAspectRatio(aspectRatio);
        // Reset crop when aspect ratio changes
        setCrop({x: 0, y: 0});
        setZoom(1);
    };

    const zoomLimits = getZoomLimits();
    const cropContainerStyle = getCropContainerStyle();

    return (
        <div>
            {/* Hidden input to store the cropped image data for form submission */}
            <input type="hidden" name={name} value={croppedImage} />

            {!imgSource ? (
                <div className="image-upload-container">
                    <input type="file" accept="image/*" onChange={onSelectFile} />
                </div>
            ) : (
                <div className="image-controls">
                    {imageDimensions && (
                        <div className="image-info">
                            <p>Original: {imageDimensions.width} × {imageDimensions.height} pixels</p>
                            <p>Aspect Ratio: {imageDimensions.aspectRatio.toFixed(2)}:1</p>
                        </div>
                    )}
                    <ReusableButton type="button" onClick={() => setShowCropModal(true)}>
                        Edit Crop
                    </ReusableButton>
                    <ReusableButton type="button" onClick={handleDeleteClick}>
                        Delete Image
                    </ReusableButton>
                </div>
            )}

            {showCropModal && (
                <Modal isOpen={showCropModal} title={"Crop Your Image"}>
                    <Modal.Body>
                        {imageDimensions && (
                            <div className="image-info-modal">
                                <p>Image: {imageDimensions.width} × {imageDimensions.height} pixels (Ratio: {imageDimensions.aspectRatio.toFixed(2)}:1)</p>
                            </div>
                        )}
                        
                        <div className="aspect-ratio-selector">
                            <label>Aspect Ratio:</label>
                            <select 
                                value={selectedAspectRatio || 'original'} 
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === 'original') {
                                        handleAspectRatioChange(imageDimensions?.aspectRatio || null);
                                    } else {
                                        handleAspectRatioChange(parseFloat(value));
                                    }
                                }}
                            >
                                {aspectRatios.map((ratio, index) => (
                                    <option 
                                        key={index} 
                                        value={ratio.value || 'original'}
                                    >
                                        {ratio.label}
                                        {ratio.value === null && imageDimensions 
                                            ? ` (${imageDimensions.aspectRatio.toFixed(2)}:1)`
                                            : ''
                                        }
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="crop-container" style={cropContainerStyle}>
                            <Cropper
                                crop={crop}
                                zoom={zoom}
                                onCropChange={setCrop}
                                onCropComplete={handleCropping}
                                onZoomChange={setZoom}
                                image={imgSource}
                                aspect={selectedAspectRatio || undefined}
                                objectFit="cover"
                                cropShape="rect"
                                restrictPosition={false}
                                style={{ 
                                    containerStyle: { 
                                        width: "100%", 
                                        height: "100%",
                                        backgroundColor: "#f5f5f5"
                                    }
                                }}
                                minZoom={zoomLimits.min}
                                maxZoom={zoomLimits.max}
                            />
                        </div>
                        
                        <div className="zoom-control-container">
                            <span>Zoom:</span>
                            <input
                                type="range"
                                min={zoomLimits.min}
                                max={zoomLimits.max}
                                step={0.05}
                                value={zoom}
                                onChange={(e) => setZoom(parseFloat(e.target.value))}
                                className="zoom-slider"
                            />
                            <span>{zoom.toFixed(2)}x</span>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="crop-button-container">
                            <ReusableButton type="button" onClick={handleCropCancel}>
                                Cancel
                            </ReusableButton>
                            <ReusableButton type="button" onClick={handleCropDone}>
                                Apply Crop
                            </ReusableButton>
                        </div>
                    </Modal.Footer>
                </Modal>
            )}
            {croppedImage && (
                <div className="cropped-image-container">
                    <img src={croppedImage} alt="Cropped" />
                </div>
            )}
        </div>
    );
});

export default ImageField;