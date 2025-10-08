import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import AddGroupForm from "./AddGroupForm.tsx";
import type Place from "../interfaces/Place.ts";
import type Group from "../interfaces/Group.ts";
import ReusableButton from "../components/ReusableButton.tsx";
import { apiUrl } from "../constants/global.ts";
import { 
    Container,
    Grid,
    Box,
    Card,
    Heading,
    Text,
    Button,
    VStack,
    HStack,
    Badge,
    Skeleton,
    Alert,
    Flex,
    Separator
} from "@chakra-ui/react";
import { GroupContext } from "../contexts/GroupContext.tsx";
import { UserContext } from "../contexts/UserContext.ts";
import { motion } from "framer-motion";
import { 
    FiUsers, 
    FiPlus, 
    FiMapPin, 
    FiArrowRight,
    FiAlertCircle
} from "react-icons/fi";

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card.Root);

interface Groups {
    group: Group;
    places: Array<Place>;
}

function Groups() {
    const [groups, setGroups] = useState<Array<Groups>>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
    const [refetchGroups, setRefetchGroups] = useState<boolean>(false);
    const [addRefetch, setAddRefetch] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showGroupModal, setShowGroupModal] = useState<boolean>(false);
    const { setCurrentGroup } = useContext(GroupContext);
    const { user, isLoggedIn } = useContext(UserContext);
    const navigate = useNavigate();

    const groupContext = {
        refetch: refetchGroups,
        setRefetch: setRefetchGroups,
        groupID: selectedGroupId,
        setSelectedGroupID: setSelectedGroupId,
        addRefetch,
        setAddRefetch,
        setShowGroupModal,
    };

    // Fetch groups
    useEffect(() => {
        if (!isLoggedIn) return;

        fetch(`${apiUrl}/api/groups`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(responseBody => {
                setGroups(Array.isArray(responseBody) ? responseBody : []);
                setError(null);
            })
            .finally(() => setIsLoading(false))
            .catch(error => {
                setGroups([]);
                setIsLoading(false);
                setError(error.message || "An unexpected error occurred while loading groups");
                console.error(error);
            });
    }, [refetchGroups, isLoggedIn]);

    function handleDeleteClick() {
        fetch(`${apiUrl}/api/groups`, {
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            method: "DELETE",
            body: JSON.stringify({
                groupID: selectedGroupId,
            })
        })
            .then(() => setRefetchGroups(!refetchGroups))
            .catch(error => {
                console.log(error);
                setError(error.message || "An unexpected error occurred while deleting group");
            });
    }

    function refetchGroupsHandler() {
        setRefetchGroups((prev: boolean) => !prev);
    }

    function navigateToGroup(uuid: string, group: Group) {
        setCurrentGroup(group);
        console.log("group", group);
        navigate(`/groups/${uuid}`, { state: { group } });
    }

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

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

    // Loading State
    if (isLoading) {
        return (
            <Container maxW="7xl" py={8}>
                <VStack gap={6} align="stretch">
                    <Skeleton height="60px" width="300px" />
                    <Grid templateColumns="repeat(auto-fill, minmax(320px, 1fr))" gap={6}>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Skeleton key={i} height="200px" borderRadius="lg" />
                        ))}
                    </Grid>
                </VStack>
            </Container>
        );
    }

    // Not Logged In State
    if (!user) {
        return (
            <Container maxW="4xl" py={16}>
                <Card.Root>
                    <Card.Body p={12}>
                        <VStack gap={6} textAlign="center">
                            <Box color="orange.500" fontSize="5xl">
                                <FiAlertCircle size={64} />
                            </Box>
                            <Heading size="2xl">Authentication Required</Heading>
                            <Text fontSize="lg" color="fg.muted">
                                Please log in to view and manage your climbing groups.
                            </Text>
                            <Button
                                colorPalette="brand"
                                size="lg"
                                onClick={() => navigate("/login")}
                            >
                                Go to Login
                            </Button>
                        </VStack>
                    </Card.Body>
                </Card.Root>
            </Container>
        );
    }

    // Error State
    if (error) {
        return (
            <Container maxW="4xl" py={16}>
                <Alert.Root status="error">
                    <Alert.Indicator />
                    <Alert.Title>Error Loading Groups</Alert.Title>
                    <Alert.Description>{error}</Alert.Description>
                </Alert.Root>
                <Button
                    mt={4}
                    colorPalette="blue"
                    onClick={refetchGroupsHandler}
                >
                    Try Again
                </Button>
            </Container>
        );
    }

    // Add Group Modal
    if (showGroupModal) {
        return (
            <Container maxW="2xl" py={8}>
                <Card.Root>
                    <Card.Header>
                        <Heading color="fg" size="xl">Create New Group</Heading>
                    </Card.Header>
                    <Card.Body>
                        <GroupContext.Provider value={groupContext}>
                            <AddGroupForm />
                            <Button
                                mt={4}
                                variant="outline"
                                colorPalette="gray"
                                width="full"
                                onClick={() => setShowGroupModal(false)}
                            >
                                Cancel
                            </Button>
                        </GroupContext.Provider>
                    </Card.Body>
                </Card.Root>
            </Container>
        );
    }

    // Empty State
    if (groups.length === 0) {
        return (
            <Container maxW="4xl" py={16}>
                <Card.Root>
                    <Card.Body p={12}>
                        <VStack gap={6} textAlign="center">
                            <Box color="brand.500" fontSize="5xl">
                                <FiUsers size={64} />
                            </Box>
                            <Heading size="2xl">No Groups Yet</Heading>
                            <Text fontSize="lg" color="fg.muted" maxW="md">
                                Create your first climbing group to start tracking routes and sessions with your crew!
                            </Text>
                            <Button
                                colorPalette="brand"
                                size="lg"
                                onClick={() => setShowGroupModal(true)}
                            >
                                <FiPlus />
                                Create Your First Group
                            </Button>
                        </VStack>
                    </Card.Body>
                </Card.Root>
            </Container>
        );
    }

    const groupItems = groups.map(group => ({
        id: group.group.id,
        name: group.group.name,
        description: group.group.description,
        uuid: group.group.uuid,
        placesCount: group.places.length,
    }));

    // Main Groups View
    return (
        <Box minH="calc(100vh - 80px)" bg="gray.50">
            <Container maxW="7xl" py={8}>
                <MotionBox
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <VStack gap={8} align="stretch">
                        {/* Header Section */}
                        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                            <Box>
                                <Heading size="3xl" color="gray.800" mb={2}>
                                    Your Climbing Groups
                                </Heading>
                                <Text fontSize="lg" color="fg.muted">
                                    Manage and explore your climbing communities
                                </Text>
                            </Box>
                            <Button
                                colorPalette="brand"
                                size="lg"
                                onClick={() => setShowGroupModal(true)}
                                _hover={{
                                    transform: "translateY(-2px)",
                                    boxShadow: "lg"
                                }}
                                transition="all 0.2s"
                            >
                                <FiPlus />
                                New Group
                            </Button>
                        </Flex>

                        {/* Stats Bar */}
                        <Card.Root bg="gradient-to-r" bgGradient="linear(to-r, brand.500, brand.600)" color="white">
                            <Card.Body py={6}>
                                <Flex justify="space-around" align="center" wrap="wrap" gap={6}>
                                    <VStack gap={1}>
                                        <Heading size="2xl" color="fg">{groups.length}</Heading>
                                        <Text opacity={0.9} color="fg">Total Groups</Text>
                                    </VStack>
                                    <Separator orientation="vertical" height="50px" display={{ base: "none", md: "block" }} />
                                    <VStack gap={1}>
                                        <Heading size="2xl" color="fg">
                                            {groups.reduce((acc, g) => acc + g.places.length, 0)}
                                        </Heading>
                                        <Text opacity={0.9} color="fg">Climbing Spots</Text>
                                    </VStack>
                                    <Separator orientation="vertical" height="50px" display={{ base: "none", md: "block" }} />
                                    <VStack gap={1}>
                                        <Heading size="2xl" color="fg">∞</Heading>
                                        <Text opacity={0.9} color="fg">Routes to Climb</Text>
                                    </VStack>
                                </Flex>
                            </Card.Body>
                        </Card.Root>

                        {/* Groups Grid */}
                        <Grid
                            templateColumns="repeat(auto-fill, minmax(320px, 1fr))"
                            gap={6}
                        >
                            {groupItems.map((item: Group & { placesCount: number }, index) => (
                                <MotionCard
                                    key={item.uuid}
                                    variants={cardVariants}
                                    whileHover={{
                                        y: -8,
                                        transition: { duration: 0.2 }
                                    }}
                                    cursor="pointer"
                                    onClick={() => navigateToGroup(item.uuid, item)}
                                    bg="white"
                                    borderWidth="1px"
                                    borderColor="gray.200"
                                    overflow="hidden"
                                    _hover={{
                                        borderColor: "brand.500",
                                        boxShadow: "xl"
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
                                    </Box>

                                    <Card.Body pt={4} pb={6} px={6}>
                                        <VStack align="stretch" gap={4}>
                                            {/* Group Name */}
                                            <Heading size="lg" color="gray.800">
                                                {item.name}
                                            </Heading>

                                            {/* Description */}
                                            <Text
                                                color="fg.muted"
                                                fontSize="sm"
                                                minH="40px"
                                            >
                                                {item.description || "No description provided"}
                                            </Text>

                                            <Separator />

                                            {/* Stats */}
                                            <HStack justify="space-between">
                                                <HStack gap={2}>
                                                    <Box color="brand.500">
                                                        <FiMapPin size={18} />
                                                    </Box>
                                                    <Text fontSize="sm" color="gray.600">
                                                        {item.placesCount} {item.placesCount === 1 ? "place" : "places"}
                                                    </Text>
                                                </HStack>
                                                <Badge colorPalette="green" size="sm">
                                                    Active
                                                </Badge>
                                            </HStack>
                                        </VStack>
                                    </Card.Body>

                                    <Card.Footer
                                        justifySelf="flex-end"
                                        justifyContent="flex-end"
                                        bg="gray.50"
                                        borderTopWidth="1px"
                                        borderColor="gray.200"
                                        py={3}
                                    >
                                        <Button
                                            variant="outline"
                                            colorPalette="brand"
                                            size="sm"
                                        >
                                            View Group
                                            <FiArrowRight />
                                        </Button>
                                    </Card.Footer>
                                </MotionCard>
                            ))}
                        </Grid>

                        {/* Quick Actions */}
                        <Card.Root mt={4}>
                            <Card.Body>
                                <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                                    <VStack align="start">
                                        <Heading size="md">Need Help?</Heading>
                                        <Text fontSize="sm" color="fg.muted">
                                            Learn how to make the most of your climbing groups
                                        </Text>
                                    </VStack>
                                    <Button variant="outline" colorPalette="blue">
                                        View Guide
                                    </Button>
                                </Flex>
                            </Card.Body>
                        </Card.Root>
                    </VStack>
                </MotionBox>
            </Container>
        </Box>
    );
}

export default Groups;