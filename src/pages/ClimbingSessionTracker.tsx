import React, {useContext, useState, useEffect, FormEvent} from "react";
import {
    Box, 
    Button, 
    Heading, 
    HStack, 
    VStack, 
    Text, 
    Card,
    Container,
    Badge,
    SimpleGrid,
    Grid,
    Separator,
    Flex,
    Spinner
} from "@chakra-ui/react";
import Place from "../interfaces/Place.ts";
import SessionContext from "../hooks/useSession.ts"
import {ActiveSession} from "../interfaces/ActiveSession.ts";
import Modal from "../components/Modal.tsx";
import SelectField from "../components/SelectField.tsx";
import {toaster, Toaster} from "../components/ui/toaster.tsx";
import {apiUrl} from "../constants/global.ts";
import Boulder from "../interfaces/Boulder.ts";
import AbstractForm from "../components/AbstractForm.tsx";
import {RouteAttempt} from "../interfaces/RouteAttempt.ts";
import { UserContext } from "../contexts/UserContext.ts"
import { motion } from "framer-motion";
import { 
    FiCalendar, 
    FiPlay, 
    FiPlus,
    FiCheckCircle,
    FiXCircle,
    FiSave,
    FiTrash2,
    FiEdit3,
    FiClock,
    FiMapPin,
    FiTrendingUp,
    FiActivity
} from "react-icons/fi";

const MotionCard = motion.create(Card.Root);
const MotionBox = motion.create(Box);

interface SessionProps{
    places: Place[]
    groupId: number
}

