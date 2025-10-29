import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../contexts/UserContext.ts"
import Groups from "./Groups.tsx"
import { 
    Container, 
    Heading, 
    VStack, 
    Text, 
    Box,
    Card,
    Flex,
    Button,
    SimpleGrid,
    Badge,
    HStack
} from "@chakra-ui/react"
import { motion } from "framer-motion"
import { 
    FiUsers, 
    FiTrendingUp, 
    FiMap, 
    FiAward,
    FiCheckCircle,
    FiTarget
} from "react-icons/fi"

const MotionBox = motion.create(Box)
const MotionCard = motion.create(Card.Root)

function Home() {
    const { user } = useContext(UserContext)
    const navigate = useNavigate()

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

    const features = [
        {
            icon: <FiUsers size={32} />,
            title: "Climbing Groups",
            description: "Join or create groups with your climbing partners to share routes and sessions",
            color: "blue"
        },
        {
            icon: <FiMap size={32} />,
            title: "Track Routes",
            description: "Document every boulder with photos, grades, and detailed descriptions",
            color: "green"
        },
        {
            icon: <FiTrendingUp size={32} />,
            title: "Monitor Progress",
            description: "Track your sends, attempts, and watch your climbing level improve over time",
            color: "purple"
        },
        {
            icon: <FiAward size={32} />,
            title: "Grading Systems",
            description: "Support for multiple grading systems to match your climbing style",
            color: "orange"
        }
    ]

    const benefits = [
        "Never forget a beta again",
        "Share routes with your crew",
        "Track your improvement",
        "Discover new climbing spots",
        "Community-driven content",
        "Mobile-friendly interface"
    ]

    // If user is logged in, show dashboard
    if (user) {
        return (
            <Box minH="calc(100vh - 80px)" bg="gradient-to-b" bgGradient="linear(to-b, brand.50, white)">
                <Container maxW="7xl" py={12}>
                    <MotionBox
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <VStack align="stretch" gap={8}>
                            {/* Welcome Section */}
                            <Card.Root bg="gradient-to-r" bgGradient="linear(to-r, brand.500, brand.600)" color="white">
                                <Card.Body py={8}>
                                    <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                                        <Box>
                                            <Heading color="fg" size="3xl" mb={2}>
                                                Welcome back, {user.username || user.name || "Climber"}! 👋
                                            </Heading>
                                            <Text fontSize="lg" color="fg" opacity={0.9}>
                                                Ready to crush some routes today?
                                            </Text>
                                        </Box>
                                        <Button
                                            size="lg"
                                            colorPalette="white"
                                            variant="solid"
                                            onClick={() => navigate("/settings")}
                                        >
                                            Quick Actions
                                        </Button>
                                    </Flex>
                                </Card.Body>
                            </Card.Root>

                            {/* Stats Overview */}
                            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                                <Card.Root>
                                    <Card.Body>
                                        <VStack align="start">
                                            <Badge colorPalette="blue" size="lg">
                                                This Week
                                            </Badge>
                                            <Heading size="2xl">12</Heading>
                                            <Text color="fg.muted">Routes Completed</Text>
                                        </VStack>
                                    </Card.Body>
                                </Card.Root>
                                <Card.Root>
                                    <Card.Body>
                                        <VStack align="start">
                                            <Badge colorPalette="green" size="lg">
                                                Active
                                            </Badge>
                                            <Heading size="2xl">3</Heading>
                                            <Text color="fg.muted">Climbing Groups</Text>
                                        </VStack>
                                    </Card.Body>
                                </Card.Root>
                                <Card.Root>
                                    <Card.Body>
                                        <VStack align="start">
                                            <Badge colorPalette="purple" size="lg">
                                                Personal Best
                                            </Badge>
                                            <Heading size="2xl">V7</Heading>
                                            <Text color="fg.muted">Highest Grade</Text>
                                        </VStack>
                                    </Card.Body>
                                </Card.Root>
                            </SimpleGrid>

                            {/* Groups Section */}
                            <Box>
                                <Flex justify="space-between" align="center" mb={4}>
                                    <Button
                                        ml={4}
                                        colorPalette="brand"
                                        variant="outline"
                                        onClick={() => navigate("/groups")}
                                    >
                                        View All
                                    </Button>
                                </Flex>
                                <Groups />
                            </Box>
                        </VStack>
                    </MotionBox>
                </Container>
            </Box>
        )
    }

    // Landing page for non-authenticated users
    return (
        <Box minH="calc(100vh - 80px)">
            {/* Hero Section */}
            <Box
                bg="gradient-to-br"
                bgGradient="linear(to-br, brand.500, brand.700)"
                color="white"
                py={20}
                position="relative"
                overflow="hidden"
            >
                {/* Background Pattern */}
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    opacity={0.1}
                    bgImage="radial-gradient(circle, white 1px, transparent 1px)"
                    bgSize="30px 30px"
                />

                <Container maxW="6xl" position="relative" zIndex={1}>
                    <MotionBox
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        <VStack gap={6} textAlign="center">
                            <MotionBox variants={itemVariants}>
                                <Badge colorPalette="white" size="lg" mb={4}>
                                    🧗 Welcome to Klatre
                                </Badge>
                            </MotionBox>

                            <MotionBox variants={itemVariants}>
                                <Heading color="fg" size="5xl" mb={4} lineHeight="1.2">
                                    Your Climbing Journey
                                    <br />
                                    Starts Here
                                </Heading>
                            </MotionBox>

                            <MotionBox variants={itemVariants}>
                                <Text color="fg" fontSize="2xl" opacity={0.95} maxW="3xl" mx="auto">
                                    Track routes, share beta, and progress with your climbing crew.
                                    The ultimate companion for boulderers and route climbers.
                                </Text>
                            </MotionBox>

                            <MotionBox variants={itemVariants}>
                                <HStack gap={4} mt={8} flexWrap="wrap" justify="center">
                                    <Button
                                        size="xl"
                                        colorPalette="white"
                                        variant="solid"
                                        onClick={() => navigate("/login")}
                                        px={8}
                                        py={6}
                                        fontSize="lg"
                                        _hover={{
                                            transform: "translateY(-2px)",
                                            boxShadow: "xl"
                                        }}
                                        transition="all 0.2s"
                                    >
                                        Login To Start
                                    </Button>
                                </HStack>
                            </MotionBox>
                        </VStack>
                    </MotionBox>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxW="6xl" py={20}>
                <MotionBox
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                >
                    <VStack gap={16}>
                        <VStack gap={4} textAlign="center">
                            <Heading size="3xl" color="gray.800">
                                Everything You Need to Climb Better
                            </Heading>
                            <Text fontSize="xl" color="fg.muted" maxW="2xl">
                                Powerful features designed by climbers, for climbers
                            </Text>
                        </VStack>

                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={8} width="full">
                            {features.map((feature, index) => (
                                <MotionCard
                                    key={index}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Card.Body p={8}>
                                        <VStack align="start" gap={4}>
                                            <Box
                                                p={3}
                                                borderRadius="lg"
                                                bg={`${feature.color}.100`}
                                                color={`${feature.color}.600`}
                                            >
                                                {feature.icon}
                                            </Box>
                                            <Heading size="lg">{feature.title}</Heading>
                                            <Text color="fg.muted" fontSize="md">
                                                {feature.description}
                                            </Text>
                                        </VStack>
                                    </Card.Body>
                                </MotionCard>
                            ))}
                        </SimpleGrid>
                    </VStack>
                </MotionBox>
            </Container>

            {/* Benefits Section */}
            <Box bg="gray.50" py={20}>
                <Container maxW="6xl">
                    <MotionBox
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                    >
                        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={12} alignItems="center">
                            <MotionBox variants={itemVariants}>
                                <VStack align="start" gap={6}>
                                    <Badge colorPalette="brand" size="lg">
                                        Why Klatre?
                                    </Badge>
                                    <Heading size="3xl" color="gray.800">
                                        Built for the Climbing Community
                                    </Heading>
                                    <Text fontSize="lg" color="fg.muted">
                                        We understand climbers because we are climbers. Klatre is built
                                        to solve real problems and track your progress.
                                    </Text>
                                    <Button
                                        colorPalette="brand"
                                        size="lg"
                                        onClick={() => navigate("/login")}
                                    >
                                        Start Tracking Today
                                        <FiTarget />
                                    </Button>
                                </VStack>
                            </MotionBox>

                            <MotionBox variants={itemVariants}>
                                <Card.Root>
                                    <Card.Body p={8}>
                                        <VStack align="stretch" gap={4}>
                                            {benefits.map((benefit, index) => (
                                                <Flex key={index} align="center" gap={3}>
                                                    <Box color="green.500" flexShrink={0}>
                                                        <FiCheckCircle size={24} />
                                                    </Box>
                                                    <Text fontSize="lg">{benefit}</Text>
                                                </Flex>
                                            ))}
                                        </VStack>
                                    </Card.Body>
                                </Card.Root>
                            </MotionBox>
                        </SimpleGrid>
                    </MotionBox>
                </Container>
            </Box>
        </Box>
    )
}

export default Home
