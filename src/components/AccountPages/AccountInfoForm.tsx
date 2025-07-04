// "use client";

// import { useForm } from "react-hook-form";
// import React from "react";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Select, SelectItem } from "@nextui-org/select";
// import { accountSchema } from "@/lib/schemas";
// import { User } from "@/lib/types";
// import { useToast } from "@/hooks/use-toast";
// import { useRouter } from "next/navigation";
// import { updateUser } from "@/lib/server-actions/user";
// import { Button, DatePicker, Input } from "@nextui-org/react";
// import {
//   DateValue,
//   parseDate,
//   getLocalTimeZone,
// } from "@internationalized/date";
// import Toggle2FA from "./Toggle2FA";
// import { useSession } from "next-auth/react";
// import { handleRevalidatePath } from "@/lib/server-actions";

// type FormData = z.infer<typeof accountSchema>;

// type PropsType = {
//   user: User | null;
//   isIntercepted?: boolean;
// };

// const AccountInfoForm = ({ user, isIntercepted }: PropsType) => {
//   const form = useForm<FormData>({
//     resolver: zodResolver(accountSchema),
//     defaultValues: {
//       firstName: user?.fullName.split(" ")[0],
//       lastName: user?.fullName.split(" ")[1],
//       emailAddress: user?.emailAddress,
//       phoneNumber: user?.phoneNumber,
//       gender: user?.gender || "",
//       dateOfBirth: user?.dateOfBirth || new Date().toString(),
//       address: user?.address || "",
//       postCode: user?.postCode || "",
//       state: user?.state || "",
//       country: user?.country || "",
//     },
//     mode: "all",
//   });

//   const { data: session, update } = useSession();
//   const { toast } = useToast();
//   const router = useRouter();

//   const onSubmit = async (data: FormData) => {
//     // Call updateUser API with user data and form data
//     const res = await updateUser({
//       ...user,
//       ...data,
//       fullName: `${data.firstName} ${data.lastName || ""}`,
//     });

//     // If there is an error in the response, show an error toast message
//     if (res.hasError)
//       return toast({ description: res.message, variant: "destructive" });

//     // Dispatch an action to update user data with the response data
//     update({
//       ...session,
//       user: {
//         ...user,
//         ...data,
//         fullName: `${data.firstName} ${data.lastName || ""}`,
//       },
//     });

//     // Show a success toast message for updating account info
//     toast({ description: "Account info updated" });

//     // Reset the form after submission
//     form.reset(data);

//     // Revalidate the profile layout
//     handleRevalidatePath("/account/profile", "layout");

//     // Close the modal if intercepted, otherwise refresh the router
//     isIntercepted ? router.back() : router.refresh();
//   };

//   const handleDateChange = (value: DateValue) => {
//     if (!value) return;

//     const date = value.toDate(getLocalTimeZone()).toLocaleDateString();

//     form.setValue("dateOfBirth", date);
//   };

//   return (
//     <form
//       onSubmit={form.handleSubmit(onSubmit)}
//       className="flex flex-col gap-4"
//     >
//       <div className="flex flex-col gap-4">
//         <Input
//           label="First Name"
//           labelPlacement="outside"
//           placeholder="First Name"
//           size="lg"
//           isInvalid={!!form.formState.errors.firstName}
//           {...form.register("firstName")}
//           errorMessage={form.formState.errors.firstName?.message}
//           classNames={{
//             label: "font-medium",
//           }}
//         />

//         <Input
//           label="Last Name"
//           labelPlacement="outside"
//           placeholder="Last Name"
//           size="lg"
//           isInvalid={!!form.formState.errors.lastName}
//           errorMessage={form.formState.errors.lastName?.message}
//           {...form.register("lastName")}
//           classNames={{
//             label: "font-medium",
//           }}
//         />

//         <Input
//           type="email"
//           label="Email"
//           labelPlacement="outside"
//           placeholder="Email"
//           size="lg"
//           isInvalid={!!form.formState.errors.emailAddress}
//           errorMessage={form.formState.errors.emailAddress?.message}
//           {...form.register("emailAddress")}
//           classNames={{
//             label: "font-medium",
//           }}
//         />

