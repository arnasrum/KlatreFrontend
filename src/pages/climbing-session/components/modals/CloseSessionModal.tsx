import { Badge, Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { FiSave, FiTrash2 } from "react-icons/fi";
import Modal from "../../../../components/Modal.tsx";
import {RouteAttemptDisplay} from "../../../../interfaces/RouteAttempt.ts";
import {Session} from "../../../../hooks/useSession.tsx";

interface CloseSessionModalProps {
    isOpen: boolean;
    session: Session;
    routeAttempts: RouteAttemptDisplay[];
    onSave: () => void;
    onDelete: () => void;
    onClose: () => void;
}

export function CloseSessionModal({isOpen, session, routeAttempts, onSave, onDelete, onClose}: CloseSessionModalProps) {
    return (
        <Modal isOpen={isOpen} title="Close Climbing Session" size="md">
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
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        colorPalette="red"
                        variant="outline"
                        onClick={onDelete}
                    >
                        <FiTrash2 />
                        Delete
                    </Button>
                    <Button
                        colorPalette="green"
                        onClick={onSave}
                    >
                        <FiSave />
                        Save Session
                    </Button>
                </HStack>
            </Modal.Footer>
        </Modal>
    );
}
