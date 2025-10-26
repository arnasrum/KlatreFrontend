import React, { useState, useEffect, useContext } from 'react'
import type Boulder from "../interfaces/Boulder.ts";
import {apiUrl} from "../constants/global.ts";
import {
    Container, Box, Flex, VStack, HStack,
    Heading, Image as ImageTag, Text, Badge,
    AspectRatio, Card, Button,
    SimpleGrid, Skeleton
} from "@chakra-ui/react";
import AbstractForm from "../components/AbstractForm.tsx";
import {handleFormDataImage} from "../Helpers.ts";
import InputField from "../interfaces/InputField.ts";
import {Grade} from "../interfaces/Grade.ts";
import { UserContext } from "../contexts/UserContext.ts";
import { useBouldersPaginated } from "../hooks/useBouldersHooks.ts"
import { motion } from "framer-motion";
import { 
    FiImage, 
    FiEdit3, 
    FiTrash2, 
    FiPlus,
    FiInfo,
    FiCheckCircle,
    FiXCircle,
    FiFilter
} from "react-icons/fi";

const MotionCard = motion.create(Card.Root);
const MotionBox = motion.create(Box);

interface BoulderProps {
    isLoading?: boolean
    placeID: number,
    grades: Grade[],
}

const BOULDERS_PER_PAGE = 12;