//         <Input
//           type="tel"
//           label="Phone Number"
//           labelPlacement="outside"
//           placeholder="Phone Number"
//           size="lg"
//           isInvalid={!!form.formState.errors.phoneNumber}
//           errorMessage={form.formState.errors.phoneNumber?.message}
//           {...form.register("phoneNumber")}
//           classNames={{
//             label: "font-medium",
//           }}
//         />

//         <Select
//           label="Select a gender"
//           selectedKeys={[form.watch("gender")]}
//           onSelectionChange={({ currentKey }) =>
//             form.setValue("gender", currentKey as any)
//           }
//           labelPlacement="outside"
//           size="lg"
//           isInvalid={!!form.formState.errors.gender}
//           errorMessage={form.formState.errors.gender?.message}
//           classNames={{
//             label: "font-medium",
//           }}
//         >
//           {["Male", "Female"].map((gender) => (
//             <SelectItem key={gender.toLowerCase()}>{gender}</SelectItem>
//           ))}
//         </Select>

//         <DatePicker
//           label="Date of Birth"
//           labelPlacement="outside"
//           size="lg"
//           showMonthAndYearPickers
//           value={parseDate(
//             new Date(form.watch("dateOfBirth")).toISOString().split("T")[0]
//           )}
//           classNames={{
//             label: "font-medium",
//           }}
//           {...form.register("dateOfBirth")}
//           onChange={handleDateChange}
//           isInvalid={!!form.formState.errors.dateOfBirth}
//           errorMessage={form.formState.errors.dateOfBirth?.message}
//         />

//         <Input
//           label="Address"
//           labelPlacement="outside"
//           placeholder="Address"
//           size="lg"
//           isInvalid={!!form.formState.errors.address}
//           errorMessage={form.formState.errors.address?.message}
//           classNames={{
//             label: "font-medium",
//           }}
//           {...form.register("address")}
//         />

//         <Input
//           label="Postal Code"
//           labelPlacement="outside"
//           placeholder="Postal Code"
//           size="lg"
//           isInvalid={!!form.formState.errors.postCode}
//           errorMessage={form.formState.errors.postCode?.message}
//           {...form.register("postCode")}
//           classNames={{
//             label: "font-medium",
//           }}
//         />

//         <Input
//           label="State"
//           labelPlacement="outside"
//           placeholder="State"
//           size="lg"
//           isInvalid={!!form.formState.errors.state}
//           errorMessage={form.formState.errors.state?.message}
//           {...form.register("state")}
//           classNames={{
//             label: "font-medium",
//           }}
//         />

//         <Input
//           label="Country"
//           labelPlacement="outside"
//           placeholder="Country"
//           size="lg"
//           isInvalid={!!form.formState.errors.country}
//           errorMessage={form.formState.errors.country?.message}
//           {...form.register("country")}
//           classNames={{
//             label: "font-medium",
//           }}
//         />
//         <Toggle2FA />
//       </div>
//       <Button
//         type="submit"
//         isDisabled={!form.formState.isDirty || form.formState.isSubmitting}
//         isLoading={form.formState.isSubmitting}
//         size="lg"
//         className="text-white bg-green-500"
//       >
//         {form.formState.isSubmitting ? "Updating" : "Save"}
//       </Button>
//     </form>
//   );
// };

// export default AccountInfoForm;

"use client";

