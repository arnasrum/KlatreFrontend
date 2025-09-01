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
                setImageSource(reader.result?.toString() || "");
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
    };

    function handleDeleteClick() {
        setImageSource("")
        setCroppedImage("")
        setCroppedAreaPixels(undefined)
        setCrop({x: 0, y: 0})
        setZoom(1)
        onChange?.({ target: { name, value: "" } });
    }

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
                        <div className="crop-container">
                            <Cropper
                                crop={crop}
                                zoom={zoom}
                                onCropChange={setCrop}
                                onCropComplete={handleCropping}
                                onZoomChange={setZoom}
                                image={imgSource}
                                aspect={16/9}
                                objectFit="cover"
                                cropShape="rect"
                                restrictPosition
                                style={{ containerStyle: { "width": "100%", "height": "100%" }}}
                            />
                        </div>
                        <div className="zoom-control-container">
                            <span>Zoom:</span>
                            <input
                                type="range"
                                min={1}
                                max={3}
                                step={0.1}
                                value={zoom}
                                onChange={(e) => setZoom(parseFloat(e.target.value))}
                                className="zoom-slider"
                            />
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