import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import AddGroupForm from "./AddGroupForm.tsx";
import type Group from "../interfaces/Group.ts";
import { useGroups } from "../hooks/useGroups.ts";
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

function Groups() {
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
    const [showGroupModal, setShowGroupModal] = useState<boolean>(false);
    const { setCurrentGroup } = useContext(GroupContext);
    const { user, isLoggedIn } = useContext(UserContext);
    const navigate = useNavigate();

    const { groups, refetchGroups,  isLoading, error } = useGroups();

    function navigateToGroup(uuid: string, group: Group) {
        setCurrentGroup(group);
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

    if (error) {
        return (
            <Container maxW="4xl" py={16}>
                <Alert.Root status="error">
                    <Alert.Indicator />
                    <Alert.Title>Error Loading Groups</Alert.Title>
                    <Alert.Description><>{error}</></Alert.Description>
                </Alert.Root>
                <Button
                    mt={4}
                    colorPalette="blue"
                    onClick={refetchGroups}
                >
                    Try Again
                </Button>
            </Container>
        );
    }

    if (showGroupModal) {
        return (
            <Container maxW="2xl" py={8}>
                <Card.Root>
                    <Card.Header>
                        <Heading color="fg" size="xl">Create New Group</Heading>
                    </Card.Header>
                    <Card.Body>
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
                    </Card.Body>
                </Card.Root>
            </Container>
        );
    }

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

    console.log(groups);
    const groupItems = groups.map(group => ({
        id: group.id,
        name: group.name,
        description: group.description,
        uuid: group.uuid,
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
                            templateColumns={{
                                base: "1fr",
                                sm: "repeat(auto-fill, minmax(200px, 1fr))",
                                md: "repeat(auto-fill, minmax(220px, 1fr))",
                            }}
                            gap={3}
                        >
                            {groupItems.map((item: Group & { placesCount: number }, index) => (
                                <MotionCard
                                    key={item.uuid}
                                    variants={cardVariants}
                                    whileHover={{
                                        y: -4,
                                        transition: { duration: 0.2 }
                                    }}
                                    cursor="pointer"
                                    onClick={() => navigateToGroup(item.uuid, item)}
                                    bg="white"
                                    borderWidth="1px"
                                    borderColor="gray.200"
                                    borderRadius="lg"
                                    overflow="hidden"
                                    _hover={{
                                        borderColor: "brand.400",
                                        boxShadow: "lg"
                                    }}
                                >
                                    {/* Minimal colored accent */}
                                    <Box
                                        h="4px"
                                        bg={`brand.${400 + (index % 3) * 100}`}
                                    />

                                    <Card.Body p={4}>
                                        <VStack align="stretch" gap={2}>
                                            {/* Group Name - more compact */}
                                            <Heading size="md" color="gray.800">
                                                {item.name}
                                            </Heading>

                                            {/* Description - limited height */}
                                            <Text
                                                color="gray.600"
                                                fontSize="sm"
                                                minH="40px"
                                            >
                                                {item.description || "No description"}
                                            </Text>

                                            {/* Stats - inline and minimal */}
                                            <HStack gap={1.5} color="gray.500" fontSize="xs" mt={1}>
                                                <FiMapPin size={14} />
                                                <Text>
                                                    {item.placesCount} {item.placesCount === 1 ? "place" : "places"}
                                                </Text>
                                            </HStack>
                                        </VStack>
                                    </Card.Body>
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