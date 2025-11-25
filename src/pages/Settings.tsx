import React, {useState, useEffect, useContext} from 'react';

import {apiUrl} from "../constants/global.ts";
import GradeSystem from "../interfaces/GradeSystem.ts";
import Modal from "../components/Modal.tsx";
import AbstractForm from "../components/AbstractForm.tsx";
import ManageUsers from "../components/ManageUsers.tsx";
import ManageGradingSystems from "../components/ManageGradingSystems.tsx";
import {
    Box, 
    Button, 
    Heading, 
    Separator,
    Card,
    VStack,
    HStack,
    Text,
    Grid,
    Badge,
    Container
} from "@chakra-ui/react";
import SelectField from "../components/SelectField";
import { toaster, Toaster} from "../components/ui/toaster.tsx";
import {usePlaceHooks} from "../hooks/usePlaceHooks.tsx";
import { motion } from "framer-motion";
import { 
    FiUsers, 
    FiSettings as FiSettingsIcon, 
    FiMapPin,
    FiStar,
    FiPlus 
} from "react-icons/fi";

const MotionCard = motion.create(Card.Root);


interface SettingsProps {
    groupID: number
}

export default function Settings(props: SettingsProps) {

    const { groupID } = props;
    const [selectedPlace, setSelectedPlace] = useState<string[]>([]);
    const [ gradingSystems, setGradingSystems ] = useState<Array<GradeSystem>>([]);
    const [ selectedGradingSystem, setSelectedGradingSystem ] = useState<string[]>([]);
    const [ modalIsOpen, setModalIsOpen ] = useState<boolean>(false);
    const [ modalMangeUsersModalIsOpen, setMangeUsersModalIsOpen ] = useState<boolean>(false);
    const [ refetchGradingSystems, setRefetchGradingSystems ] = useState<boolean>(false);
    const disable = !(selectedPlace && selectedPlace.length > 0);
    const { places } = usePlaceHooks({groupId: groupID, autoload: true})


    useEffect(() => {
        if(!selectedPlace || selectedPlace.length < 1) {
            return;
        }
        const selectPlaceObject = places.filter(place => place.id === parseInt(selectedPlace[0]))[0];
        if(!selectPlaceObject) {
            return;
        }
        setSelectedGradingSystem([selectPlaceObject.gradingSystem.id?.toString() || ""]);
    }, [selectedPlace]);

    function refetchGradingSystemsHandler() {
        setRefetchGradingSystems((prev: boolean) => !prev);
    }

    useEffect(() => {
        if(!groupID) {
            return;
        }
        fetch(`${apiUrl}/api/groups/grading?groupId=${groupID}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(response => response.json())
            .then(data => setGradingSystems(data));
    }, [groupID, refetchGradingSystems]);

    const gradingSystemFields = gradingSystems.map(system => ({
        label: system.name,
        value: system.id.toString()
    }));

    const placeFields = places.map(place => {
        return {
            label: place.name,
            value: place.id.toString()
        }
    });

    function handleSubmit(event) {
        event.preventDefault();
        if(!selectedPlace || selectedPlace.length < 1) {
            toaster.create({
                title: "No place selected",
                description: "Please select a place to edit",
                type: "error"
            });
            return;
        }
        const selectPlaceObject = places.filter(place => place.id === parseInt(selectedPlace[0]))[0];
        const formData = new FormData();
        formData.append("placeId", selectedPlace[0]);
        
        const gradingSystemValue = event.target.gradingSystem?.value;
        if (gradingSystemValue) {
            const parsedId = parseInt(gradingSystemValue);
            if (!isNaN(parsedId) && selectPlaceObject.gradingSystem.id !== parsedId) {
                formData.append("gradingSystemId", gradingSystemValue);
            }
        }

        if(event.target.description.value) {
            formData.append("description", event.target.description.value);
        }
        if(event.target.name.value) {
            formData.append("name", event.target.name.value);
        }

        let hasExtraFields = false;
        for (const [key] of formData.entries()) {
            if (key !== "placeId") {
                hasExtraFields = true;
                break;
            }
        }

        if (!hasExtraFields) {
            toaster.create({
                title: "No changes detected",
                description: "Please modify at least one field before submitting.",
                type: "error"
            });
            return;
        }

        fetch(`${apiUrl}/api/places`, {
            method: "PUT",
            credentials: "include",
            body: formData
        })
            .then(response => {
                if(!response.ok) {
                    return response.json().then(json => {throw new Error(json.errorMessage)});
                }
                return response.json();
            })
            .then(() => toaster.create({title: "Success", description: "Place updated successfully", type: "success"}))
            .then(() => {setSelectedPlace([])})
            .catch(error => { toaster.create({title: "Error occurred", description: error.message, type: "error"})});
    }

    const addPlaceFields = [
        {"label": "Place Name", "type": "string", "name": "name"},
        {"label": "Description", "type": "string", "name": "description"},
        {"label": "Grading System", "type": "select", "name": "gradingSystem", "options": gradingSystemFields, "placeholder": "Select a grading system", "value": selectedGradingSystem, "setter": setSelectedGradingSystem, "disabled": disable},
    ];

    function formFooter(): React.ReactNode {
        return(
            <VStack gap={3} pt={4}>
                <Button
                    size="sm"
                    width="full"
                    variant="outline"
                    colorPalette="purple"
                    onClick={() => setModalIsOpen(true)}
                    disabled={disable}
                >
                    <FiPlus />
                    Add Grading System
                </Button>
                <HStack width="full" gap={3}>
                    <Button
                        colorPalette="brand"
                        type="submit"
                        flex={1}
                    >
                        Save Changes
                    </Button>
                    <Button
                        onClick={() => setSelectedPlace([])}
                        variant="outline"
                        flex={1}
                    >
                        Cancel
                    </Button>
                </HStack>
            </VStack>
        );
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

    return(
        <Container maxW="7xl" py={8}>
            <VStack align="stretch" gap={8}>
                {/* Header */}
                <Box>
                    <Heading size="2xl" mb={2}>
                        <FiSettingsIcon style={{ display: "inline", marginRight: "12px" }} />
                        Group Settings
                    </Heading>
                    <Text color="fg.muted" fontSize="lg">
                        Manage members, places, and grading systems
                    </Text>
                </Box>

                {/* Group Management Section */}
                <MotionCard
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Card.Header>
                        <HStack>
                            <FiUsers size={24} color="var(--chakra-colors-brand-500)" />
                            <Heading size="lg">Group Management</Heading>
                        </HStack>
                    </Card.Header>
                    <Card.Body>
                        <VStack align="stretch" gap={4}>
                            <Text color="fg.muted">
                                Control who has access to your climbing group and manage member permissions
                            </Text>
                            <Button
                                colorPalette="brand"
                                size="lg"
                                onClick={() => setMangeUsersModalIsOpen(true)}
                                alignSelf="flex-start"
                            >
                                <FiUsers />
                                Manage Members
                            </Button>
                        </VStack>
                    </Card.Body>
                </MotionCard>

                <Separator />

                {/* Place Settings Section */}
                <MotionCard
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Card.Header>
                        <HStack>
                            <FiMapPin size={24} color="var(--chakra-colors-green-500)" />
                            <Heading size="lg">Place Settings</Heading>
                        </HStack>
                    </Card.Header>
                    <Card.Body>
                        <VStack align="stretch" gap={6}>
                            <Text color="fg.muted">
                                Edit details and grading systems for your climbing locations
                            </Text>

                            {/* Place Stats */}
                            <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
                                <Card.Root bg="blue.50" borderColor="blue.200" borderWidth="1px">
                                    <Card.Body>
                                        <VStack align="start">
                                            <Badge colorPalette="blue" size="sm">Total Places</Badge>
                                            <Heading size="2xl">{places.length}</Heading>
                                        </VStack>
                                    </Card.Body>
                                </Card.Root>
                                <Card.Root bg="purple.50" borderColor="purple.200" borderWidth="1px">
                                    <Card.Body>
                                        <VStack align="start">
                                            <Badge colorPalette="purple" size="sm">Grading Systems</Badge>
                                            <Heading size="2xl">{gradingSystems.length}</Heading>
                                        </VStack>
                                    </Card.Body>
                                </Card.Root>
                            </Grid>

                            <Separator />

                            {/* Place Selection and Edit Form */}
                            <Box>
                                <Text fontWeight="bold" mb={3}>Select a place to edit:</Text>
                                <SelectField
                                    fields={placeFields}
                                    setValue={setSelectedPlace}
                                    value={selectedPlace}
                                    placeholder="Select a place to edit"
                                    width={"full"}
                                />
                            </Box>

                            {selectedPlace && selectedPlace.length > 0 && (
                                <MotionCard
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    bg="gray.50"
                                    borderWidth="1px"
                                    borderColor="gray.200"
                                >
                                    <Card.Header>
                                        <Heading size="md">Edit Place Details</Heading>
                                    </Card.Header>
                                    <Card.Body>
                                        <AbstractForm 
                                            fields={addPlaceFields} 
                                            handleSubmit={handleSubmit} 
                                            footer={formFooter()} 
                                            width={"full"}
                                        />
                                    </Card.Body>
                                </MotionCard>
                            )}
                        </VStack>
                    </Card.Body>
                </MotionCard>

                {/* Grading Systems Info */}
                <MotionCard
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    bg="purple.50"
                    borderWidth="1px"
                    borderColor="purple.200"
                >
                    <Card.Body>
                        <HStack justify="space-between" wrap="wrap" gap={4}>
                            <VStack align="start">
                                <HStack>
                                    <FiStar color="var(--chakra-colors-purple-500)" />
                                    <Heading size="md">Available Grading Systems</Heading>
                                </HStack>
                                <Text fontSize="sm" color="fg.muted">
                                    {gradingSystems.length} grading {gradingSystems.length === 1 ? 'system' : 'systems'} configured for this group
                                </Text>
                            </VStack>
                            <Button
                                colorPalette="purple"
                                variant="outline"
                                onClick={() => setModalIsOpen(true)}
                            >
                                <FiPlus />
                                Add Grading System
                            </Button>
                        </HStack>
                    </Card.Body>
                </MotionCard>
            </VStack>

            {/* Manage Grading Systems Modal */}
            {modalIsOpen && (
                <Modal isOpen={modalIsOpen} title="Manage Grading Systems" size="xl">
                    <Modal.Body>
                        <ManageGradingSystems 
                            gradingSystems={gradingSystems} 
                            groupID={groupID} 
                            refetch={refetchGradingSystemsHandler} 
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button 
                            onClick={() => setModalIsOpen(false)}
                            colorPalette="gray"
                        >
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

            {/* Manage Users Modal */}
            {modalMangeUsersModalIsOpen && (
                <Modal isOpen={modalMangeUsersModalIsOpen} title="Manage Group Members" size="xl">
                    <Modal.Body>
                        <ManageUsers groupID={groupID}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button 
                            onClick={() => setMangeUsersModalIsOpen(false)}
                            colorPalette="gray"
                        >
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

            <Toaster/>
        </Container>
    );
}