import React, { useState, forwardRef, useImperativeHandle } from "react";
import "./ImageField.css";
import ReusableButton from "./ReusableButton.tsx";
import  {default as Cropper} from 'react-easy-crop';
import cropImageAsBase64 from "../scripts/CropImage.ts"

type CroppedArea = { x: number; y: number; width: number; height: number };
type CroppedAreaPixels = { x: number; y: number; width: number; height: number };

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
    const [imageNaturalSize, setImageNaturalSize] = useState<{width: number, height: number} | null>(null);
    const [dynamicAspect, setDynamicAspect] = useState<number>(16/9);
    const [minZoom, setMinZoom] = useState<number>(1);
    const [maxZoom, setMaxZoom] = useState<number>(3);

    // Expose input-like methods to parent via ref
    useImperativeHandle(ref, () => ({
        value: croppedImage,
        name: name || '',
        focus: () => {},
        blur: () => {}
    } as HTMLInputElement));

    function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            setCrop({x: 0, y: 0});
            setZoom(1);
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                const imageUrl = reader.result?.toString() || "";
                setImageSource(imageUrl);
                
                // Load image to get natural dimensions
                const img = new Image();
                img.onload = () => {
                    const naturalWidth = img.naturalWidth;
                    const naturalHeight = img.naturalHeight;
                    const naturalAspect = naturalWidth / naturalHeight;
                    
                    setImageNaturalSize({ width: naturalWidth, height: naturalHeight });
                    
                    // Set dynamic aspect ratio based on image
                    // For very wide images, use their aspect ratio
                    // For very tall images, limit to a reasonable aspect
                    if (naturalAspect > 3) {
                        setDynamicAspect(3); // Max 3:1 aspect ratio
                    } else if (naturalAspect < 0.5) {
                        setDynamicAspect(0.5); // Min 1:2 aspect ratio
                    } else {
                        setDynamicAspect(naturalAspect);
                    }
                    
                    // Calculate better zoom range based on image size
                    const containerAspect = 16/9; // Our container aspect ratio
                    let calculatedMinZoom = 1;
                    let calculatedMaxZoom = 5;
                    
                    if (naturalAspect > containerAspect) {
                        // Wide image - might need more zoom to fill height
                        calculatedMinZoom = Math.max(0.5, containerAspect / naturalAspect);
                        calculatedMaxZoom = Math.min(8, naturalAspect / containerAspect * 3);
                    } else {
                        // Tall image - might need more zoom to fill width
                        calculatedMinZoom = Math.max(0.5, naturalAspect / containerAspect);
                        calculatedMaxZoom = Math.min(8, containerAspect / naturalAspect * 3);
                    }
                    
                    setMinZoom(calculatedMinZoom);
                    setMaxZoom(calculatedMaxZoom);
                    setZoom(calculatedMinZoom);
                };
                img.src = imageUrl;
                setShowCropModal(true);
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
        setCrop({x: 0, y: 0})
        setZoom(1)
        setImageNaturalSize(null);
        setDynamicAspect(16/9);
        setMinZoom(1);
        setMaxZoom(3);
    };

    function handleDeleteClick() {
        setImageSource("")
        setCroppedImage("")
        setCroppedAreaPixels(undefined)
        setCrop({x: 0, y: 0})
        setZoom(1)
        setImageNaturalSize(null);
        setDynamicAspect(16/9);
        setMinZoom(1);
        setMaxZoom(3);
        onChange?.({ target: { name, value: "" } });
    }

    // Reset crop position when aspect ratio changes
    const handleAspectChange = (newAspect: number) => {
        setDynamicAspect(newAspect);
        setCrop({x: 0, y: 0}); // Reset crop position
    };

    return (
        <div>
            {/* Hidden input to store the cropped image data for form submission */}
            <input type="hidden" name={name} value={croppedImage} />

            {!imgSource ? (
                <input type="file" accept="image/*" onChange={onSelectFile} />
            ) : (
                <div className="image-controls">
                    <ReusableButton type="button" onClick={() => setShowCropModal(true)}>
                        Edit Crop
                    </ReusableButton>
                    <ReusableButton type="button" onClick={handleDeleteClick}>
                        Delete Image
                    </ReusableButton>
                </div>
            )}

            {showCropModal && (
                <div className="crop-modal-overlay">
                    <div className="crop-modal-content">
                        <h3 className="crop-modal-title">Crop Your Image</h3>
                        
                        {/* Image info and aspect ratio controls */}
                        {imageNaturalSize && (
                            <div className="image-info-container">
                                <div className="image-info">
                                    <span>Original: {imageNaturalSize.width}×{imageNaturalSize.height}</span>
                                    <span>Aspect: {(imageNaturalSize.width / imageNaturalSize.height).toFixed(2)}:1</span>
                                </div>
                                <div className="aspect-ratio-controls">
                                    <label>Crop Aspect:</label>
                                    <select 
                                        value={dynamicAspect} 
                                        onChange={(e) => handleAspectChange(parseFloat(e.target.value))}
                                        className="aspect-select"
                                    >
                                        <option value={16/9}>16:9 (Landscape)</option>
                                        <option value={4/3}>4:3 (Standard)</option>
                                        <option value={1}>1:1 (Square)</option>
                                        <option value={3/4}>3:4 (Portrait)</option>
                                        <option value={9/16}>9:16 (Tall)</option>
                                        <option value={imageNaturalSize.width / imageNaturalSize.height}>
                                            Original ({(imageNaturalSize.width / imageNaturalSize.height).toFixed(2)}:1)
                                        </option>
                                    </select>
                                </div>
                            </div>
                        )}
                        
                        <div className="crop-container">
                            <Cropper
                                crop={crop}
                                zoom={zoom}
                                onCropChange={setCrop}
                                onCropComplete={handleCropping}
                                onZoomChange={setZoom}
                                image={imgSource}
                                aspect={dynamicAspect}
                                objectFit="cover"
                                cropShape="rect"
                                restrictPosition
                                minZoom={minZoom}
                                maxZoom={maxZoom}
                                style={{ 
                                    containerStyle: { 
                                        width: "100%", 
                                        height: "100%",
                                        backgroundColor: "#f5f5f5"
                                    }
                                }}
                            />
                        </div>
                        <div className="zoom-control-container">
                            <span>Zoom:</span>
                            <input
                                type="range"
                                min={minZoom}
                                max={maxZoom}
                                step={0.05}
                                value={zoom}
                                onChange={(e) => setZoom(parseFloat(e.target.value))}
                                className="zoom-slider"
                            />
                            <span className="zoom-value">{zoom.toFixed(2)}x</span>
                        </div>
                        <div className="crop-button-container">
                            <ReusableButton type="button" onClick={handleCropCancel}>
                                Cancel
                            </ReusableButton>
                            <ReusableButton type="button" onClick={handleCropDone}>
                                Apply Crop
                            </ReusableButton>
                        </div>
                    </div>
                </div>
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