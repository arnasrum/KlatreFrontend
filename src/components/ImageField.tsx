import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Box, VStack, HStack, Text, Input, Card, Badge, NativeSelect } from "@chakra-ui/react";
import ReusableButton from "./ReusableButton.tsx";
import { default as Cropper } from 'react-easy-crop';
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
}

const ImageField = forwardRef<HTMLInputElement, ImageFieldProps>(({
    name,
    value,
}, ref) => {
    const [imgSource, setImageSource] = useState("")
    const [croppedImage, setCroppedImage] = useState(value || "")
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels>()
    const [showCropModal, setShowCropModal] = useState(false);
    const [crop, setCrop] = useState({x: 0, y: 0})
    const [zoom, setZoom] = useState(1)
    const [imageDimensions, setImageDimensions] = useState<ImageDimensions | null>(null)
    const [selectedAspectRatio, setSelectedAspectRatio] = useState<number | null>(null)

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

    useImperativeHandle(ref, () => ({
        value: croppedImage,
        name: name || '',
        focus: () => {},
        blur: () => {}
    } as HTMLInputElement))

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
            img.onerror = reject
            img.src = imageSrc
        });
    }

    const getCropContainerStyle = () => {
        if (!imageDimensions) return { height: '500px', width: '700px' }
        
        const maxWidth = Math.min(window.innerWidth * 0.7, 900)
        const maxHeight = Math.min(window.innerHeight * 0.5, 600)
        
        let containerWidth, containerHeight
        
        if (imageDimensions.aspectRatio > maxWidth / maxHeight) {
            containerWidth = maxWidth
            containerHeight = maxWidth / imageDimensions.aspectRatio
        } else {
            containerHeight = maxHeight
            containerWidth = maxHeight * imageDimensions.aspectRatio
        }
        
        containerWidth = Math.max(containerWidth, 400)
        containerHeight = Math.max(containerHeight, 300)
        
        return {
            width: `${Math.round(containerWidth)}px`,
            height: `${Math.round(containerHeight)}px`,
        };
    };

    const getZoomLimits = () => {
        if (!imageDimensions) return { min: 0.1, max: 5 };
        
        const containerStyle = getCropContainerStyle()
        const containerWidth = parseInt(containerStyle.width)
        const containerHeight = parseInt(containerStyle.height)
        
        const scaleX = containerWidth / imageDimensions.width
        const scaleY = containerHeight / imageDimensions.height
        const minZoomToFit = Math.min(scaleX, scaleY)
        
        // Allow much more generous zoom range
        const minZoom = Math.max(0.1, minZoomToFit * 0.5)
        const maxZoom = 10
        
        return { min: minZoom, max: maxZoom }
    };

    function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            setCrop({x: 0, y: 0})
            setZoom(1)
            const reader = new FileReader()
            reader.addEventListener("load", async () => {
                const imageSrc = reader.result?.toString() || ""
                setImageSource(imageSrc)
                
                try {
                    const dimensions = await getImageDimensions(imageSrc)
                    setImageDimensions(dimensions)
                    setSelectedAspectRatio(dimensions.aspectRatio)
                    
                    setTimeout(() => {
                        const limits = getZoomLimits()
                        const initialZoom = Math.max(limits.min, 0.5)
                        setZoom(initialZoom)
                    }, 100)
                    
                    setShowCropModal(true)
                } catch (error) {
                    console.error("Error getting image dimensions:", error)
                    setShowCropModal(true)
                }
            });
            reader.readAsDataURL(e.target.files[0])
        }
    }

    function handleCropping(croppedArea: CroppedArea, croppedAreaPixels: CroppedAreaPixels) {
        setCroppedAreaPixels(croppedAreaPixels);
    }

    const handleCropDone = () => {
        setShowCropModal(false)
        if (!croppedAreaPixels) {return}

        cropImageAsBase64(imgSource,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            "newImg.png")
                .then((base64String: string) => {
                    setCroppedImage(base64String)
                })
    };

    const handleCropCancel = () => {
        setShowCropModal(false);
        setImageSource("")
        setCroppedAreaPixels(undefined);
        setCrop({x: 0, y: 0})
        setZoom(1)
        setImageDimensions(null)
        setSelectedAspectRatio(null)
    };

    function handleDeleteClick() {
        setImageSource("")
        setCroppedImage("")
        setCroppedAreaPixels(undefined)
        setCrop({x: 0, y: 0})
        setZoom(1)
        setImageDimensions(null)
        setSelectedAspectRatio(null)
    }

    const handleAspectRatioChange = (aspectRatio: number | null) => {
        setSelectedAspectRatio(aspectRatio)
        setCrop({x: 0, y: 0})
        
        const limits = getZoomLimits();
        if (zoom < limits.min) {
            setZoom(limits.min)
        }
    };

    // Reset zoom to fit image
    const handleResetZoom = () => {
        const limits = getZoomLimits()
        setZoom(limits.min)
        setCrop({x: 0, y: 0})
    };

    const zoomLimits = getZoomLimits()
    const cropContainerStyle = getCropContainerStyle()

    return (
        <VStack gap={4} align="stretch">
            <input type="hidden" name={name} value={croppedImage} />

            {!imgSource ? (
                <Card.Root p={4} borderStyle="dashed" borderWidth="2px" borderColor="gray.300">
                    <Card.Body textAlign="center">
                        <Text mb={3} color="gray.600">Upload an image</Text>
                        <Input 
                            type="file" 
                            accept="image/*" 
                            onChange={onSelectFile}
                            border="none"
                            p={0}
                            _file={{
                                border: "1px solid",
                                borderColor: "gray.300",
                                borderRadius: "md",
                                p: 2
                            }}
                        />
                    </Card.Body>
                </Card.Root>
            ) : (
                <VStack gap={3} align="stretch">
                    {imageDimensions && (
                        <Card.Root size="sm">
                            <Card.Body>
                                <HStack justify="space-between" wrap="wrap" gap={2}>
                                    <Badge colorPalette="blue">
                                        {imageDimensions.width} × {imageDimensions.height}px
                                    </Badge>
                                    <Badge colorPalette="green">
                                        Ratio: {imageDimensions.aspectRatio.toFixed(2)}:1
                                    </Badge>
                                </HStack>
                            </Card.Body>
                        </Card.Root>
                    )}
                    <HStack gap={3}>
                        <ReusableButton onClick={() => setShowCropModal(true)}>
                            Edit Crop
                        </ReusableButton>
                        <ReusableButton 
                            onClick={handleDeleteClick}
                            colorPalette="error"
                            variant="outline"
                        >
                            Delete Image
                        </ReusableButton>
                    </HStack>
                </VStack>
            )}

            {showCropModal && (
                <Modal isOpen={showCropModal} title={"Crop Your Image"}>
                    <Modal.Body>
                        <VStack gap={4} align="stretch">
                            {imageDimensions && (
                                <Card.Root size="sm" bg="blue.50">
                                    <Card.Body>
                                        <Text fontSize="sm" textAlign="center">
                                            Image: {imageDimensions.width} × {imageDimensions.height} pixels 
                                            (Ratio: {imageDimensions.aspectRatio.toFixed(2)}:1)
                                        </Text>
                                    </Card.Body>
                                </Card.Root>
                            )}
                            
                            <HStack align="center" gap={3}>
                                <Text fontWeight="semibold" minW="100px">Aspect Ratio:</Text>
                                <NativeSelect.Root size="sm">
                                    <NativeSelect.Field
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
                                    </NativeSelect.Field>
                                </NativeSelect.Root>
                            </HStack>

                            <Box 
                                style={cropContainerStyle}
                                mx="auto"
                                border="2px solid"
                                borderColor="gray.300"
                                borderRadius="lg"
                                overflow="hidden"
                                shadow="lg"
                                bg="gray.900"
                                position="relative"
                            >
                                <Cropper
                                    crop={crop}
                                    zoom={zoom}
                                    onCropChange={setCrop}
                                    onCropComplete={handleCropping}
                                    onZoomChange={setZoom}
                                    image={imgSource}
                                    aspect={selectedAspectRatio || undefined}
                                    objectFit="contain"
                                    cropShape="rect"
                                    restrictPosition={false}
                                    style={{ 
                                        containerStyle: { 
                                            width: "100%", 
                                            height: "100%",
                                            backgroundColor: "#1a1a1a"
                                        },
                                        cropAreaStyle: {
                                            border: "2px solid #ffffff",
                                            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)"
                                        },
                                        mediaStyle: {
                                            transform: `translate(${crop.x}px, ${crop.y}px) scale(${zoom})`,
                                        }
                                    }}
                                    minZoom={zoomLimits.min}
                                    maxZoom={zoomLimits.max}
                                />
                            </Box>
                            
                            <VStack gap={3}>
                                <HStack gap={3} justify="center" w="full">
                                    <Text fontWeight="medium" minW="60px">Zoom:</Text>
                                    <Input
                                        type="range"
                                        min={zoomLimits.min}
                                        max={zoomLimits.max}
                                        step={0.05}
                                        value={zoom}
                                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                                        flex="1"
                                        maxW="300px"
                                    />
                                    <Badge minW="60px" textAlign="center">
                                        {zoom.toFixed(2)}x
                                    </Badge>
                                </HStack>
                                
                                <HStack justify="center" gap={2}>
                                    <ReusableButton 
                                        onClick={handleResetZoom}
                                        size="sm"
                                        variant="outline"
                                    >
                                        Reset Zoom
                                    </ReusableButton>
                                    <ReusableButton 
                                        onClick={() => setZoom(1)}
                                        size="sm"
                                        variant="outline"
                                    >
                                        100%
                                    </ReusableButton>
                                </HStack>
                            </VStack>
                            
                            <Text 
                                fontSize="sm" 
                                color="gray.600" 
                                textAlign="center"
                                bg="gray.50"
                                p={3}
                                borderRadius="md"
                            >
                                <strong>Instructions:</strong> Drag to move • Scroll or use slider to zoom • 
                                White border shows crop area • Dark overlay will be removed
                            </Text>
                        </VStack>
                    </Modal.Body>
                    <Modal.Footer>
                        <HStack justify="center" w="full">
                            <ReusableButton 
                                onClick={handleCropCancel}
                                variant="outline"
                            >
                                Cancel
                            </ReusableButton>
                            <ReusableButton onClick={handleCropDone}>
                                Apply Crop
                            </ReusableButton>
                        </HStack>
                    </Modal.Footer>
                </Modal>
            )}
            
            {croppedImage && (
                <Card.Root>
                    <Card.Body>
                        <img 
                            src={croppedImage} 
                            alt="Cropped" 
                            style={{
                                width: "100%",
                                height: "auto",
                                borderRadius: "8px"
                            }}
                        />
                    </Card.Body>
                </Card.Root>
            )}
        </VStack>
    );
});

export default ImageField;