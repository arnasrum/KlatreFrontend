import React, { useState, useEffect, useContext } from 'react'
import type Boulder from "../interfaces/Boulder.ts";
import ReusableButton from "../components/ReusableButton.tsx";
import {apiUrl} from "../constants/global.ts";
import {
    Container, Box, Flex, VStack, HStack,
    Heading, Image as ImageTag, Text, Badge,
    AspectRatio, Card, Separator, Button, Grid,
    SimpleGrid, Skeleton, Alert, Dialog, GridItem
} from "@chakra-ui/react";
import MenuButton from "../components/MenuButton.tsx";
import AbstractForm from "../components/AbstractForm.tsx";
import Pagination from "../components/Pagination.tsx";
import {handleFormDataImage} from "../Helpers.ts";
import InputField from "../interfaces/InputField.ts";
import {Grade} from "../interfaces/Grade.ts";
import { UserContext } from "../contexts/UserContext.ts";
import { motion } from "framer-motion";
import { 
    FiImage, 
    FiEdit3, 
    FiTrash2, 
    FiPlus,
    FiArrowLeft,
    FiArrowRight,
    FiInfo
} from "react-icons/fi";

const MotionCard = motion.create(Card.Root);
const MotionBox = motion.create(Box);

interface BoulderProps{
    boulderData: Boulder[] | undefined
    isLoading?: boolean
    placeID: number,
    grades: Grade[],
    refetchBoulders: () => void
}

