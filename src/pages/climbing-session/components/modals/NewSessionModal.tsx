import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { FiPlay } from "react-icons/fi";
import Modal from "../../../../components/modals/Modal.tsx";
import SelectField from "../../../../components/forms/SelectField.tsx";

interface NewSessionModalProps {
    isOpen: boolean;
    placeValue: string[];
    placeFields: { label: string; value: string }[];
    onSelectChange: (value: string[]) => void;
    onStart: () => void;
    onClose: () => void;
}

export function NewSessionModal({isOpen, placeValue, placeFields, onSelectChange, onStart, onClose,}: NewSessionModalProps) {
    return (
        <Modal isOpen={isOpen} title="Start New Climbing Session" size="md">
            <Modal.Body>
                <VStack align="stretch" gap={4}>
                    <Text color="fg.muted">
                        Choose where you'll be climbing today
                    </Text>
                    <SelectField
                        zIndex={9999}
                        value={placeValue}
                        setValue={onSelectChange}
                        fields={placeFields}
                        placeholder="Select a climbing place"
                    />
                </VStack>
            </Modal.Body>
            <Modal.Footer>
                <HStack gap={3} mt={4} justifyContent="center" display="flex">
                    <Button
                        colorPalette="brand"
                        onClick={onStart}
                    >
                        {<FiPlay />}
                        Start Session
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                </HStack>
            </Modal.Footer>
        </Modal>
    );
}
