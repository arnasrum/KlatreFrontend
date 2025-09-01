import React, { useState } from "react"
import { 
  Dialog,
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
    <div className="full-overlay-modal">
      <Dialog.Root open={isOpen}>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.CloseTrigger />
          </Dialog.Header>
          <Dialog.Body>
            {children}
          </Dialog.Body>
          { footer && (
          <Dialog.Footer>
            {footer}
          </Dialog.Footer>
          )}
        </Dialog.Content>
      </Dialog.Root>
    </div>
  )
}

const ModalBody = ({ children }: { children: React.ReactNode }) => children;
const ModalFooter = ({ children }: { children: React.ReactNode }) => children;

Modal.Body = ModalBody
Modal.Footer = ModalFooter

export default Modal