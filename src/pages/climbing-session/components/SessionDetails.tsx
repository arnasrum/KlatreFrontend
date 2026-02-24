import { Badge, Box, Button, Card, Flex, Grid, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiCheckCircle, FiEdit3, FiPlus, FiTrash2 } from "react-icons/fi";
import { RouteAttemptDisplay } from "../../../interfaces/RouteAttempt";

const MotionCard = motion.create(Card.Root);

interface SessionDetailsProps {
    routeAttempts: RouteAttemptDisplay[];
    onLogClimb: () => void;
    onEditAttempt: (attempt: RouteAttemptDisplay) => void;
    onRemoveAttempt: (attemptId: number) => void;
}

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4 }
    }
};

export function SessionDetails({routeAttempts, onLogClimb, onEditAttempt, onRemoveAttempt,}: SessionDetailsProps) {
    return (
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
                        onClick={onLogClimb}
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
                                                    onClick={() => onEditAttempt(attempt)}
                                                >
                                                    <FiEdit3 />
                                                </Button>
                                                <Button
                                                    colorPalette="red"
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => onRemoveAttempt(attempt.id)}
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
                            onClick={onLogClimb}
                        >
                            <FiPlus />
                            Log Your First Climb
                        </Button>
                    </Box>
                )}
            </Card.Body>
        </MotionCard>
    );
}