function Boulders(props: BoulderProps) {
    const { placeID } = props;
    const { user } = useContext(UserContext);
    
    const [boulderAction, setBoulderAction] = useState<"add" | "edit" | "delete" | null>(null);
    const [selectedBoulder, setSelectedBoulder] = useState<Boulder | null>(null);
    const [imageFullscreen, setImageFullscreen] = useState<boolean>(false);
    const [selectedGrade, setSelectedGrade] = useState<string[]>([]);
    const [filterActive, setFilterActive] = useState<'all' | 'active' | 'retired'>('all');


    const {
        boulders,
        isLoading,
        isFetchingMore,
        hasMore,
        totalCount,
        refetchBoulders,
        observerTarget,

    } = useBouldersPaginated({placeID, limit: BOULDERS_PER_PAGE})

    // Filter boulders based on active status
    const filteredBoulders = boulders.filter(boulder => {
        if (filterActive === 'all') return true;
        if (filterActive === 'active') return boulder.active;
        if (filterActive === 'retired') return !boulder.active;
        return true;
    });

    // Toggle active status
    async function handleToggleActive(boulder: Boulder) {
        try {
            const formData = new FormData();
            formData.set("active", (!boulder.active).toString())
            const response = await fetch(`${apiUrl}/boulders/update/${boulder.id}`, {
                method: "PUT",
                credentials: "include",
                body: formData
            });

            if (response.ok) {
                refetchBoulders();
            }
        } catch (error) {
            console.error('Error toggling boulder active status:', error);
        }
    }

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
            .then(() => {
                setBoulderAction(null);
                refetchBoulders();
            })
            .catch(error => console.error(error))
            .finally(() => {setBoulderAction(null)});
    }

    function handleEditSubmit(event: React.FormEvent){
        event.preventDefault();
        if (!selectedBoulder) { return }

        const formData = new FormData(event.target as HTMLFormElement);
        handleFormDataImage(formData);
        formData.set("placeID", selectedBoulder.placeId.toString());
        formData.set("boulderID", selectedBoulder.id.toString());
        formData.entries().forEach(entry => {
            if(!entry[1]) {
                formData.delete(entry[0]);
            }
        });

        fetch(`${apiUrl}/boulders/update/${selectedBoulder.id}`, {
            method: "PUT",
            credentials: "include",
            body: formData
        })
            .then(_ => {
                refetchBoulders();
            })
            .catch(error => console.error(error))
            .finally(() => {
                setBoulderAction(null);
                setSelectedBoulder(null);
            });
    }

    function handleDeleteClick() {
        if(!selectedBoulder || !user) {
            return;
        }
        const boulderID: number = selectedBoulder.id;

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
                setBoulderAction(null);
                setSelectedBoulder(null);
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

    function handleBoulderActionClick(action: "add" | "edit" | "delete" | null, boulder?: Boulder) {
        setBoulderAction(action);
        if (boulder) {
            setSelectedBoulder(boulder);
        }
    }

    if (isLoading) {
        return (
            <Container maxW="7xl" py={8}>
                <VStack gap={6}>
                    <Skeleton height="60px" width="full" />
                    <SimpleGrid columns={{base: 1, md: 2, lg: 3}} gap={6} width="full">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} height="350px" width="full" borderRadius="md" />
                        ))}
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

    if(boulderAction === "edit" && selectedBoulder) {
        const gradeString = props.grades.find(item => item.id == selectedBoulder.gradeId)?.gradeString || "";
        const editFields = fields.map((field: InputField) => {
            if(field.name === "grade" && props.grades.length > 0) {
                return {...field, required: false, placeholder: gradeString};
            }
            return {...field, required: false, placeholder: selectedBoulder[field.name] || ""};
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
                                            setSelectedBoulder(null);
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

    if(boulders.length === 0 && !isLoading) {
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
                                onClick={() => handleBoulderActionClick("add")}
                            >
                                <FiPlus />
                                Add First Boulder
                            </Button>
                        </VStack>
                    </Card.Body>
                </Card.Root>
            </Container>
        );
    }

    const activeBoulderCount = boulders.filter(b => b.active).length;
    const retiredBoulderCount = totalCount - activeBoulderCount;

    // Main Scrollable Boulder Grid
    return (
        <Container maxW="7xl" py={8}>
            <VStack gap={8} align="stretch">
                {/* Header with Actions */}
                <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                    <Box>
                        <Heading size="2xl" mb={2}>Boulder Problems</Heading>
                        <HStack gap={4}>
                            <Text color="fg.muted">
                                {totalCount} total
                            </Text>
                            <Badge colorPalette="green" size="sm">
                                <FiCheckCircle style={{ display: "inline", marginRight: "4px" }} />
                                {activeBoulderCount} active
                            </Badge>
                            <Badge colorPalette="gray" size="sm">
                                <FiXCircle style={{ display: "inline", marginRight: "4px" }} />
                                {retiredBoulderCount} retired
                            </Badge>
                        </HStack>
                    </Box>
                    <Button
                        colorPalette="brand"
                        size="lg"
                        onClick={() => handleBoulderActionClick("add")}
                    >
                        <FiPlus />
                        Add Boulder
                    </Button>
                </Flex>

                {/* Filter Buttons */}
                <Card.Root>
                    <Card.Body>
                        <Flex align="center" gap={4} wrap="wrap">
                            <HStack>
                                <FiFilter />
                                <Text fontWeight="medium">Filter:</Text>
                            </HStack>
                            <HStack gap={2}>
                                <Button
                                    size="sm"
                                    variant={filterActive === 'all' ? 'solid' : 'outline'}
                                    colorPalette={filterActive === 'all' ? 'brand' : 'gray'}
                                    onClick={() => setFilterActive('all')}
                                >
                                    All ({totalCount})
                                </Button>
                                <Button
                                    size="sm"
                                    variant={filterActive === 'active' ? 'solid' : 'outline'}
                                    colorPalette={filterActive === 'active' ? 'green' : 'gray'}
                                    onClick={() => setFilterActive('active')}
                                >
                                    <FiCheckCircle />
                                    Active ({activeBoulderCount})
                                </Button>
                                <Button
                                    size="sm"
                                    variant={filterActive === 'retired' ? 'solid' : 'outline'}
                                    colorPalette={filterActive === 'retired' ? 'gray' : 'gray'}
                                    onClick={() => setFilterActive('retired')}
                                >
                                    <FiXCircle />
                                    Retired ({retiredBoulderCount})
                                </Button>
                            </HStack>
                        </Flex>
                    </Card.Body>
                </Card.Root>

                {/* Scrollable Grid */}
                <SimpleGrid columns={{base: 1, md: 2, lg: 3}} gap={6}>
                    {filteredBoulders.map((boulder, index) => {
                        const gradeString = props.grades.find(item => item.id == boulder.gradeId)?.gradeString || "";
                        
                        return (
                            <MotionCard
                                key={boulder.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: (index % BOULDERS_PER_PAGE) * 0.05 }}
                                overflow="hidden"
                                _hover={{ boxShadow: "lg", transform: "translateY(-4px)" }}
                                style={{ 
                                    transition: "all 0.2s",
                                    opacity: boulder.active ? 1 : 0.7
                                }}
                                borderWidth={boulder.active ? "2px" : "1px"}
                                borderColor={boulder.active ? "green.500" : "gray.200"}
                            >
                                {/* Image Section */}
                                <Box position="relative">
                                    {boulder.image ? (
                                        <AspectRatio ratio={4/3}>
                                            <ImageTag
                                                src={`${apiUrl}/api/images/${boulder.image}`}
                                                alt={boulder.name}
                                                objectFit="cover"
                                                cursor="pointer"
                                                onClick={() => {
                                                    setSelectedBoulder(boulder);
                                                    setImageFullscreen(true);
                                                }}
                                                style={{
                                                    filter: boulder.active ? 'none' : 'grayscale(50%)'
                                                }}
                                            />
                                        </AspectRatio>
                                    ) : (
                                        <AspectRatio ratio={4/3}>
                                            <Flex
                                                align="center"
                                                justify="center"
                                                bg={boulder.active ? "gray.100" : "gray.50"}
                                            >
                                                <VStack>
                                                    <FiImage size={32} color="gray" />
                                                    <Text color="gray.500" fontSize="sm">No image</Text>
                                                </VStack>
                                            </Flex>
                                        </AspectRatio>
                                    )}
                                    {/* Grade Badge */}
                                    <Badge
                                        position="absolute"
                                        top={3}
                                        right={3}
                                        colorPalette="purple"
                                        size="lg"
                                    >
                                        {gradeString}
                                    </Badge>
                                    {/* Active Status Badge */}
                                    <Badge
                                        position="absolute"
                                        top={3}
                                        left={3}
                                        colorPalette={boulder.active ? "green" : "gray"}
                                        size="sm"
                                    >
                                        {boulder.active ? (
                                            <>
                                                <FiCheckCircle style={{ display: "inline", marginRight: "4px" }} />
                                                On Wall
                                            </>
                                        ) : (
                                            <>
                                                <FiXCircle style={{ display: "inline", marginRight: "4px" }} />
                                                Retired
                                            </>
                                        )}
                                    </Badge>
                                </Box>

                                {/* Content Section */}
                                <Card.Body>
                                    <VStack align="stretch" gap={3}>
                                        <Heading size="lg" color={boulder.active ? "fg" : "fg.muted"}>
                                            {boulder.name}
                                        </Heading>
                                        <Text 
                                            color="fg.muted" 
                                            fontSize="sm"
                                        >
                                            {boulder.description || "No description provided"}
                                        </Text>
                                    </VStack>
                                </Card.Body>

                                {/* Action Buttons */}
                                <Card.Footer>
                                    <VStack width="full" gap={2}>
                                        <HStack width="full" gap={2}>
                                            <Button
                                                flex={1}
                                                colorPalette="blue"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleBoulderActionClick("edit", boulder)}
                                            >
                                                <FiEdit3 />
                                                Edit
                                            </Button>
                                            <Button
                                                flex={1}
                                                colorPalette="red"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedBoulder(boulder);
                                                    handleDeleteClick();
                                                }}
                                            >
                                                <FiTrash2 />
                                                Delete
                                            </Button>
                                        </HStack>
                                        <Button
                                            width="full"
                                            size="sm"
                                            colorPalette={boulder.active ? "gray" : "green"}
                                            variant="outline"
                                            onClick={() => handleToggleActive(boulder)}
                                        >
                                            {boulder.active ? (
                                                <>
                                                    <FiXCircle />
                                                    Mark as Retired
                                                </>
                                            ) : (
                                                <>
                                                    <FiCheckCircle />
                                                    Mark as Active
                                                </>
                                            )}
                                        </Button>
                                    </VStack>
                                </Card.Footer>
                            </MotionCard>
                        );
                    })}
                </SimpleGrid>

                {/* Loading More Indicator & Intersection Observer Target */}
                {hasMore && (
                    <Box ref={observerTarget} py={8}>
                        {isFetchingMore && (
                            <VStack gap={4}>
                                <SimpleGrid columns={{base: 1, md: 2, lg: 3}} gap={6} width="full">
                                    {[...Array(3)].map((_, i) => (
                                        <Skeleton key={i} height="350px" width="full" borderRadius="md" />
                                    ))}
                                </SimpleGrid>
                                <Text color="gray.500" fontSize="sm">Loading more boulders...</Text>
                            </VStack>
                        )}
                    </Box>
                )}

                {/* All Loaded Indicator */}
                {!hasMore && boulders.length > 0 && (
                    <Box py={4}>
                        <Text textAlign="center" color="gray.500" fontSize="sm">
                            All {totalCount} boulders loaded
                        </Text>
                    </Box>
                )}
            </VStack>

            {/* Fullscreen Image Modal */}
            {imageFullscreen && selectedBoulder?.image && (
                <Box
                    position="fixed"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="blackAlpha.900"
                    zIndex={9999}
                    onClick={() => {
                        setImageFullscreen(false);
                        setSelectedBoulder(null);
                    }}
                    cursor="pointer"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    p={8}
                >
                    <ImageTag
                        src={`${apiUrl}/api/images/${selectedBoulder.image}`}
                        alt={selectedBoulder.name}
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