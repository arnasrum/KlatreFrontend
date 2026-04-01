import { Button, HStack, Text } from "@chakra-ui/react";
import Modal from "../../../../components/modals/Modal.tsx";
import AbstractForm from "../../../../components/forms/AbstractForm.tsx";
import { RouteAttemptDisplay } from "../../../../interfaces/RouteAttempt";
import React from "react";

interface EditClimbModalProps {
    isOpen: boolean;
    editingAttempt: RouteAttemptDisplay | null;
    formFields: any[];
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    onClose: () => void;
}

export function EditClimbModal({isOpen, editingAttempt, formFields, onSubmit, onClose}: EditClimbModalProps) {
    return (
        <Modal isOpen={isOpen} title="Edit Climb Attempt" size="md">
            <Modal.Body>
                {editingAttempt && (
                    <>
                        <Text color="black" fontWeight="bold" mb={4}>
                            {editingAttempt.routeName}
                        </Text>
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
                                        Save Changes
                                    </Button>
                                </HStack>
                            }
                        />
                    </>
                )}
            </Modal.Body>
        </Modal>
    );
}
