import { Box, Button, Flex, Heading, HStack, Text } from "@chakra-ui/react";
import { FiCalendar, FiPlay, FiSave } from "react-icons/fi";
import {Session} from "../../../hooks/useSession.tsx";

interface SessionHeaderProps {
    session: Session;
    onStartNewSession: () => void;
    onCloseSession: () => void;
}

export function SessionHeader({session, onStartNewSession, onCloseSession}: SessionHeaderProps) {
    return (
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
                    onClick={onStartNewSession}
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
                        onClick={onCloseSession}
                    >
                        <FiSave />
                        Save & Close
                    </Button>
                </HStack>
            )}
        </Flex>
    );
}