function Sessions({places, groupId}: SessionProps): React.ReactElement {

    const activeSessions = useContext(SessionContext)

    const [newSessionModalOpen, setNewSessionModalOpen] = useState(false)
    const [logClimbModalOpen, setLogClimbModalOpen] = useState(false)
    const [editClimbModalOpen, setEditClimbModalOpen] = useState(false)
    const [closeSessionModalOpen, setCloseSessionModalOpen] = useState(false)
    const [selectFieldPlaceValue, setSelectFieldPlaceValue] = useState<string[]>([])
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
    const [boulders, setBoulders] = useState<Boulder[]>([])
    const [editingAttempt, setEditingAttempt] = useState<RouteAttempt | null>(null)
    const [pastSessions, setPastSessions] = useState<ActiveSession[]>([])
    const [refetchPastSessions, setRefetchPastSessions] = useState(false)
    const [isLoadingPastSessions, setIsLoadingPastSessions] = useState(false)
    const { user } = useContext(UserContext)

    const activeSession = activeSessions
        ? activeSessions.activeSessions.find(s => s.groupId === groupId)
        : null;

    useEffect(() => {
        if(!selectedPlace && !activeSession) {
            return
        }
        const placeId = selectedPlace ? selectedPlace.id : activeSession!.placeId
        fetch(`${apiUrl}/boulders/place?placeID=${placeId}`, {
            credentials: "include",
        })
            .then(response => {
                if(!response.ok) {
                    return response.json().then(json => {throw new Error(json.errorMessage)})
                }
                return response.json()
            })
            .then(data => {setBoulders(data); return data})
            .then(_ => handleRefetchPastSessions())
            .catch(error => {
                toaster.create({
                    title: "Error",
                    type: "error",
                    description: error.message,
                })
            })
    }, [selectedPlace, activeSession])

    useEffect(() => {
        // Placeholder for fetching past sessions when API is ready
        setIsLoadingPastSessions(true)
        
        // Uncomment when API is ready:
        /*
        fetch(`${apiUrl}/api/climbingSessions?groupId=${groupId}`, {
            method: 'GET',
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                if(!response.ok) {
                    return response.json().then(json => {throw new Error(json.errorMessage)})
                }
                return response.json()
            })
            .then(data => setPastSessions(data.data))
            .catch(error => {
                console.error(error)
                toaster.create({
                    title: "Error",
                    type: "error",
                    description: error instanceof Error ? error.message : "Failed to fetch past sessions",
                })
            })
            .finally(() => setIsLoadingPastSessions(false))
        */
        
        // Mock delay for loading state
        setTimeout(() => {
            setIsLoadingPastSessions(false)
        }, 500)
        
    }, [refetchPastSessions, groupId]);

    function handleRefetchPastSessions() {
        setRefetchPastSessions(!refetchPastSessions)
    }

    function handleLogClimbClick() {
        setLogClimbModalOpen(true)
    }

    function startNewSessionClick() {
        if(activeSession) {
            toaster.create({
                title: "Error",
                description: "You already have an active session for this group",
                type: "error"
            })
            return
        }
        setNewSessionModalOpen(true)
    }

    function handleSessionStartClick() {
        if(selectFieldPlaceValue.length < 1) {
            toaster.create({
                title: "Error",
                description: "Please select a place to climb",
                type: "error"
            })
            return
        }
        const placeId = parseInt(selectFieldPlaceValue[0])
        const place = places.filter(place => place.id === placeId)[0]
        if(!place) {
            toaster.create({
                title: "Error",
                description: "Place not found",
                type: "error"
            })
            return
        }
        setSelectedPlace(place)
        const date = new Date()
        const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        activeSessions.addSession({
            id: crypto.randomUUID(), 
            groupId: groupId,  
            startDate: dateString, 
            placeId: placeId, 
            routeAttempts: []
        })
        setNewSessionModalOpen(false)
        setSelectFieldPlaceValue([])
        
        toaster.create({
            title: "Session Started! 🧗",
            description: `Climbing at ${place.name}`,
            type: "success"
        })
    }

    function handleCloseSessionClick() {
        if(!activeSession) {
            toaster.create({
                title: "Error",
                description: "You must start a session before closing it",
                type: "error"
            })
            return
        }
        setCloseSessionModalOpen(true)
    }

    async function handleSaveAndCloseSession() {
        if(!activeSession) {
            return
        }
        try {
            const response = await fetch(`${apiUrl}/api/climbingSessions`, {
                method: 'POST',
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({...activeSession, "name": activeSession.startDate})
            })

            if(!response.ok) {
                const json = await response.json()
                throw new Error(json.errorMessage || "Failed to save session")
            }

            toaster.create({
                title: "Success! 🎉",
                description: "Session saved successfully",
                type: "success"
            })

            setSelectedPlace(null)
            activeSessions.closeSession(activeSession.id)
            setCloseSessionModalOpen(false)
            handleRefetchPastSessions()
        } catch (error) {
            toaster.create({
                title: "Error",
                type: "error",
                description: error instanceof Error ? error.message : "Failed to save session",
            })
        }
    }

    function handleDeleteSession() {
        if(!activeSession) {
            return
        }

        setSelectedPlace(null)
        activeSessions.closeSession(activeSession.id)
        setCloseSessionModalOpen(false)

        toaster.create({
            title: "Session Deleted",
            description: "Session was closed without saving",
            type: "info"
        })
    }

    function saveClimbAttempt(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if(!activeSession) {
            toaster.create({
                title: "Error",
                description: "You must start a session before logging a climb",
                type: "error"
            })
            return
        }
        const formData = new FormData(event.currentTarget)
        const routeId = formData.get("route") as string
        const attempts = formData.get("attempts") as string
        if(!routeId || !attempts) {
            toaster.create({
                title: "Error",
                description: "Please fill in all fields",
                type: "error"
            })
            return
        }
        const completed = formData.get("completed") == "on"
        activeSessions.addRouteAttempt({
            id: crypto.randomUUID(), 
            routeId: parseInt(routeId), 
            attempts: parseInt(attempts), 
            completed: completed
        }, groupId)

        setLogClimbModalOpen(false)
        
        toaster.create({
            title: completed ? "Send! 🎯" : "Attempt Logged",
            description: completed ? "Great job crushing that route!" : "Keep pushing!",
            type: "success"
        })
    }

    function handleEditAttemptClick(attempt: RouteAttempt) {
        setEditingAttempt(attempt)
        setEditClimbModalOpen(true)
    }

    function saveEditedClimbAttempt(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if(!editingAttempt || !activeSession) {
            toaster.create({
                title: "Error",
                description: "Invalid attempt data",
                type: "error"
            })
            return
        }
        const formData = new FormData(event.currentTarget)
        const attempts = formData.get("attempts") as string
        if(!attempts) {
            toaster.create({
                title: "Error",
                description: "Please fill in all fields",
                type: "error"
            })
            return
        }
        const completed = formData.get("completed") == "on"

        const updatedAttempts = activeSession.routeAttempts.map(attempt =>
            attempt.id === editingAttempt.id
                ? {...attempt, attempts: parseInt(attempts), completed: completed}
                : attempt
        )

        activeSessions.updateSession({
            ...activeSession,
            routeAttempts: updatedAttempts
        })

        setEditClimbModalOpen(false)
        setEditingAttempt(null)

        toaster.create({
            title: "Success",
            description: "Climb attempt updated",
            type: "success"
        })
    }

    function handleRemoveAttemptClick(attemptId: string) {
        if(!activeSession) {
            toaster.create({
                title: "Error",
                description: "No active session",
                type: "error"
            })
            return
        }

        const updatedAttempts = activeSession.routeAttempts.filter(attempt => attempt.id !== attemptId)

        activeSessions.updateSession({
            ...activeSession,
            routeAttempts: updatedAttempts
        })

        toaster.create({
            title: "Success",
            description: "Climb attempt removed",
            type: "success"
        })
    }

    const placeFields = places.map((place: Place) => {
        return({label: place.name, value: place.id.toString()})
    })
    
    const routeFields = boulders.map((boulder) => {
        return({
            label: `${boulder.name}`, 
            value: boulder.id.toString(), 
            description: boulder.description || "No description"
        })
    })
    
    const formFields = [
        {label: "Route", name: "route", type: "select", options: routeFields, placeholder: "Select a route"},
        {label: "Attempts", name: "attempts", type: "number", placeholder: "Enter attempts"},
        {label: "Completed", name: "completed", type: "checkbox"},
    ]

    const editFormFields = editingAttempt ? [
        {
            label: "Attempts", 
            name: "attempts", 
            type: "number", 
            placeholder: "Enter Attempts", 
            defaultValue: editingAttempt.attempts.toString()
        },
        {label: "Completed", name: "completed", type: "checkbox", defaultValue: editingAttempt.completed},
    ] : []

    // Animation variants
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 }
        }
    };

    const currentPlace = activeSession 
        ? places.find(place => place.id === activeSession.placeId)
        : null;

    return(
        <Container maxW="7xl" py={8}>
            <VStack align="stretch" gap={8}>
                {/* Header Section */}
                <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                    <Box>
                        <Heading size="2xl" mb={2}>
                            <FiCalendar style={{ display: "inline", marginRight: "12px" }} />
                            Climbing Sessions
                        </Heading>
                        <Text color="fg.muted" fontSize="lg">
                            Track your climbing progress and performance
                        </Text>
                    </Box>
                    {!activeSession ? (
                        <Button
                            size="lg"
                            colorPalette="brand"
                            leftIcon={<FiPlay />}
                            onClick={startNewSessionClick}
                            _hover={{
                                transform: "translateY(-2px)",
                                boxShadow: "lg"
                            }}
                            transition="all 0.2s"
                        >
                            Start New Session
                        </Button>
                    ) : (
                        <HStack gap={3}>
                            <Button
                                size="lg"
                                colorPalette="green"
                                leftIcon={<FiSave />}
                                onClick={() => handleCloseSessionClick()}
                            >
                                Save & Close
                            </Button>
                        </HStack>
                    )}
                </Flex>

                {/* Active Session Status Card */}
                <MotionCard
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    bg={activeSession ? "green.50" : "red.50"}
                    borderWidth="2px"
                    borderColor={activeSession ? "green.500" : "red.300"}
                >
                    <Card.Body py={6}>
                        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                            <HStack gap={4}>
                                <Box
                                    p={3}
                                    bg={activeSession ? "green.500" : "red.400"}
                                    borderRadius="full"
                                    color="white"
                                >
                                    {activeSession ? <FiActivity size={24} /> : <FiXCircle size={24} />}
                                </Box>
                                <Box>
                                    <Heading size="md" color="gray.800">
                                        {activeSession ? "Active Session" : "No Active Session"}
                                    </Heading>
                                    {activeSession && currentPlace && (
                                        <HStack mt={1} color="gray.700">
                                            <FiMapPin />
                                            <Text fontWeight="medium">{currentPlace.name}</Text>
                                            <Text>•</Text>
                                            <FiClock />
                                            <Text>{activeSession.startDate}</Text>
                                        </HStack>
                                    )}
                                    {!activeSession && (
                                        <Text color="gray.600" fontSize="sm" mt={1}>
                                            Start a session to begin tracking your climbs
                                        </Text>
                                    )}
                                </Box>
                            </HStack>
                            {activeSession && (
                                <HStack gap={2}>
                                    <Badge colorPalette="green" size="lg">
                                        {activeSession.routeAttempts.length} {activeSession.routeAttempts.length === 1 ? 'climb' : 'climbs'}
                                    </Badge>
                                    <Badge colorPalette="blue" size="lg">
                                        {activeSession.routeAttempts.filter(a => a.completed).length} sent
                                    </Badge>
                                </HStack>
                            )}
                        </Flex>
                    </Card.Body>
                </MotionCard>

                {/* Active Session Details */}
                {activeSession && (
                    <MotionCard
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <Card.Header>
                            <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                                <Heading size="lg">Session Details</Heading>
                                <Button
                                    colorPalette="brand"
                                    leftIcon={<FiPlus />}
                                    onClick={handleLogClimbClick}
                                >
                                    Log Climb
                                </Button>
                            </Flex>
                        </Card.Header>
                        <Card.Body>
                            {activeSession.routeAttempts.length > 0 ? (
                                <VStack gap={4} align="stretch">
                                    {activeSession.routeAttempts.map((attempt: RouteAttempt, index) => {
                                        const boulder = boulders.find(boulder => boulder.id === attempt.routeId);
                                        const place = boulder ? places.find(p => p.id === boulder.place) : null;
                                        const gradeString = boulder && place
                                            ? place.gradingSystem.grades.find(g => g.id === boulder.grade)?.gradeString
                                            : "N/A";

                                        return(
                                            <Card.Root
                                                key={index}
                                                bg="gray.50"
                                                borderWidth="1px"
                                                borderColor={attempt.completed ? "green.200" : "orange.200"}
                                            >
                                                <Card.Body>
                                                    <Grid templateColumns={{ base: "1fr", md: "2fr 1fr auto" }} gap={4} alignItems="center">
                                                        <Box>
                                                            <HStack mb={2}>
                                                                <Heading size="md" color="gray.800">
                                                                    {boulder ? boulder.name : `Route #${attempt.routeId}`}
                                                                </Heading>
                                                                <Badge 
                                                                    colorPalette={attempt.completed ? "green" : "orange"}
                                                                    size="sm"
                                                                >
                                                                    {attempt.completed ? (
                                                                        <><FiCheckCircle style={{ display: "inline", marginRight: "4px" }} />Sent</>
                                                                    ) : "In Progress"}
                                                                </Badge>
                                                            </HStack>
                                                            {boulder?.description && (
                                                                <Text color="gray.600" fontSize="sm" mb={2}>
                                                                    {boulder.description}
                                                                </Text>
                                                            )}
                                                            <HStack gap={4} fontSize="sm" color="gray.700">
                                                                <Text fontWeight="medium">
                                                                    Grade: <Badge colorPalette="purple">{gradeString}</Badge>
                                                                </Text>
                                                                <Text fontWeight="medium">
                                                                    Attempts: <Badge>{attempt.attempts}</Badge>
                                                                </Text>
                                                            </HStack>
                                                        </Box>
                                                        <Box />
                                                        <HStack gap={2}>
                                                            <Button
                                                                colorPalette="blue"
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleEditAttemptClick(attempt)}
                                                            >
                                                                <FiEdit3 />
                                                            </Button>
                                                            <Button
                                                                colorPalette="red"
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleRemoveAttemptClick(attempt.id)}
                                                            >
                                                                <FiTrash2 />
                                                            </Button>
                                                        </HStack>
                                                    </Grid>
                                                </Card.Body>
                                            </Card.Root>
                                        )
                                    })}
                                </VStack>
                            ) : (
                                <Box textAlign="center" py={8}>
                                    <Text color="gray.500" fontSize="lg" mb={4}>
                                        No climbs logged yet
                                    </Text>
                                    <Button
                                        colorPalette="brand"
                                        leftIcon={<FiPlus />}
                                        onClick={handleLogClimbClick}
                                    >
                                        Log Your First Climb
                                    </Button>
                                </Box>
                            )}
                        </Card.Body>
                    </MotionCard>
                )}

                <Separator />

                {/* Past Sessions Section */}
                <Box>
                    <Flex justify="space-between" align="center" mb={6}>
                        <Box>
                            <Heading size="xl" mb={1}>Past Sessions</Heading>
                            <Text color="fg.muted">
                                Review your climbing history
                            </Text>
                        </Box>
                        <Button
                            variant="outline"
                            colorPalette="gray"
                            onClick={handleRefetchPastSessions}
                            leftIcon={<FiTrendingUp />}
                        >
                            Refresh
                        </Button>
                    </Flex>

                    {isLoadingPastSessions ? (
                        <Card.Root>
                            <Card.Body py={12}>
                                <VStack gap={4}>
                                    <Spinner size="xl" colorPalette="brand" />
                                    <Text color="fg.muted">Loading past sessions...</Text>
                                </VStack>
                            </Card.Body>
                        </Card.Root>
                    ) : pastSessions && pastSessions.length > 0 ? (
                        <VStack align="stretch" gap={4}>
                            {pastSessions.map((session: ActiveSession, index: number) => {
                                const sessionPlace = places.find(place => place.id === session.placeId);
                                return(
                                    <MotionCard
                                        key={index}
                                        variants={cardVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        <Card.Header>
                                            <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                                                <HStack>
                                                    <Box
                                                        p={2}
                                                        bg="brand.500"
                                                        borderRadius="md"
                                                        color="white"
                                                    >
                                                        <FiMapPin size={20} />
                                                    </Box>
                                                    <Box>
                                                        <Heading size="md">
                                                            {sessionPlace?.name || "Unknown Place"}
                                                        </Heading>
                                                        <Text fontSize="sm" color="fg.muted">
                                                            {session.startDate.split(" ")[0]}
                                                        </Text>
                                                    </Box>
                                                </HStack>
                                                <HStack>
                                                    <Badge colorPalette="blue">
                                                        {session.routeAttempts?.length || 0} climbs
                                                    </Badge>
                                                    <Badge colorPalette="green">
                                                        {session.routeAttempts?.filter(a => a.completed).length || 0} sent
                                                    </Badge>
                                                </HStack>
                                            </Flex>
                                        </Card.Header>
                                        <Card.Body>
                                            {session.routeAttempts && session.routeAttempts.length > 0 ? (
                                                <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                                                    {session.routeAttempts.map((attempt: RouteAttempt, idx: number) => {
                                                        const boulder = boulders.find(b => b.id === attempt.routeId);
                                                        return(
                                                            <Box
                                                                key={idx}
                                                                p={3}
                                                                bg="gray.50"
                                                                borderRadius="md"
                                                                borderWidth="1px"
                                                                borderColor={attempt.completed ? "green.200" : "gray.200"}
                                                            >
                                                                <HStack justify="space-between" mb={1}>
                                                                    <Text fontWeight="bold" fontSize="sm">
                                                                        {boulder?.name || `Route #${attempt.routeId}`}
                                                                    </Text>
                                                                    {attempt.completed && (
                                                                        <FiCheckCircle color="green" />
                                                                    )}
                                                                </HStack>
                                                                <Text fontSize="xs" color="gray.600">
                                                                    Attempts: {attempt.attempts}
                                                                </Text>
                                                            </Box>
                                                        )
                                                    })}
                                                </SimpleGrid>
                                            ) : (
                                                <Text color="gray.500" fontSize="sm">No climbs recorded</Text>
                                            )}
                                        </Card.Body>
                                    </MotionCard>
                                )
                            })}
                        </VStack>
                    ) : (
                        <Card.Root bg="gray.50" borderWidth="1px" borderColor="gray.200">
                            <Card.Body py={12}>
                                <VStack gap={4} textAlign="center">
                                    <Box color="gray.400" fontSize="5xl">
                                        <FiCalendar size={64} />
                                    </Box>
                                    <Heading size="lg" color="gray.700">No Past Sessions Yet</Heading>
                                    <Text color="fg.muted" maxW="md">
                                        Your completed climbing sessions will appear here once you save them.
                                    </Text>
                                    {!activeSession && (
                                        <Button
                                            colorPalette="brand"
                                            leftIcon={<FiPlay />}
                                            onClick={startNewSessionClick}
                                            mt={2}
                                        >
                                            Start Your First Session
                                        </Button>
                                    )}
                                </VStack>
                            </Card.Body>
                        </Card.Root>
                    )}
                </Box>
            </VStack>

            {/* Start New Session Modal */}
            <Modal isOpen={newSessionModalOpen} title="Start New Climbing Session" size="md">
                <Modal.Body>
                    <VStack align="stretch" gap={4}>
                        <Text color="fg.muted">
                            Choose where you'll be climbing today
                        </Text>
                        <SelectField
                            zIndex={9999}
                            value={selectFieldPlaceValue}
                            setValue={setSelectFieldPlaceValue}
                            fields={placeFields}
                            placeholder="Select a climbing place"
                        />
                    </VStack>
                </Modal.Body>
                <Modal.Footer>
                    <HStack gap={3}>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setNewSessionModalOpen(false); 
                                setSelectFieldPlaceValue([])
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            colorPalette="brand"
                            onClick={handleSessionStartClick}
                            leftIcon={<FiPlay />}
                        >
                            Start Session
                        </Button>
                    </HStack>
                </Modal.Footer>
            </Modal>

            {/* Log Climb Modal */}
            <Modal isOpen={logClimbModalOpen} title="Log Climb Attempt" size="md">
                <Modal.Body>
                    <AbstractForm
                        fields={formFields}
                        handleSubmit={saveClimbAttempt}
                        footer={
                            <HStack justify="flex-end" gap={3} pt={4}>
                                <Button
                                    variant="outline"
                                    onClick={() => setLogClimbModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    colorPalette="brand"
                                >
                                    Save Climb
                                </Button>
                            </HStack>
                        }
                    />
                </Modal.Body>
            </Modal>

            {/* Edit Climb Modal */}
            <Modal isOpen={editClimbModalOpen} title="Edit Climb Attempt" size="md">
                <Modal.Body>
                    {editingAttempt && (
                        <>
                            <Text color="black" fontWeight="bold" mb={4}>
                                {boulders.find(boulder => boulder.id === editingAttempt.routeId)?.name || `Route #${editingAttempt.routeId}`}
                            </Text>
                            <AbstractForm
                                fields={editFormFields}
                                handleSubmit={saveEditedClimbAttempt}
                                footer={
                                    <HStack justify="flex-end" gap={3} pt={4}>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setEditClimbModalOpen(false)
                                                setEditingAttempt(null)
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            colorPalette="brand"
                                        >
                                            Save Changes
                                        </Button>
                                    </HStack>
                                }
                            />
                        </>
                    )}
                </Modal.Body>
            </Modal>

            {/* Close Session Modal */}
            <Modal isOpen={closeSessionModalOpen} title="Close Climbing Session" size="md">
                <Modal.Body>
                    <VStack align="stretch" gap={4}>
                        <Box p={4} bg="blue.50" borderRadius="md">
                            <Text color="gray.800" fontWeight="medium" mb={2}>
                                Session Summary
                            </Text>
                            {activeSession && (
                                <VStack align="stretch" gap={2} fontSize="sm">
                                    <HStack justify="space-between">
                                        <Text color="gray.600">Total Climbs:</Text>
                                        <Badge>{activeSession.routeAttempts.length}</Badge>
                                    </HStack>
                                    <HStack justify="space-between">
                                        <Text color="gray.600">Completed:</Text>
                                        <Badge colorPalette="green">
                                            {activeSession.routeAttempts.filter(a => a.completed).length}
                                        </Badge>
                                    </HStack>
                                </VStack>
                            )}
                        </Box>
                        <Text color="gray.600" fontSize="sm">
                            Would you like to save this session? Saving will store your progress to review later.
                        </Text>
                    </VStack>
                </Modal.Body>
                <Modal.Footer>
                    <HStack gap={3}>
                        <Button
                            variant="outline"
                            onClick={() => setCloseSessionModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            colorPalette="red"
                            variant="outline"
                            onClick={handleDeleteSession}
                            leftIcon={<FiTrash2 />}
                        >
                            Delete
                        </Button>
                        <Button
                            colorPalette="green"
                            onClick={handleSaveAndCloseSession}
                            leftIcon={<FiSave />}
                        >
                            Save Session
                        </Button>
                    </HStack>
                </Modal.Footer>
            </Modal>

            <Toaster/>
        </Container>
    )
}

export default Sessions;
