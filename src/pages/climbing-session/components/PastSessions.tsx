import { Badge, Box, Button, Card, Flex, Heading, HStack, SimpleGrid, Spinner, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiCalendar, FiCheckCircle, FiMapPin, FiPlay, FiTrendingUp } from "react-icons/fi";
import {PastSession} from "../../../interfaces/ClimbingSession";
import Place from "../../../interfaces/Place";
import { RouteAttemptDisplay } from "../../../interfaces/RouteAttempt";
import {Session} from "../../../hooks/useSession.tsx";

const MotionCard = motion.create(Card.Root);

interface PastSessionsProps {
    pastSessions: PastSession[] | null;
    isLoadingPastSessions: boolean;
    places: Place[];
    session: Session;
    onRefresh: () => void;
    onStartNewSession: () => void;
    timestampToDate: (timestamp: number, mode: "full" | "time") => string;
}

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4 }
    }
};

export function PastSessions({pastSessions, isLoadingPastSessions, places, session, onRefresh, onStartNewSession, timestampToDate}: PastSessionsProps) {
    return (
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
                    onClick={onRefresh}
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
                    {pastSessions.map((sessionItem: PastSession, index: number) => {
                        const sessionPlace = places.find(place => place.id === sessionItem.placeId);
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
                                                    {timestampToDate(sessionItem.timestamp, "full")}
                                                </Text>
                                            </Box>
                                        </HStack>
                                        <HStack>
                                            <Badge colorPalette="blue">
                                                {sessionItem.routeAttempts?.length || 0} climbs
                                            </Badge>
                                            <Badge colorPalette="green">
                                                {sessionItem.routeAttempts?.filter(a => a.completed).length || 0} sent
                                            </Badge>
                                        </HStack>
                                    </Flex>
                                </Card.Header>
                                <Card.Body>
                                    {sessionItem.routeAttempts && sessionItem.routeAttempts.length > 0 ? (
                                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                                            {sessionItem.routeAttempts.map((attempt: RouteAttemptDisplay, idx: number) => {
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
                                    onClick={onStartNewSession}
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
    );
}
