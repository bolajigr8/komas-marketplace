"use client";

import React from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button, Input } from "@nextui-org/react";
import { resetPassword } from "@/lib/server-actions/auth";

const formSchema = z.object({
  code: z.string().min(4).max(4),
  email: z.string().email().optional(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

type PropsType = {
  email?: string;
  callbackUrl?: string;
  replaceHistory?: boolean;
};

const ForgotPasswordOtp = ({
  email,
  callbackUrl,
  replaceHistory,
}: PropsType) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      email: email || "",
      code: "",
    },
  });

  const router = useRouter();

  const { toast } = useToast();

  const handleChange = (value: string) => {
    form.setValue("code", value);
  };

  const onSubmit = async (data: FormValues) => {
    if (!data.email)
      return toast({
        description: "Something went wrong",
        variant: "destructive",
      });

    try {
      // Reset password
      const res = await resetPassword({
        username: data.email,
        code: data.code,
        newPassword: data.password,
      });

      // Display success or error message based on the response
      if (res.hasError)
        return toast({
          description: res.message,
          variant: "destructive",
        });

      toast({
        description: res.message,
      });

      const searchParams = new URLSearchParams({
        callbackUrl: callbackUrl || "",
      });

      // Redirect user to the provided redirect URL or home page
      replaceHistory
        ? router.replace(`/sign-in?${searchParams.toString()}`)
        : router.push(`/sign-in?${searchParams.toString()}`);
    } catch (error) {
      toast({
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-2">
        <InputOTP
          maxLength={4}
          pattern={REGEXP_ONLY_DIGITS}
          value={form.watch("code")}
          onChange={handleChange}
          containerClassName="mx-auto"
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <>
              <InputOTPGroup key={index}>
                <InputOTPSlot index={index} className="size-14 text-xl" />
              </InputOTPGroup>
              {index !== 3 && <InputOTPSeparator />}
            </>
          ))}
        </InputOTP>
      </div>
      <p className="text-center uppercase font-medium">And</p>
      <Input
        type={"password"}
        label={"New Password"}
        placeholder="Enter your new password"
        labelPlacement="outside"
        size="lg"
        variant="bordered"
        isInvalid={!!form.formState.errors.password}
        {...form.register("password")}
        errorMessage={form.formState.errors.password?.message}
        classNames={{
          label: "font-medium text-black",
        }}
      />
      <Button
        type="submit"
        isDisabled={form.formState.isSubmitting}
        isLoading={form.formState.isSubmitting}
        size="lg"
        className="bg-green-500 text-white rounded-md font-medium"
      >
        {form.formState.isSubmitting ? "Verifying..." : "Verify"}
      </Button>
    </form>
  );
};

export default ForgotPasswordOtp;
