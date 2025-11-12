import React, {FormEvent, useEffect, useState} from "react";
import {
    Badge,
    Box,
    Button,
    Card,
    Container,
    Flex,
    Grid,
    Heading,
    HStack,
    Separator,
    SimpleGrid,
    Spinner,
    Text,
    VStack
} from "@chakra-ui/react";
import Place from "../interfaces/Place.ts";
import useSession from "../hooks/useSession.tsx"
import {PastSession} from "../interfaces/ClimbingSession.ts";
import Modal from "../components/Modal.tsx";
import SelectField from "../components/SelectField.tsx";
import {toaster, Toaster} from "../components/ui/toaster.tsx";
import AbstractForm from "../components/AbstractForm.tsx";
import {RouteAttemptDisplay} from "../interfaces/RouteAttempt.ts";
import {motion} from "framer-motion";
import {
    FiActivity,
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiEdit3,
    FiMapPin,
    FiPlay,
    FiPlus,
    FiSave,
    FiTrash2,
    FiTrendingUp,
    FiXCircle
} from "react-icons/fi";
import {useBouldersAll} from "../hooks/useBouldersHooks"
import {usePlaceHooks} from "../hooks/usePlaceHooks";
import {usePastSessions} from "../hooks/usePastSessions.tsx"

const MotionCard = motion.create(Card.Root);
//const MotionBox = motion.create(Box);

interface SessionProps{
    groupId: number
}