import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectItem } from "@nextui-org/select";
import { accountSchema } from "@/lib/schemas";
import { User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { updateUser } from "@/lib/server-actions/user";
import { Button, DatePicker, Input, Tabs, Tab, Card } from "@nextui-org/react";
import {
  DateValue,
  parseDate,
  getLocalTimeZone,
} from "@internationalized/date";
import Toggle2FA from "./Toggle2FA";
import { useSession } from "next-auth/react";
import { handleRevalidatePath } from "@/lib/server-actions";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import { RootState } from "@/redux-store/store";
import { deliveryActions } from "@/redux-store/store-slices/DeliverySlice";

type FormData = z.infer<typeof accountSchema>;

type PropsType = {
  user: User | null;
  isIntercepted?: boolean;
};

const AccountInfoForm = ({ user, isIntercepted }: PropsType) => {
  const dispatch = useAppDispatch();
  const deliveryAddresses = useAppSelector(
    (state: RootState) => state.delivery.addressList
  );
  const [selectedTab, setSelectedTab] = useState("personal");
  const { data: session, update } = useSession();
  const [city, setCity] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      firstName: user?.fullName?.split(" ")[0] || "",
      lastName: user?.fullName?.split(" ")[1] || "",
      emailAddress: user?.emailAddress || "",
      phoneNumber: user?.phoneNumber || "",
      gender: user?.gender || "",
      dateOfBirth: user?.dateOfBirth || new Date().toISOString().split("T")[0],
      address: user?.address || "",
      postCode: user?.postCode || "",
      state: user?.state || "",
      country: user?.country || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (user) {
      const [firstName, ...lastNameParts] = user.fullName?.split(" ") || [
        "",
        "",
      ];
      form.reset({
        firstName: firstName || "",
        lastName: lastNameParts.join(" ") || "",
        emailAddress: user.emailAddress || "",
        phoneNumber: user.phoneNumber || "",
        gender: user.gender || "",
        dateOfBirth: user.dateOfBirth || new Date().toISOString().split("T")[0],
        address: user.address || "",
        postCode: user.postCode || "",
        state: user.state || "",
        country: user.country || "",
      });
    }
  }, [user, form]);

  const handleDateChange = (value: DateValue) => {
    if (!value) return;
    const date = value.toDate(getLocalTimeZone()).toISOString().split("T")[0];
    form.setValue("dateOfBirth", date, { shouldValidate: true });
  };

  const onSubmit = async (data: FormData) => {
    try {
      const formattedData = {
        ...user,
        ...data,
        address: `${data.address}, ${city}`,
        fullName: `${data.firstName} ${data.lastName || ""}`.trim(),
      };

      const res = await updateUser(formattedData);

      if (res.hasError) {
        toast({ description: res.message, variant: "destructive" });
        return;
      }

      const existingAddress = deliveryAddresses.find(
        (addr) => addr.id === user?._id
      );
      if (existingAddress && data.address !== user?.address) {
        dispatch(
          deliveryActions.editDeliveryAddress({
            ...existingAddress,
            address: data.address,
            state: data.state,
            city: city || existingAddress.city,
          })
        );
      } else if (!existingAddress && data.address) {
        dispatch(
          deliveryActions.addDeliveryAddress({
            id: user?._id || "",
            firstName: data.firstName,
            lastName: data.lastName || "",
            emailAddress: data.emailAddress,
            phoneNumber: data.phoneNumber || "",
            houseNumber: "",
            address: data.address,
            state: data.state,
            country: data.country || "",
            postCode: data.postCode || "",
            city: city,
            isDefault: deliveryAddresses.length === 0,
          })
        );
      }
      update({
        ...session,
        user: formattedData,
      });

      toast({ description: "Account information updated successfully" });
      handleRevalidatePath("/account/profile", "layout");

      isIntercepted ? router.back() : router.refresh();
    } catch (error) {
      toast({
        description: "Failed to update account info",
        variant: "destructive",
      });
    }
  };

  const isDirty = form.formState.isDirty;
  const errors = Object.keys(form.formState.errors).length > 0;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <Tabs
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(key as string)}
        color="success"
        className="w-full"
      >
        <Tab key="personal" title="Personal Information">
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                labelPlacement="outside"
                placeholder="Enter your first name"
                size="lg"
                isInvalid={!!form.formState.errors.firstName}
                errorMessage={form.formState.errors.firstName?.message}
                {...form.register("firstName")}
                classNames={{
                  label: "font-medium",
                  input: "bg-transparent",
                }}
              />

              <Input
                label="Last Name"
                labelPlacement="outside"
                placeholder="Enter your last name"
                size="lg"
                isInvalid={!!form.formState.errors.lastName}
                errorMessage={form.formState.errors.lastName?.message}
                {...form.register("lastName")}
                classNames={{
                  label: "font-medium",
                  input: "bg-transparent",
                }}
              />

              <Input
                type="email"
                label="Email Address"
                labelPlacement="outside"
                placeholder="your.email@example.com"
                size="lg"
                isInvalid={!!form.formState.errors.emailAddress}
                errorMessage={form.formState.errors.emailAddress?.message}
                {...form.register("emailAddress")}
                classNames={{
                  label: "font-medium",
                  input: "bg-transparent",
                }}
              />

              <Input
                type="tel"
                label="Phone Number"
                labelPlacement="outside"
                placeholder="+1 234 567 8900"
                size="lg"
                startContent={<span className="text-gray-400">+</span>}
                isInvalid={!!form.formState.errors.phoneNumber}
                errorMessage={form.formState.errors.phoneNumber?.message}
                {...form.register("phoneNumber")}
                classNames={{
                  label: "font-medium",
                  input: "bg-transparent",
                }}
              />

              <Select
                label="Gender"
                placeholder="Select your gender"
                selectedKeys={
                  form.watch("gender") ? [form.watch("gender")] : []
                }
                onSelectionChange={({ currentKey }) => {
                  const gender = currentKey as "" | "male" | "female";
                  form.setValue("gender", gender, {
                    shouldValidate: true,
                  });
                }}
                labelPlacement="outside"
                size="lg"
                isInvalid={!!form.formState.errors.gender}
                errorMessage={form.formState.errors.gender?.message}
                classNames={{
                  label: "font-medium",
                  trigger: "bg-transparent",
                }}
              >
                <SelectItem key="male">Male</SelectItem>
                <SelectItem key="female">Female</SelectItem>
              </Select>

              <DatePicker
                label="Date of Birth"
                labelPlacement="outside"
                size="lg"
                showMonthAndYearPickers
                value={parseDate(
                  form.watch("dateOfBirth") ||
                    new Date().toISOString().split("T")[0]
                )}
                onChange={handleDateChange}
                isInvalid={!!form.formState.errors.dateOfBirth}
                errorMessage={form.formState.errors.dateOfBirth?.message}
                classNames={{
                  label: "font-medium",
                }}
              />
            </div>
          </Card>
        </Tab>

        <Tab key="address" title="Address Information">
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Address"
                labelPlacement="outside"
                placeholder="Enter your street address"
                size="lg"
                isInvalid={!!form.formState.errors.address}
                errorMessage={form.formState.errors.address?.message}
                {...form.register("address")}
                classNames={{
                  label: "font-medium",
                  input: "bg-transparent",
                }}
              />

              <Input
                label="City"
                labelPlacement="outside"
                placeholder="Enter your city name"
                size="lg"
                isInvalid={!!form.formState.errors.address}
                errorMessage={form.formState.errors.address?.message}
                // {...form.register("city")}
                onChange={(e) => setCity(e.target.value)}
                classNames={{
                  label: "font-medium",
                  input: "bg-transparent",
                }}
              />
              <Input
                label="Postal Code"
                labelPlacement="outside"
                placeholder="Enter postal/zip code"
                size="lg"
                isInvalid={!!form.formState.errors.postCode}
                errorMessage={form.formState.errors.postCode?.message}
                {...form.register("postCode")}
                classNames={{
                  label: "font-medium",
                  input: "bg-transparent",
                }}
              />

              <Input
                label="State/Province"
                labelPlacement="outside"
                placeholder="Enter your state or province"
                size="lg"
                isInvalid={!!form.formState.errors.state}
                errorMessage={form.formState.errors.state?.message}
                {...form.register("state")}
                classNames={{
                  label: "font-medium",
                  input: "bg-transparent",
                }}
              />

              <Input
                label="Country"
                labelPlacement="outside"
                placeholder="Enter your country"
                size="lg"
                isInvalid={!!form.formState.errors.country}
                errorMessage={form.formState.errors.country?.message}
                {...form.register("country")}
                classNames={{
                  label: "font-medium",
                  input: "bg-transparent",
                }}
              />
            </div>
          </Card>
        </Tab>

        <Tab key="security" title="Security">
          <Card className="p-4">
            <Toggle2FA />
          </Card>
        </Tab>
      </Tabs>

      <div className="flex flex-col gap-2">
        {errors && (
          <p className="text-red-500 text-sm">
            Please fix validation errors before saving
          </p>
        )}

        <Button
          type="submit"
          isDisabled={!isDirty || errors || form.formState.isSubmitting}
          isLoading={form.formState.isSubmitting}
          size="lg"
          className="text-white bg-green-500 hover:bg-green-600 transition-colors"
        >
          {form.formState.isSubmitting ? "Saving Changes..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default AccountInfoForm;
