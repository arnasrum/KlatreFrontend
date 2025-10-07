import React, {useState, useEffect, useContext, useRef } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import {
    Box, 
    Tabs,
    Spinner, 
    Container, 
    Heading, 
    Center, 
    Text,
    Card,
    VStack,
    HStack,
    Badge,
    Button,
    SimpleGrid,
    Flex
} from "@chakra-ui/react"
import "./Group.css"
import Places from "./Places.tsx";
import {apiUrl} from "../constants/global.ts"
import Settings from "./Settings.tsx";
import Sessions from "./ClimbingSessionTracker.tsx";
import { UserContext } from "../contexts/UserContext.ts";
import { PlaceContext } from "../contexts/PlaceContext.ts";
import { motion } from "framer-motion"
import { 
    FiUsers, 
    FiMap, 
    FiBarChart2, 
    FiSettings,
    FiCalendar,
    FiTrendingUp
} from "react-icons/fi"

const MotionBox = motion.create(Box)
const MotionCard = motion.create(Card.Root)

function Group() {

    //const location = useLocation()
    //const navigate = useNavigate()
    //const groupUUID = location.pathname.split("/").pop()
    const { uuid } = useParams<{ uuid: string }>()
    const navigate = useNavigate()
    const groupUUID = uuid

    const [groupData, setGroupData] = useState<any>(null)
    const [tab, setTab] = useState<string>("boulders")
    const [refetchPlaces, setRefetchPlaces] = useState<boolean>(false)
    const [ placeData, setPlaceData ] = useState<Array<any>>([])
    const { user } = useContext(UserContext)

    function setPlaces(places: Array<any>) {
        setPlaceData(places)
    }

    useEffect(() => {
        fetch(`${apiUrl}/api/groups/uuid/${groupUUID}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                return response.json()
            })
            .then(responseBody => setGroupData(responseBody.data))
            .catch(error => console.error('Failed to fetch group:', error))
    }, [groupUUID, user]);

    function refetchPlacesHandler() {
        setRefetchPlaces((prev: boolean) => !prev)
    }

    const placeContext = {refetchPlaces: refetchPlacesHandler}

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    }

    if (!groupData) {
        return (
            <Container maxW="7xl" py={12}>
                <Center minH="calc(100vh - 200px)">
                    <VStack gap={4}>
                        <Spinner size="xl" colorPalette="brand" />
                        <Text color="fg.muted">Loading group...</Text>
                    </VStack>
                </Center>
            </Container>
        )
    }

    return (
        <PlaceContext.Provider value={placeContext} >
            <Box minH="calc(100vh - 80px)" bg="gradient-to-b" bgGradient="linear(to-b, brand.50, white)">
                <Container maxW="7xl" py={12}>
                    <MotionBox
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        <VStack align="stretch" gap={8}>
                            {/* Header Section */}
                            <MotionCard
                                variants={itemVariants}
                                bg="gradient-to-r" 
                                bgGradient="linear(to-r, brand.500, brand.600)" 
                                color="white"
                            >
                                <Card.Body py={8}>
                                    <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                                        <Box>
                                            <HStack mb={2}>
                                                <Badge colorPalette="white" size="lg">
                                                    <FiUsers style={{ display: "inline", marginRight: "4px" }} />
                                                    Group
                                                </Badge>
                                            </HStack>
                                            <Heading color="fg" size="4xl" mb={2}>
                                                {groupData.name}
                                            </Heading>
                                            <Text color="fg" fontSize="lg" opacity={0.9}>
                                                {groupData.description || "No description provided"}
                                            </Text>
                                        </Box>
                                        <Button
                                            size="lg"
                                            colorPalette="white"
                                            variant="solid"
                                            onClick={() => setTab("settings")}
                                        >
                                            <FiSettings style={{ marginRight: "8px" }} />
                                            Manage Group
                                        </Button>
                                    </Flex>
                                </Card.Body>
                            </MotionCard>

                            {/* Stats Overview */}
                            <MotionBox variants={itemVariants}>
                                <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                                    <Card.Root>
                                        <Card.Body>
                                            <VStack align="start">
                                                <Badge colorPalette="blue" size="lg">
                                                    <FiMap style={{ display: "inline", marginRight: "4px" }} />
                                                    Places
                                                </Badge>
                                                <Heading size="2xl">{placeData.length || 0}</Heading>
                                                <Text color="fg.muted">Climbing Locations</Text>
                                            </VStack>
                                        </Card.Body>
                                    </Card.Root>
                                    <Card.Root>
                                        <Card.Body>
                                            <VStack align="start">
                                                <Badge colorPalette="green" size="lg">
                                                    <FiTrendingUp style={{ display: "inline", marginRight: "4px" }} />
                                                    Activity
                                                </Badge>
                                                <Heading size="2xl">---</Heading>
                                                <Text color="fg.muted">Recent Sessions</Text>
                                            </VStack>
                                        </Card.Body>
                                    </Card.Root>
                                    <Card.Root>
                                        <Card.Body>
                                            <VStack align="start">
                                                <Badge colorPalette="purple" size="lg">
                                                    <FiUsers style={{ display: "inline", marginRight: "4px" }} />
                                                    Members
                                                </Badge>
                                                <Heading size="2xl">---</Heading>
                                                <Text color="fg.muted">Active Climbers</Text>
                                            </VStack>
                                        </Card.Body>
                                    </Card.Root>
                                </SimpleGrid>
                            </MotionBox>

                            {/* Main Content Tabs */}
                            <MotionCard variants={itemVariants}>
                                <Card.Body>
                                    <Tabs.Root fitted value={tab} onValueChange={(newValue) => {setTab(newValue.value)}}>
                                        <Tabs.List>
                                            <Tabs.Trigger value="boulders">
                                                <FiMap style={{ marginRight: "6px" }} />
                                                Boulders
                                            </Tabs.Trigger>
                                            <Tabs.Trigger value="stats">
                                                <FiBarChart2 style={{ marginRight: "6px" }} />
                                                Statistics
                                            </Tabs.Trigger>
                                            <Tabs.Trigger value="sessions">
                                                <FiCalendar style={{ marginRight: "6px" }} />
                                                Sessions
                                            </Tabs.Trigger>
                                            <Tabs.Trigger value="settings">
                                                <FiSettings style={{ marginRight: "6px" }} />
                                                Settings
                                            </Tabs.Trigger>
                                        </Tabs.List>
                                        <Box mt={6}>
                                            <Tabs.Content value="boulders">
                                                <Places refetchGroups={refetchPlacesHandler} groupID={groupData.id} setPlaces2={setPlaces} />
                                            </Tabs.Content>
                                            <Tabs.Content value="stats">
                                                <VStack gap={4} py={8}>
                                                    <Text color="fg.muted" fontSize="lg">
                                                        Statistics coming soon...
                                                    </Text>
                                                </VStack>
                                            </Tabs.Content>
                                            <Tabs.Content value="settings">
                                                <Settings groupID={groupData.id} places={placeData} />
                                            </Tabs.Content>
                                            <Tabs.Content value="sessions">
                                                <Sessions places={placeData} groupId={groupData.id} />
                                            </Tabs.Content>
                                        </Box>
                                    </Tabs.Root>
                                </Card.Body>
                            </MotionCard>
                        </VStack>
                    </MotionBox>
                </Container>
            </Box>
        </PlaceContext.Provider>
    );

}

export default Group;