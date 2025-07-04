"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { deleteAccountSchema } from "@/lib/schemas";
import { Button, Textarea } from "@nextui-org/react";

type FormType = z.infer<typeof deleteAccountSchema>;

type PropsType = {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  setHasSubmited: React.Dispatch<React.SetStateAction<boolean>>;
};

const DeleteAccountForm = ({ setShowForm, setHasSubmited }: PropsType) => {
  const form = useForm<FormType>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      reason: "",
    },
    mode: "onTouched",
  });

  const onSubmit = (data: FormType) => {
    console.log(data);

    setShowForm(false);
    setHasSubmited(true);
  };

  const handleCancel = () => {
    form.reset();
    setShowForm(false);
  };
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <Textarea
        minRows={3}
        maxRows={5}
        size="lg"
        variant="bordered"
        label="Kindly tell us why you want to delete your account"
        placeholder="Enter text here"
        {...form.register("reason")}
        isInvalid={!!form.formState.errors.reason}
        errorMessage={form.formState.errors.reason?.message}
        classNames={{
          label: 'text-gray-500'
        }}
      />
      <div className="flex justify-center gap-4">
        <Button
          type="submit"
          className="text-white bg-red-500 font-medium rounded-md p-2 px-10"
        >
          Submit
        </Button>
        <Button
          type="button"
          onPress={handleCancel}
          className="text-white bg-green-500 font-medium rounded-md p-2 px-10"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default DeleteAccountForm;
