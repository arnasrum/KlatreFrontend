import React, { useState, useEffect, useContext } from 'react';
import type Place from "../interfaces/Place.ts";
import Boulders from "./Boulders.tsx";
import AbstractForm from "../components/AbstractForm.tsx";
import type InputField from "../interfaces/InputField.ts";
import type {BoulderData} from "../interfaces/BoulderData.ts";
import {apiUrl} from "../constants/global.ts";
import {
    Box, 
    Container, 
    Spinner, 
    VStack, 
    HStack,
    Card,
    Heading,
    Text,
    Button,
    Grid,
    Flex
} from "@chakra-ui/react";
import Modal from "../components/Modal.tsx";
import { UserContext } from "../contexts/UserContext.ts";
import { motion } from "framer-motion";
import { 
    FiMapPin, 
    FiPlus, 
    FiMap,
    FiChevronRight,
    FiAlertCircle 
} from "react-icons/fi";
import {usePlaceHooks} from "../hooks/usePlaceHooks";

const MotionCard = motion.create(Card.Root);
const MotionBox = motion.create(Box);

interface PlacesProps {
    groupID?: number | null
}

function Places({groupID}: PlacesProps) {

    const [selectedPlace, setSelectedPlace] = useState<number | null>(null);
    const [showPlaceModal, setShowPlaceModal] = useState<boolean>(false);
    const { places, refetchPlaces } = usePlaceHooks({groupId: groupID})

    useEffect(() => {
        setShowPlaceModal(false);
        setSelectedPlace(null);
    }, [groupID]);

    let grades = null;
    if(selectedPlace) {
        grades = places.find(place => place.id == selectedPlace)?.gradingSystem.grades;
    }

    const addPlaceFields: Array<InputField> = [
        {"label": "Place Name", "type": "string", "name": "name"},
        {"label": "Description", "type": "string", "name": "description"},
    ];

    function handleAddPlaceSubmit(event: React.FormEvent<never>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        formData.set("groupID", groupID.toString());
        fetch(`${apiUrl}/api/groups/place`, {
            method: "POST",
            credentials: "include",
            body: formData
        })
            .then(() => refetchPlaces())
            .then(() => setShowPlaceModal(false))
            .catch(error => console.error(error));
    }

    function handlePlaceClick(placeId: number) {
        setSelectedPlace(placeId);
    }

    function handleBackToPlaces() {
        setSelectedPlace(null);
    }

    // Animation variants
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4
            }
        }
    };

    // If viewing a specific place's boulders
    if(selectedPlace && grades) {
        return (
            <Box>
                <Button
                    ml={10}
                    mb={6}
                    variant="solid"
                    colorPalette="brand"
                    onClick={handleBackToPlaces}
                >
                    <FiChevronRight style={{ transform: "rotate(180deg)" }} />
                    Back to Places
                </Button>
                <Boulders 
                    placeID={selectedPlace} 
                    grades={grades}
                />
            </Box>
        );
    }

    // Loading State
    if(!places) {
        return(
            <Container maxW="7xl" py={8}>
                <VStack gap={6} align="stretch">
                    <Flex justify="space-between" align="center">
                        <Spinner size="xl" colorPalette="brand" />
                        <Text color="fg.muted">Loading places...</Text>
                    </Flex>
                </VStack>
            </Container>
        );
    }

    // Empty State
    if(places.length === 0) {
        return(
            <Container maxW="4xl" py={8}>
                <Card.Root>
                    <Card.Body p={12}>
                        <VStack gap={6} textAlign="center">
                            <Box color="brand.500" fontSize="5xl">
                                <FiMap size={64} />
                            </Box>
                            <Heading size="2xl">No Climbing Places Yet</Heading>
                            <Text fontSize="lg" color="fg.muted" maxW="md">
                                Add your first climbing location to start tracking boulders and routes!
                            </Text>
                            <Button
                                colorPalette="brand"
                                size="lg"
                                onClick={() => setShowPlaceModal(true)}
                            >
                                <FiPlus />
                                Add First Place
                            </Button>
                        </VStack>
                    </Card.Body>
                </Card.Root>
            </Container>
        );
    }

    // Main Places Grid View
    return (
        <Box>
            <Flex justify="space-between" align="center" mb={6}>
                <Box>
                    <Heading size="xl" mb={1}>Climbing Places</Heading>
                    <Text color="fg.muted">
                        {places.length} {places.length === 1 ? 'location' : 'locations'} available
                    </Text>
                </Box>
                <Button
                    colorPalette="brand"
                    size="lg"
                    onClick={() => setShowPlaceModal(true)}
                    _hover={{
                        transform: "translateY(-2px)",
                        boxShadow: "lg"
                    }}
                    transition="all 0.2s"
                >
                    <FiPlus />
                    Add Place
                </Button>
            </Flex>

            <Grid
                templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                gap={6}
            >
                {places.map((place: Place, index: number) => (
                    <MotionCard
                        key={place.id}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{
                            y: -8,
                            transition: { duration: 0.2 }
                        }}
                        cursor="pointer"
                        onClick={() => handlePlaceClick(place.id)}
                        bg="white"
                        borderWidth="1px"
                        borderColor="gray.200"
                        overflow="hidden"
                        _hover={{
                            borderColor: "brand.500",
                            boxShadow: "xl",
                            transition: "all 0.3s"
                        }}
                    >
                        {/* Card Header with Gradient */}
                        <Box
                            h="100px"
                            bg="gradient-to-br"
                            bgGradient={`linear(to-br, brand.${400 + (index % 3) * 100}, brand.${600 + (index % 3) * 100})`}
                            position="relative"
                        >
                            <Box
                                position="absolute"
                                top={0}
                                left={0}
                                right={0}
                                bottom={0}
                                opacity={0.2}
                                bgImage="radial-gradient(circle, white 1px, transparent 1px)"
                                bgSize="20px 20px"
                            />
                            <Box
                                position="absolute"
                                bottom={4}
                                left={4}
                                color="white"
                                fontSize="3xl"
                            >
                                <FiMapPin />
                            </Box>
                        </Box>

                        <Card.Body pt={4} pb={6} px={6}>
                            <VStack align="stretch" gap={3}>
                                {/* Place Name */}
                                <Heading size="lg" color="gray.800">
                                    {place.name}
                                </Heading>

                                {/* Description */}
                                <Text
                                    color="fg.muted"
                                    fontSize="sm"
                                    minH="40px"
                                >
                                    {place.description || "No description provided"}
                                </Text>

                                {/* Grading System Badge */}
                                <HStack justify="flex-end" pt={2}>
                                    <Button
                                        variant="outline"
                                        color="fg.muted"
                                    >
                                        Enter Place
                                        <FiChevronRight color="var(--chakra-colors-brand-500)" />
                                    </Button>
                                </HStack>
                            </VStack>
                        </Card.Body>
                    </MotionCard>
                ))}
            </Grid>

            {/* Add Place Modal */}
            {showPlaceModal && (
                <Modal isOpen={showPlaceModal} title="Add New Place" size="lg">
                    <Modal.Body>
                        <AbstractForm 
                            fields={addPlaceFields} 
                            handleSubmit={handleAddPlaceSubmit} 
                            footer={
                                <HStack justify="flex-end" pt={4} gap={3}>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowPlaceModal(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        colorPalette="brand"
                                    >
                                        Add Place
                                    </Button>
                                </HStack>
                            }
                        />
                    </Modal.Body>
                </Modal>
            )}
        </Box>
    );
}

export default Places;