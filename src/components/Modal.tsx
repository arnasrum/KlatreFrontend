import React, { useState } from "react"
import {
    Dialog, Box, Portal
} from "@chakra-ui/react"
import "./Modal.css"

interface ModalProps {
    isOpen: boolean,
    title: string,
    children: React.ReactNode,
    footer?: React.ReactNode,
}


function Modal(props: ModalProps) {

    const { isOpen, title, children, footer } = props

    return (
        <Dialog.Root open={isOpen} size="xl">
            <Dialog.Trigger/>
            <Dialog.Backdrop/>
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title color="fg">{title}</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body overflow="auto">
                        {children}
                    </Dialog.Body>
                    { footer && (
                        <Dialog.Footer>
                            <Dialog.CloseTrigger />
                            {footer}
                        </Dialog.Footer>
                    )}
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}

const ModalBody = ({ children }: { children: React.ReactNode }) => children;
const ModalFooter = ({ children }: { children: React.ReactNode }) => children;

Modal.Body = ModalBody
Modal.Footer = ModalFooter

export default Modal