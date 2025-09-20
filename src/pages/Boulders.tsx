import React, { useState, useEffect, useContext } from 'react'
import type Boulder from "../interfaces/Boulder.ts";
import ReusableButton from "../components/ReusableButton.tsx";
import type {BoulderData} from "../interfaces/BoulderData.ts";
import RouteSends from "./RouteSends.tsx";
import {apiUrl} from "../constants/global.ts";
import {TokenContext} from "../Context.tsx";
import {
    Container, Box, Flex, VStack, HStack,
    Heading, Image as ImageTag, Text, Badge,
    AspectRatio, Card, Separator,
    SimpleGrid, Skeleton, Alert, Dialog, Portal
} from "@chakra-ui/react";
import MenuButton from "../components/MenuButton.tsx";
import AbstractForm from "../components/AbstractForm.tsx";
import Pagination from "../components/Pagination.tsx";
import {handleFormDataImage} from "../Helpers.ts";
import InputField from "../interfaces/InputField.ts";
import {Grade} from "../interfaces/Grade.ts";

interface BoulderProps{
    boulderData: Array<BoulderData> | undefined
    isLoading?: boolean
    placeID: number,
    grades: Grade[],
    refetchBoulders: () => void
}

function Boulders(props: BoulderProps) {
    const { placeID, boulderData, refetchBoulders, isLoading = false } = props
    const boulders: Array<Boulder> | undefined = boulderData?.map((boulder: BoulderData) => boulder.boulder)
    const boulderLength = boulders?.length || 0
    const [page, setPage] = useState<number>(0)
    const [boulderAdded, setBoulderAdded] = useState<boolean>(false)
    const { user } = useContext(TokenContext)
    const [boulderAction, setBoulderAction] = useState<"add" | "edit" | "delete" | null>(null)
    const [imageFullscreen, setImageFullscreen] = useState<boolean>(false)
    const [imageInfo, setImageInfo] = useState<{ width: number; height: number; aspectRatio: number } | null>(null)
    const [selectedGrade, setSelectedGrade] = useState<string[]>([])

    useEffect(() => {
        // Reset page logic
    }, [placeID, boulderData]);

    useEffect(() => {
        if(boulders && boulderLength > 0 && boulderAdded) {
            if(boulderAdded) {
                setPage(0)
                setBoulderAdded(false)
            }
        }
    }, [boulders])

    function handleAddSubmit(event: React.FormEvent) {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement)
        formData.set("placeID", placeID.toString())
        formData.set("grade", selectedGrade.toString())
        handleFormDataImage(formData)

        fetch(`${apiUrl}/boulders/place/add`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + user.access_token,
            },
            body: formData
        })
            .then(_ => {
                setBoulderAdded(true)
                setBoulderAction(null)
                setSelectedGrade([])
                refetchBoulders()
            })
            .catch(error => console.error(error))
            .finally(() => {setBoulderAction(null)})
    }

    function handleEditSubmit(event: React.FormEvent){
        event.preventDefault();
        if (!boulders || boulders.length < 1) { return }

        const formData = new FormData(event.target as HTMLFormElement);
        handleFormDataImage(formData)
        formData.set("placeID", boulders[page].place.toString());
        formData.set("boulderID", boulders[page].id.toString());
        formData.set("grade", selectedGrade.toString());
        formData.entries().forEach(entry => {
            if(!entry[1]) {
                formData.delete(entry[0])
            }
        });

        fetch(`${apiUrl}/boulders/place/update`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + user.access_token,
            },
            body: formData
        })
            .then(_ => {
                refetchBoulders()
                setSelectedGrade([])
            })
            .catch(error => console.error(error))
            .finally(() => {setBoulderAction(null)})
    }

    function handleDeleteClick() {
        if(!boulders) {
            return
        }
        const boulderID: number = boulders[page].id

        fetch(`${apiUrl}/boulders`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + user.access_token
                },
                body: JSON.stringify({
                    id: boulderID
                })
            }
        )
            .then(() => refetchBoulders())
            .then(() => {
                if(page == 0) {
                    return
                }
                setPage(page - 1)
            })
    }

    const gradeOptions = props.grades.map((grade: Grade) => {return {label: grade.gradeString, value: grade.id.toString()}})

    const fields = [
        {"label": "Name", "type": "string", "name": "name", "required": true},
        {"label": "Description", "type": "string", "name": "description", "required": false},
        {"label": "Grade", "type": "select", "name": "grade", "required": true, "options": gradeOptions, value: selectedGrade, setter: setSelectedGrade},
        {"label": "Image", "type": "image", "name": "image", "required": false, "accept": "image/*"},
    ]

    const menuItems = [
        { value: "add", label: "Add Boulder", "onClick": () => handleBoulderActionClick("add") },
        { value: "edit", label: "Edit Boulder", "onClick": () => handleBoulderActionClick("edit") },
        { value: "delete", label: "Delete Boulder", "onClick": handleDeleteClick, color: "fg.error", "hover": {"bg": "bg.error", "color": "fg.error"} },
    ]

    function handleBoulderActionClick(action: "add" | "edit" | "delete" | null ) {
        setBoulderAction(action)
    }

    function getImageInfo(imageUrl: string): Promise<{ width: number; height: number; aspectRatio: number}> {
        return new Promise((resolve, reject) => {
            const img = new Image()

            img.onload = () => {
                resolve({ width: img.naturalWidth, height: img.naturalHeight, aspectRatio: img.naturalWidth / img.naturalHeight });
            };

            img.onerror = (error) => {
                reject(new Error(`Failed to load image from URL: ${imageUrl}. Error: ${error}`));
            };

            img.src = imageUrl;
        });
    }


    if(boulders && boulderLength > page && boulders[page].image) {
        getImageInfo(boulders[page].image).then(info => setImageInfo(info))
    }

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
        )
    }

    if(boulderAction === "add") {
        return(
            <Container maxW="2xl" py={8}>
                <Card.Root>
                    <Card.Header textAlign="center">
                        <Heading size="lg" color="brand.600">Add New Boulder</Heading>
                        <Text color="fg.muted" mt={2}>
                            Add a new boulder to this climbing area
                        </Text>
                    </Card.Header>
                    <Card.Body>
                        <AbstractForm fields={fields} handleSubmit={handleAddSubmit}
                            footer={
                                <HStack justify="space-between" pt={4}>
                                    <ReusableButton
                                        onClick={() => {
                                            setBoulderAction(null)
                                            setSelectedGrade([])}
                                    }
                                        variant="outline"
                                    >
                                        Cancel
                                    </ReusableButton>
                                    <ReusableButton type="submit" colorPalette="brand">
                                        Add Boulder
                                    </ReusableButton>
                                </HStack>
                            }
                        />
                    </Card.Body>
                </Card.Root>
            </Container>
        )
    }

    let gradeString = ""
    if(boulders && boulderLength > 0 && page < boulderLength) {
        gradeString = props.grades.find(item => item.id == boulders[page].grade)?.gradeString || ""
    }
    if(boulderAction === "edit") {
        const editFields = fields.map((field: InputField) => {

            if(field.name === "grade" && props.grades.length > 0) {
                return {...field, required: false, placeholder: props.grades.find(item => item.id == boulders[page].grade).gradeString}
            }
            return {...field, required: false, placeholder: boulders[page][field.name] || ""}
        })
            return (
                <Container maxW="2xl" py={8}>
                    <Card.Root>
                        <Card.Header textAlign="center">
                            <Heading size="lg" color="brand.600">Edit Boulder</Heading>
                            <Text color="fg.muted" mt={2}>
                                Update boulder information
                            </Text>
                        </Card.Header>
                        <Card.Body>
                            <AbstractForm
                                fields={editFields}
                                handleSubmit={handleEditSubmit}
                                footer={
                                    <HStack justify="space-between" pt={4}>
                                        <ReusableButton
                                            onClick={() => {
                                                setBoulderAction(null)
                                                setSelectedGrade([])
                                            }}
                                            variant="outline"
                                        >
                                            Cancel
                                        </ReusableButton>
                                        <ReusableButton type="submit" colorPalette="brand">
                                            Save Changes
                                        </ReusableButton>
                                    </HStack>
                                }
                            />
                        </Card.Body>
                    </Card.Root>
                </Container>
            )
        }

    return(
        <>
            {boulders && boulderLength > 0 && page < boulderLength ? (
                <Container maxW="6xl" py={8}>
                    {/* Header Section */}
                    <Card.Root mb={6} bg="gradient-to-r" bgGradient="linear(to-r, brand.50, accent.50)">
                        <Card.Body>
                            <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                                <VStack align="start">
                                    <Heading size="2xl" color="brand.700">
                                        {boulders[page].name}
                                    </Heading>
                                    <HStack>
                                        <Badge
                                            colorPalette="accent"
                                            size="lg"
                                            px={3}
                                            py={1}
                                            borderRadius="full"
                                        >
                                            {gradeString}
                                        </Badge>
                                        <Badge
                                            colorPalette="blue"
                                            variant="outline"
                                            size="sm"
                                        >
                                            {page + 1} of {boulderLength}
                                        </Badge>
                                    </HStack>
                                </VStack>
                                <MenuButton options={menuItems} />
                            </Flex>
                        </Card.Body>
                    </Card.Root>

                    {/* Main Content Grid */}
                    <SimpleGrid columns={{base: 1, lg: 2}}>
                        {/* Left Column - Stats and Controls */}
                        <VStack align="stretch">
                            {/* Route Sends Component */}
                            <RouteSends
                                boulderID={boulders[page].id}
                                routeSend={boulderData?.[page].routeSend}
                            />

                            {/* Pagination Card */}
                            <Card.Root>
                                <Card.Header>
                                    <Heading size="md" color="neutral.700">
                                        Navigation
                                    </Heading>
                                </Card.Header>
                                <Card.Body>
                                    <Box
                                        display="flex"
                                        justifyContent="center"
                                        p={4}
                                        bg="bg.subtle"
                                        borderRadius="md"
                                    >
                                        <Pagination
                                            pageSize={1}
                                            count={boulderLength}
                                            onPageChange={setPage}
                                            page={page}
                                        />
                                    </Box>
                                </Card.Body>
                            </Card.Root>
                        </VStack>

                        {/* Right Column - Image */}
                        <VStack align="stretch">
                            <Card.Root overflow="hidden">
                                <Card.Header>
                                    <Heading size="md" color="neutral.700">
                                        Route Image
                                    </Heading>
                                </Card.Header>
                                <Card.Body p={0}>
                                    {boulders[page].image ? (
                                        <AspectRatio ratio={4/3}>
                                            <ImageTag
                                                src={boulders[page].image}
                                                alt={`${boulders[page].name} boulder image`}
                                                objectFit="cover"
                                                width="full"
                                                height="full"
                                                transition="transform 0.3s"
                                                cursor="pointer"
                                                _hover={{
                                                    transform: "scale(1.02)"
                                                }}
                                                onClick={() => setImageFullscreen(true)}
                                            />
                                        </AspectRatio>
                                    ) : (
                                        <AspectRatio ratio={4/3}>
                                            <Flex
                                                align="center"
                                                justify="center"
                                                bg="bg.muted"
                                                color="fg.muted"
                                                direction="column"
                                                gap={2}
                                            >
                                                <Box fontSize="4xl" opacity={0.5}>📸</Box>
                                                <Text fontSize="sm">No image available</Text>
                                                <ReusableButton
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleBoulderActionClick("edit")}
                                                >
                                                    Add Image
                                                </ReusableButton>
                                            </Flex>
                                        </AspectRatio>
                                    )}
                                </Card.Body>
                            </Card.Root>

                            {/* Image Info */}
                            {boulders[page].image && (
                                <Card.Root size="sm">
                                    <Card.Body>
                                        <Text fontSize="sm" color="fg.muted" textAlign="center">
                                            {boulders[page].description || "No description available"}
                                        </Text>
                                    </Card.Body>
                                </Card.Root>
                            )}
                        </VStack>
                    </SimpleGrid>
                </Container>
            ) : (
                <Container maxW="2xl" py={16}>
                    <Alert.Root status="info" flexDirection="column" textAlign="center" p={8}>
                        <Alert.Indicator boxSize="12" />
                        <Alert.Title fontSize="lg" mb={2}>
                            No Boulders Found
                        </Alert.Title>
                        <Alert.Description mb={4}>
                            This climbing area doesn't have any boulders yet.
                            Would you like to add the first one?
                        </Alert.Description>
                        <ReusableButton
                            colorPalette="brand"
                            onClick={() => handleBoulderActionClick("add")}
                        >
                            Add First Boulder
                        </ReusableButton>
                    </Alert.Root>
                </Container>
            )}

            {/* Fullscreen Image Modal */}
            {imageFullscreen && boulders && boulders[page].image && (
                <Dialog.Root open={imageFullscreen} onOpenChange={() => setImageFullscreen(false)}>
                    <Dialog.Backdrop
                        bg="blackAlpha.800"
                        backdropFilter="blur(4px)"
                        zIndex={9999}
                    />
                    <Dialog.Content
                        p={4}
                        bg="blackAlpha.900"
                        border="none"
                        zIndex={10000}
                        position="fixed"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                        width="auto"
                        maxW="95vw"
                        maxH="95vh"
                        overflow="auto"
                    >
                        <Dialog.Header pb={2}>
                            <Dialog.Title color="white" fontSize="lg">
                                {/*boulders[page].name*/}
                            </Dialog.Title>
                            <Dialog.CloseTrigger
                                color="white"
                                _hover={{ bg: "whiteAlpha.200" }}
                                borderRadius="md"
                                p={1}
                            />
                        </Dialog.Header>
                            <Dialog.Body p={0}>
                                <Box justifyContent={"center"} display={"flex"} alignItems={"center"} flex={1}>
                                    <ImageTag
                                        src={boulders[page].image}
                                        alt={`${boulders[page].name} boulder image - fullscreen`}
                                        objectFit="contain"
                                        borderRadius="md"
                                        onClick={() => setImageFullscreen(false)}
                                        cursor="pointer"
                                        width={imageInfo ? Math.min(imageInfo.width, window.innerWidth * 0.9) : "90vw"}
                                        height={imageInfo ? Math.min(imageInfo.height, window.innerHeight * 0.85) : "85vh"}
                                        maxW="75vw" maxH="80vh"
                                        minW="50vw" minH="50vh"
                                        aspectRatio={imageInfo.aspectRatio}
                                    />
                                </Box>
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Root>
            )}
        </>
    );
}

export default Boulders;