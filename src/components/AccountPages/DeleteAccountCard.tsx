'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import DeleteAccountForm from './DeleteAccountForm';
import { Button } from '@nextui-org/react';

const DeleteAccountCard = () => {
  const [showForm, setShowForm] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  return (
    <motion.div
      layout
      className="flex flex-col gap-4 rounded-xl border p-4"
    >
      <motion.h2 layout='position' className="text-xl font-semibold">Delete Account</motion.h2>
      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div
            animate={{ opacity: [0, 1], x: ["100%", "0%"] }}
            exit={{ opacity: [1, 0], x: ["0%", "100%"] }}
          >
            <DeleteAccountForm
              setShowForm={setShowForm}
              setHasSubmited={setHasSubmitted}
            />
          </motion.div>
        ) : (
          <motion.div
            animate={{ opacity: [0, 1], x: ["-100%", "0%"] }}
            exit={{ opacity: [1, 0], x: ["0%", "-100%"] }}
            className="flex flex-col gap-4"
          >
            <p className="text-gray-500 px-4">
              {hasSubmitted
                ? "Your account has been deleted. You will be logged out in 5 seconds."
                : "Delete your account from Komas500. This terminates your account and all associated information about your account."}
            </p>
            {!hasSubmitted && (
              <Button
                onPress={() => setShowForm(true)}
                className="text-white bg-red-500 font-medium rounded-md p-2 px-6 md:w-[40%] lg:w-[30%] md:mx-auto"
              >
                Delete Account
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default DeleteAccountCard