'use client'

import React, { useState } from 'react'
import { CiTrash } from 'react-icons/ci';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import { useToast } from "@/hooks/use-toast";

type PropsType = {
  onConfirm: () => void
}

const DeleteConfirmation = ({ onConfirm }: PropsType) => {
  const [isOpen, setIsOpen] = useState(false)

  const { toast } = useToast()

  const handleConfirm = () => { 
    onConfirm()
    toast({ description: 'Shipping information deleted successfully' })
    setIsOpen(false)
  }
  return (
    <>
      <button aria-label="Delete Shipping Info" onClick={() => setIsOpen(true)}>
        <CiTrash size={20} className="text-red-500" />
      </button>
      <Modal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        backdrop='blur'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Are you sure you want to delete this information?
              </ModalHeader>
              <ModalBody>
                <p>
                  Deleting this shipping information is a a permanent and
                  irreversible action.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="danger" variant='light'  onPress={handleConfirm}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default DeleteConfirmation