function Sessions({groupId}: SessionProps): React.ReactElement {

    const [newSessionModalOpen, setNewSessionModalOpen] = useState(false)
    const [logClimbModalOpen, setLogClimbModalOpen] = useState(false)
    const [editClimbModalOpen, setEditClimbModalOpen] = useState(false)
    const [closeSessionModalOpen, setCloseSessionModalOpen] = useState(false)
    const [selectFieldPlaceValue, setSelectFieldPlaceValue] = useState<string[]>([])
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
    const [editingAttempt, setEditingAttempt] = useState<RouteAttemptDisplay | null>(null)
    const { places } = usePlaceHooks({groupId: groupId, autoload: true})

    const {
        session,
        openSession,
        closeSession,
        routeAttempts,
        addRouteAttempt,
        updateRouteAttempt,
        deleteRouteAttempt,
        error,
        clearError,
    } = useSession( {groupId: groupId, placeId: selectedPlace?.id ?? null} )


    const { pastSessions, isLoadingPastSessions, refetchPastSession } = usePastSessions({groupId: groupId, autoLoad: true})
    const placeId = session?.placeId ?? selectedPlace?.id ?? null
    const { boulders, refetchBoulders } = useBouldersAll({"placeID": placeId, fetchActive: "active", autoFetch:false})

    useEffect(() => {
        if(!placeId) {return }
        refetchBoulders()
    }, [selectedPlace, session])

    useEffect(() => {
        if(error) {
            toaster.create({
                title: "Error",
                description: "Failed to open a session",
                type: "error"
            })
            clearError()
        }
    } , [error])

    function handleLogClimbClick() {
        setLogClimbModalOpen(true)
    }

    function startNewSessionClick() {
        if(session) {
            toaster.create({
                title: "Error",
                description: "You already have an active session for this group",
                type: "error"
            })
            return
        }
        setNewSessionModalOpen(true)
    }


    function getDate(): string {
        const date = new Date()
        //return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${date.getHours()}:${date.getMinutes()}`
        return date.getTime().toString()
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
        //setSelectedPlace(place)
        openSession(place.id)
        setNewSessionModalOpen(false)
    }

    function handleCloseSessionClick() {
        if(!session) {
            toaster.create({
                title: "Error",
                description: "You must start a session before closing it",
                type: "error"
            })
            return
        }
        setCloseSessionModalOpen(true)
    }

    async function handleSaveAndCloseSession(save: boolean) {
        if(!session) {
            return
        }
        closeSession(session.id, save)
        setTimeout(() => {
            refetchPastSession()
        }, 100)
        setCloseSessionModalOpen(false)
    }

    function handleDeleteSession() {
        if(!session) {
            return
        }
        setSelectedPlace(null)
        console.log("Deleting session", session)
        closeSession(session.id, false)
        setCloseSessionModalOpen(false)
        toaster.create({
            title: "Session Deleted",
            description: "Session was closed without saving",
            type: "info"
        })
    }

    function saveClimbAttempt(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if(!session) {
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
        addRouteAttempt({
            routeId: parseInt(routeId),
            attempts: parseInt(attempts),
            completed: completed,
            timestamp: getDate()
        })
            .then(() => {
                toaster.create({
                    title: completed ? "Send! 🎯" : "Attempt Logged",
                    description: completed ? "Great job crushing that route!" : "Keep pushing!",
                    type: "success"
                })

            })
            .catch(err => {
                console.log(err)
                toaster.create({
                    title: "Error",
                    description: "Failed to log climb attempt",
                    type: "error"
                })
            })
        setLogClimbModalOpen(false)
    }

    function handleEditAttemptClick(attempt: RouteAttemptDisplay) {
        setEditingAttempt(attempt)
        setEditClimbModalOpen(true)
    }

    function saveEditedClimbAttempt(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if(!editingAttempt || !session) {
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

        updateRouteAttempt({...editingAttempt, completed: completed, attempts: parseInt(attempts), timestamp: Date.now()})
        setEditClimbModalOpen(false)
        setEditingAttempt(null)

        toaster.create({
            title: "Success",
            description: "Climb attempt updated",
            type: "success"
        })
    }

    function handleRemoveAttemptClick(attemptId: number) {
        if(!session) {
            toaster.create({
                title: "Error",
                description: "No active session",
                type: "error"
            })
            return
        }
        deleteRouteAttempt(attemptId)
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

    const currentPlace = session
        ? places.find(place => place.id === placeId) : null;

    function timestampToDate(timestamp: number, mode: "full" | "time"): string {
        const date = new Date(timestamp)
        if(mode === "full") {return date.toUTCString()}
        else if(mode === "time") {
            const hours = date.getHours()
            const minutes = date.getMinutes()
            return `${hours}:${minutes}`
        }

    }

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
                    {!session ? (
                        <Button
                            size="lg"
                            colorPalette="brand"
                            onClick={startNewSessionClick}
                            _hover={{
                                transform: "translateY(-2px)",
                                boxShadow: "lg"
                            }}
                            transition="all 0.2s"
                        >
                            <FiPlay />
                            Start New Session
                        </Button>
                    ) : (
                        <HStack gap={3}>
                            <Button
                                size="lg"
                                colorPalette="green"
                                onClick={() => handleCloseSessionClick()}
                            >
                                <FiSave />
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
                    bg={session ? "green.50" : "red.50"}
                    borderWidth="2px"
                    borderColor={session ? "green.500" : "red.300"}
                >
                    <Card.Body py={6}>
                        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                            <HStack gap={4}>
                                <Box
                                    p={3}
                                    bg={session ? "green.500" : "red.400"}
                                    borderRadius="full"
                                    color="white"
                                >
                                    {session ? <FiActivity size={24} /> : <FiXCircle size={24} />}
                                </Box>
                                <Box>
                                    <Heading size="md" color="gray.800">
                                        {session ? "Active Session" : "No Active Session"}
                                    </Heading>
                                    {session && currentPlace && (
                                        <HStack mt={1} color="gray.700">
                                            <FiMapPin />
                                            <Text fontWeight="medium">{currentPlace.name}</Text>
                                            <Text>•</Text>
                                            <FiClock />
                                            <Text>{session.timestamp}</Text>
                                        </HStack>
                                    )}
                                    {!session && (
                                        <Text color="gray.600" fontSize="sm" mt={1}>
                                            Start a session to begin tracking your climbs
                                        </Text>
                                    )}
                                </Box>
                            </HStack>
                            { session && routeAttempts.length > 0 && (
                                <HStack gap={2}>
                                    <Badge colorPalette="green" size="lg">
                                        {routeAttempts.length} {routeAttempts.length === 1 ? 'climb' : 'climbs'}
                                    </Badge>
                                    <Badge colorPalette="blue" size="lg">
                                        {routeAttempts.filter(a => a.completed).length} sent
                                    </Badge>
                                </HStack>
                            )}
                        </Flex>
                    </Card.Body>
                </MotionCard>

                {/* Active Session Details */}
                {session && (
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
                                    onClick={handleLogClimbClick}
                                >
                                    <FiPlus />
                                    Log Climb
                                </Button>
                            </Flex>
                        </Card.Header>
                        <Card.Body>
                            {routeAttempts.length > 0 ? (
                                <VStack gap={4} align="stretch">
                                    {routeAttempts.map((attempt: RouteAttemptDisplay, index) => {
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
                                                                    {attempt.routeName}
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
                                                            <HStack gap={4} fontSize="sm" color="gray.700">
                                                                <Text fontWeight="medium">
                                                                    Grade: <Badge colorPalette="purple">{attempt.gradeName}</Badge>
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
                                        onClick={handleLogClimbClick}
                                    >
                                        <FiPlus />
                                        Log Your First Climb
                                    </Button>
                                </Box>
                            )}
                        </Card.Body>
                    </MotionCard>
                )}

                <Separator />

                {/* Past Sessions Section*/}
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
                            onClick={refetchPastSession}
                        >
                            <FiTrendingUp />
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
                            {pastSessions.map((session: PastSession, index: number) => {
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
                                                            {timestampToDate(session.timestamp, "full")}
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
                                                    {session.routeAttempts.map((attempt: RouteAttemptDisplay, idx: number) => {
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
                                                                        {attempt.routeName}
                                                                    </Text>
                                                                    {attempt.completed && (
                                                                        <FiCheckCircle color="green" />
                                                                    )}
                                                                </HStack>
                                                                <HStack display="flex" justifyContent="space-between">
                                                                    <Text fontSize="xs" color="gray.600">
                                                                        Attempts: {attempt.attempts}
                                                                    </Text>
                                                                    <Text fontSize="xs" color="gray.600">
                                                                        Time: {timestampToDate(attempt.timestamp, "time")}
                                                                    </Text>
                                                                    <Badge colorPalette="purple">
                                                                        {attempt.gradeName}
                                                                    </Badge>
                                                                </HStack>
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
                                    {!session && (
                                        <Button
                                            colorPalette="brand"
                                            onClick={startNewSessionClick}
                                            mt={2}
                                        >
                                            <FiPlay />
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
                    <HStack gap={3} mt={4} justifyContent="center" display="flex">
                        <Button
                            colorPalette="brand"
                            onClick={handleSessionStartClick}
                        >
                            {<FiPlay />}
                            Start Session
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setNewSessionModalOpen(false); 
                                setSelectFieldPlaceValue([])
                            }}
                        >
                            Cancel
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
                                {editingAttempt.routeName}
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
                            {session && routeAttempts.length > 0 && (
                                <VStack align="stretch" gap={2} fontSize="sm">
                                    <HStack justify="space-between">
                                        <Text color="gray.600">Total Climbs:</Text>
                                        <Badge>{routeAttempts.length}</Badge>
                                    </HStack>
                                    <HStack justify="space-between">
                                        <Text color="gray.600">Completed:</Text>
                                        <Badge colorPalette="green">
                                            {routeAttempts.filter(a => a.completed).length}
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
                        >
                            <FiTrash2 />
                            Delete
                        </Button>
                        <Button
                            colorPalette="green"
                            onClick={() => handleSaveAndCloseSession(true)}
                        >
                            <FiSave />
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
