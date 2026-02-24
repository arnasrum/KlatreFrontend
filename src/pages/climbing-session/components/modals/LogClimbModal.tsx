import { Button, HStack } from "@chakra-ui/react";
import Modal from "../../../../components/Modal.tsx";
import AbstractForm from "../../../../components/AbstractForm.tsx";
import React from "react";

interface LogClimbModalProps {
    isOpen: boolean;
    formFields: any[];
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    onClose: () => void;
}

export function LogClimbModal({
                                  isOpen,
                                  formFields,
                                  onSubmit,
                                  onClose,
                              }: LogClimbModalProps) {
    return (
        <Modal isOpen={isOpen} title="Log Climb Attempt" size="md">
            <Modal.Body>
                <AbstractForm
                    fields={formFields}
                    handleSubmit={onSubmit}
                    footer={
                        <HStack justify="flex-end" gap={3} pt={4}>
                            <Button
                                variant="outline"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                colorPalette="brand"
                            >
                                Save Climb
                            </Button>
                        </HStack>
                    }
                />
            </Modal.Body>
        </Modal>
    );
}