function Boulders(props: BoulderProps) {
    const { placeID, boulderData, refetchBoulders, isLoading = false } = props;
    const { user } = useContext(UserContext);
    const boulders = boulderData;
    const boulderLength = boulders?.length || 0;
    const [page, setPage] = useState<number>(0);
    const [boulderAdded, setBoulderAdded] = useState<boolean>(false);
    const [boulderAction, setBoulderAction] = useState<"add" | "edit" | "delete" | null>(null);
    const [imageFullscreen, setImageFullscreen] = useState<boolean>(false);
    const [imageInfo, setImageInfo] = useState<{ width: number; height: number; aspectRatio: number } | null>(null);
    const [selectedGrade, setSelectedGrade] = useState<string[]>([]);

    useEffect(() => {
        if(boulders && boulderLength > 0 && boulderAdded) {
            setPage(0);
            setBoulderAdded(false);
        }
    }, [boulders]);

    function handleAddSubmit(event: React.FormEvent) {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        formData.set("placeID", placeID.toString());
        handleFormDataImage(formData);

        fetch(`${apiUrl}/boulders/place/add`, {
            method: "POST",
            credentials: "include",
            body: formData
        })
            .then(_ => {
                setBoulderAdded(true);
                setBoulderAction(null);
                refetchBoulders();
            })
            .catch(error => console.error(error))
            .finally(() => {setBoulderAction(null)});
    }

    function handleEditSubmit(event: React.FormEvent){
        event.preventDefault();
        if (!boulders || boulders.length < 1) { return }

        const formData = new FormData(event.target as HTMLFormElement);
        handleFormDataImage(formData);
        formData.set("placeID", boulders[page].place.toString());
        formData.set("boulderID", boulders[page].id.toString());
        formData.entries().forEach(entry => {
            if(!entry[1]) {
                formData.delete(entry[0]);
            }
        });

        fetch(`${apiUrl}/boulders/place/update`, {
            method: "PUT",
            credentials: "include",
            body: formData
        })
            .then(_ => {
                refetchBoulders();
            })
            .catch(error => console.error(error))
            .finally(() => {setBoulderAction(null)});
    }

    function handleDeleteClick() {
        if(!boulders || !user) {
            return;
        }
        const boulderID: number = boulders[page].id;

        fetch(`${apiUrl}/boulders`,
            {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: boulderID
                })
            }
        )
            .then(() => refetchBoulders())
            .then(() => {
                if(page == 0) {
                    return;
                }
                setPage(page - 1);
            });
    }

    const gradeOptions = props.grades.map((grade: Grade) => {
        return {label: grade.gradeString, value: grade.id.toString()}
    });

    const fields = [
        {"label": "Name", "type": "string", "name": "name", "required": true},
        {"label": "Description", "type": "string", "name": "description", "required": false},
        {"label": "Grade", "type": "select", "name": "grade", "required": true, "options": gradeOptions},
        {"label": "Image", "type": "image", "name": "image", "required": false, "accept": "image/*"},
    ];

    function handleBoulderActionClick(action: "add" | "edit" | "delete" | null ) {
        setBoulderAction(action);
    }

    function getImageInfo(imageUrl: string): Promise<{ width: number; height: number; aspectRatio: number}> {
        return new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => {
                resolve({ width: img.naturalWidth, height: img.naturalHeight, aspectRatio: img.naturalWidth / img.naturalHeight });
            };

            img.onerror = (error) => {
                reject(new Error(`Failed to load image from URL: ${imageUrl}. Error: ${error}`));
            };

            img.src = imageUrl;
        });
    }

    if (boulders && boulderLength > page && boulders[page].image) {
        getImageInfo(boulders[page].image).then(info => setImageInfo(info));
    }

    // Loading State
    if (isLoading) {
        return (
            <Container maxW="6xl" py={8}>
                <VStack gap={6}>
                    <Skeleton height="60px" width="full" />
                    <SimpleGrid columns={{base: 1, lg: 2}} gap={8} width="full">
                        <VStack gap={4}>
                            <Skeleton height="200px" width="full" />
                            <Skeleton height="150px" width="full" />
                            <Skeleton height="50px" width="full" />
                        </VStack>
                        <Skeleton height="400px" width="full" />
                    </SimpleGrid>
                </VStack>
            </Container>
        );
    }

    // Add Boulder Form
    if(boulderAction === "add") {
        return(
            <Container maxW="2xl" py={8}>
                <Card.Root>
                    <Card.Header textAlign="center">
                        <Heading size="xl" color="brand.600" mb={2}>
                            <FiPlus style={{ display: "inline", marginRight: "8px" }} />
                            Add New Boulder
                        </Heading>
                        <Text color="fg.muted">
                            Add a new boulder problem to this climbing area
                        </Text>
                    </Card.Header>
                    <Card.Body>
                        <AbstractForm fields={fields} handleSubmit={handleAddSubmit}
                            footer={
                                <HStack justify="space-between" pt={4}>
                                    <Button
                                        onClick={() => {
                                            setBoulderAction(null);
                                            setSelectedGrade([]);
                                        }}
                                        variant="outline"
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" colorPalette="brand">
                                        Add Boulder
                                    </Button>
                                </HStack>
                            }
                        />
                    </Card.Body>
                </Card.Root>
            </Container>
        );
    }

    // Edit Boulder Form
    let gradeString = "";
    if(boulders && boulderLength > 0 && page < boulderLength) {
        gradeString = props.grades.find(item => item.id == boulders[page].grade)?.gradeString || "";
    }

    if(boulderAction === "edit") {
        const editFields = fields.map((field: InputField) => {
            if(field.name === "grade" && props.grades.length > 0) {
                return {...field, required: false, placeholder: props.grades.find(item => item.id == boulders[page].grade).gradeString};
            }
            return {...field, required: false, placeholder: boulders[page][field.name] || ""};
        });

        return (
            <Container maxW="2xl" py={8}>
                <Card.Root>
                    <Card.Header textAlign="center">
                        <Heading size="xl" color="brand.600" mb={2}>
                            <FiEdit3 style={{ display: "inline", marginRight: "8px" }} />
                            Edit Boulder
                        </Heading>
                        <Text color="fg.muted">
                            Update boulder information
                        </Text>
                    </Card.Header>
                    <Card.Body>
                        <AbstractForm
                            fields={editFields}
                            handleSubmit={handleEditSubmit}
                            footer={
                                <HStack justify="space-between" pt={4}>
                                    <Button
                                        onClick={() => {
                                            setBoulderAction(null);
                                            setSelectedGrade([]);
                                        }}
                                        variant="outline"
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" colorPalette="brand">
                                        Save Changes
                                    </Button>
                                </HStack>
                            }
                        />
                    </Card.Body>
                </Card.Root>
            </Container>
        );
    }

    // Empty State
    if(!boulders || boulderLength === 0) {
        return (
            <Container maxW="4xl" py={8}>
                <Card.Root>
                    <Card.Body p={12}>
                        <VStack gap={6} textAlign="center">
                            <Box color="brand.500" fontSize="5xl">
                                <FiImage size={64} />
                            </Box>
                            <Heading size="2xl">No Boulders Yet</Heading>
                            <Text fontSize="lg" color="fg.muted" maxW="md">
                                Start building your climbing database by adding your first boulder problem!
                            </Text>
                            <Button
                                colorPalette="brand"
                                size="lg"
                                leftIcon={<FiPlus />}
                                onClick={() => handleBoulderActionClick("add")}
                            >
                                Add First Boulder
                            </Button>
                        </VStack>
                    </Card.Body>
                </Card.Root>
            </Container>
        );
    }

    const currentBoulder = boulders[page];

    // Main Boulder Display
    return (
        <Container maxW="7xl" py={8}>
            <VStack gap={8} align="stretch">
                {/* Header with Actions */}
                <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                    <Box>
                        <Heading size="2xl" mb={2}>Boulder Problem</Heading>
                        <Text color="fg.muted">
                            Viewing {page + 1} of {boulderLength}
                        </Text>
                    </Box>
                    <HStack gap={3}>
                        <Button
                            colorPalette="brand"
                            variant="outline"
                            leftIcon={<FiPlus />}
                            onClick={() => handleBoulderActionClick("add")}
                        >
                            Add Boulder
                        </Button>
                        <Button
                            colorPalette="blue"
                            variant="outline"
                            leftIcon={<FiEdit3 />}
                            onClick={() => handleBoulderActionClick("edit")}
                        >
                            Edit
                        </Button>
                        <Button
                            colorPalette="red"
                            variant="outline"
                            leftIcon={<FiTrash2 />}
                            onClick={handleDeleteClick}
                        >
                            Delete
                        </Button>
                    </HStack>
                </Flex>

                {/* Main Content */}
                <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={8}>
                    {/* Info Card */}
                    <Card.Root>
                        <Card.Header>
                            <HStack justify="space-between" align="start">
                                <Box>
                                    <Heading size="xl" mb={2}>{currentBoulder.name}</Heading>
                                    <Badge colorPalette="purple" size="lg">
                                        Grade: {gradeString}
                                    </Badge>
                                </Box>
                            </HStack>
                        </Card.Header>
                        <Card.Body>
                            <VStack align="stretch" gap={4}>
                                <Box>
                                    <Text fontWeight="bold" color="gray.700" mb={2}>
                                        <FiInfo style={{ display: "inline", marginRight: "6px" }} />
                                        Description
                                    </Text>
                                    <Text color="fg.muted" fontSize="md">
                                        {currentBoulder.description || "No description provided"}
                                    </Text>
                                </Box>
                                <Separator />
                                <HStack justify="space-between">
                                    <Text fontSize="sm" color="gray.600">Boulder ID</Text>
                                    <Badge>{currentBoulder.id}</Badge>
                                </HStack>
                            </VStack>
                        </Card.Body>
                    </Card.Root>

                    {/* Image Card */}
                    <Card.Root>
                        <Card.Body p={0}>
                            {currentBoulder.image ? (
                                <AspectRatio ratio={imageInfo?.aspectRatio || 4/3}>
                                    <ImageTag
                                        src={currentBoulder.image}
                                        alt={currentBoulder.name}
                                        objectFit="cover"
                                        cursor="pointer"
                                        onClick={() => setImageFullscreen(true)}
                                        borderRadius="md"
                                        _hover={{ opacity: 0.9 }}
                                        transition="opacity 0.2s"
                                    />
                                </AspectRatio>
                            ) : (
                                <Flex
                                    h="400px"
                                    align="center"
                                    justify="center"
                                    bg="gray.100"
                                    borderRadius="md"
                                >
                                    <VStack>
                                        <FiImage size={48} color="gray" />
                                        <Text color="gray.500">No image available</Text>
                                    </VStack>
                                </Flex>
                            )}
                        </Card.Body>
                    </Card.Root>
                </Grid>

                {/* Pagination */}
                <Card.Root>
                    <Card.Body>
                        <HStack justify="space-between">
                            <Button
                                variant="outline"
                                leftIcon={<FiArrowLeft />}
                                onClick={() => setPage(Math.max(0, page - 1))}
                                disabled={page === 0}
                            >
                                Previous
                            </Button>
                            <Text color="gray.600" fontWeight="medium">
                                Boulder {page + 1} / {boulderLength}
                            </Text>
                            <Button
                                variant="outline"
                                rightIcon={<FiArrowRight />}
                                onClick={() => setPage(Math.min(boulderLength - 1, page + 1))}
                                disabled={page === boulderLength - 1}
                            >
                                Next
                            </Button>
                        </HStack>
                    </Card.Body>
                </Card.Root>
            </VStack>

            {/* Fullscreen Image Modal */}
            {imageFullscreen && currentBoulder.image && (
                <Box
                    position="fixed"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="blackAlpha.900"
                    zIndex={9999}
                    onClick={() => setImageFullscreen(false)}
                    cursor="pointer"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    p={8}
                >
                    <ImageTag
                        src={currentBoulder.image}
                        alt={currentBoulder.name}
                        maxH="90vh"
                        maxW="90vw"
                        objectFit="contain"
                    />
                </Box>
            )}
        </Container>
    );
}

export default Boulders;