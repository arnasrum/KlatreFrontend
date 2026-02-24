import { Badge, Box, Card, Flex, Heading, HStack, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiActivity, FiClock, FiMapPin, FiXCircle } from "react-icons/fi";
import Place from "../../../interfaces/Place.ts";
import {RouteAttemptDisplay} from "../../../interfaces/RouteAttempt.ts";
import {Session} from "../../../hooks/useSession.tsx";

const MotionCard = motion.create(Card.Root);

interface SessionStatusCardProps {
    session: Session;
    currentPlace: Place;
    routeAttempts: RouteAttemptDisplay[];
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

export function SessionStatusCard({session, currentPlace, routeAttempts, timestampToDate,}: SessionStatusCardProps) {
    return (
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
                                    <Text>{timestampToDate(session.timestamp, "full")}</Text>
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
    );
}
