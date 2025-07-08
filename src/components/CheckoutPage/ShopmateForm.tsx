// "use client";

// import React from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { shopmateSchema } from "@/lib/schemas";
// import { useRouter } from "next/navigation";
// import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
// import { Button, Input } from "@nextui-org/react";
// // import { shopmateUsers, users } from '@/data/users'
// import UserAutocompleteCard from "./UserAutocompleteCard";
// import { Shopmate } from "@/lib/types";

// type ShopmateFormType = z.infer<typeof shopmateSchema>;

// type PropsType = {
//   vendorId?: string;
//   shopmateAgents?: Shopmate[] | null;
// };

// const ShopmateForm = ({ vendorId, shopmateAgents }: PropsType) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<ShopmateFormType>({
//     resolver: zodResolver(shopmateSchema),
//     mode: "onBlur",
//   });

//   const router = useRouter();

//   const onSubmit = (data: ShopmateFormType) => {
//     console.log(data);

//     const searchParams = new URLSearchParams({
//       step: "2",
//       shopmate: "true",
//       vendorId: vendorId || "",
//       ...data,
//     });

//     router.push(`/checkout?${searchParams.toString()}`);
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
//       <Autocomplete
//         label={<span className="font-medium">Email</span>}
//         labelPlacement="outside"
//         placeholder="Search for customer email"
//         size="lg"
//         isInvalid={!!errors.emailAddress}
//         {...register("emailAddress")}
//         errorMessage={errors.emailAddress?.message}
//         defaultItems={shopmateAgents || []}
//       >
//         {(shopmate) => (
//           <AutocompleteItem
//             key={shopmate._id || shopmate.admin.emailAddress}
//             textValue={shopmate.admin.emailAddress}
//           >
//             <UserAutocompleteCard user={shopmate} description="emailAddress" />
//           </AutocompleteItem>
//         )}
//       </Autocomplete>

//       <Input
//         type="tel"
//         label="Phone Number"
//         labelPlacement="outside"
//         placeholder="Enter customer phone number"
//         size="lg"
//         isInvalid={!!errors.phoneNumber}
//         {...register("phoneNumber")}
//         errorMessage={errors.phoneNumber?.message}
//         classNames={{
//           label: "font-medium",
//         }}
//       />
//       <Input
//         label="Shipping Address"
//         labelPlacement="outside"
//         placeholder="Enter customer shipping address"
//         size="lg"
//         isInvalid={!!errors.address}
//         {...register("address")}
//         errorMessage={errors.address?.message}
//         classNames={{
//           label: "font-medium",
//         }}
//       />

//       <Input
//         label="Delivery Note"
//         labelPlacement="outside"
//         placeholder="Enter delivery note"
//         size="lg"
//         isInvalid={!!errors.deliveryNote}
//         {...register("deliveryNote")}
//         errorMessage={errors.deliveryNote?.message}
//         classNames={{
//           label: "font-medium",
//         }}
//       />
//       <Button
//         type="submit"
//         isDisabled={isSubmitting}
//         isLoading={isSubmitting}
//         size="lg"
//         className="bg-green-500 text-white rounded-xl"
//       >
//         {isSubmitting ? "Submitting" : "Next"}
//       </Button>
//     </form>
//   );
// };

// export default ShopmateForm;

"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { XIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { shopmateSchema } from "@/lib/schemas";
import { useRouter } from "next/navigation";
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
} from "@nextui-org/react";
import { Shopmate, User } from "@/lib/types";
import { useDispatch } from "react-redux";
import { deliveryActions } from "@/redux-store/store-slices/DeliverySlice";
import { searchUser } from "@/lib/server-actions/user";

type ShopmateFormType = z.infer<typeof shopmateSchema>;

type PropsType = {
  vendorId?: string;
  shopmateId?: string;
  // shopmateAgents?: Shopmate[] | null;
  // onSearchUser?: (email: string) => Promise<User | null>;
};

const ShopmateForm = ({
  vendorId,
  shopmateId,
}: // shopmateAgents,
// onSearchUser,
PropsType) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchEmail, setSearchEmail] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<User | null>(null);
  const [userNotFound, setUserNotFound] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ShopmateFormType>({
    resolver: zodResolver(shopmateSchema),
    mode: "onBlur",
    defaultValues: {
      emailAddress: "",
      phoneNumber: "",
      deliveryNote: "",
      firstName: "",
      lastName: "",
    },
  });

  const handleSearchUser = async () => {
    if (!searchEmail) return;

    setIsSearching(true);
    setUserNotFound(false);
    setSearchResult(null);

    try {
      const user = await searchUser(searchEmail);
      setSearchResult(user.data);
      setUserNotFound(!user.data);

      if (user.data) {
        setValue("emailAddress", user.data.emailAddress, {
          shouldValidate: true,
        });
        setValue("phoneNumber", user.data.phoneNumber || "", {
          shouldValidate: true,
        });

        const nameParts = user.data.fullName.split(" ");
        setValue("firstName", nameParts[0] || "", {
          shouldValidate: true,
        });
        setValue("lastName", nameParts.slice(1).join(" ") || "", {
          shouldValidate: true,
        });
      }
    } catch (error) {
      console.error("Error searching for user:", error);
      setUserNotFound(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectUser = () => {
    if (searchResult) {
      setValue("emailAddress", searchResult.emailAddress, {
        shouldValidate: true,
      });
      setValue("phoneNumber", searchResult.phoneNumber || "", {
        shouldValidate: true,
      });

      const nameParts = searchResult.fullName.split(" ");
      setValue("firstName", nameParts[0] || "", {
        shouldValidate: true,
      });
      setValue("lastName", nameParts.slice(1).join(" ") || "", {
        shouldValidate: true,
      });
      // console.log("all values", getValues());
    }
    onClose();
  };

  const resetForm = () => {
    setValue("emailAddress", "");
    setValue("phoneNumber", "");
    setValue("deliveryNote", "");
    setValue("firstName", "");
    setValue("lastName", "");

    clearErrors();

    setSearchEmail("");
    setSearchResult(null);
    setUserNotFound(false);
    setIsSearching(false);
  };

  const onSubmit = (data: ShopmateFormType) => {
    console.log("Form submitted with data:", data);

    dispatch(
      deliveryActions.setOrderDetails({
        owner: {
          name: `${data.firstName} ${data.lastName}`.trim(),
          email: data.emailAddress,
          phoneNumber: data.phoneNumber,
        },
        orderNote: data.deliveryNote || "",
      })
    );

    const searchParams = new URLSearchParams({
      step: "2",
      shopmate: "true",
      vendorId: vendorId || "",
      shopmateId: shopmateId || "",
      ...data,
    });

    router.push(`/checkout?${searchParams.toString()}`);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="relative w-full">
          <Input
            label={<span className="font-medium">Email Address</span>}
            labelPlacement="outside"
            type="email"
            placeholder="Enter or search for customer email"
            size="lg"
            value={watch("emailAddress")}
            isInvalid={!!errors.emailAddress}
            isDisabled={!!searchResult?.emailAddress} // ✅ Disables only the input field
            {...register("emailAddress")}
            errorMessage={errors.emailAddress?.message}
            onChange={(e) => {
              setValue("emailAddress", e.target.value);
              trigger("emailAddress");
            }}
            classNames={{
              inputWrapper: !!searchResult?.emailAddress
                ? "bg-gray-100 cursor-not-allowed"
                : "",
              input: !!searchResult?.emailAddress ? "pointer-events-none" : "",
            }}
          />

          <div className="absolute top-1/2 right-2 transform -translate-y-[10%] flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="flat"
              color="primary"
              onClick={onOpen}
              className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded-md"
            >
              Search
            </Button>
            <Button
              type="button"
              size="sm"
              variant="light"
              color="danger"
              onClick={resetForm}
              isIconOnly
              className="text-red-500 hover:text-red-700"
            >
              <XIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            type="text"
            labelPlacement="outside"
            placeholder="Customer's first name"
            size="lg"
            value={watch("firstName")}
            isInvalid={!!errors.firstName}
            isDisabled={!!searchResult?.fullName}
            {...register("firstName")}
            errorMessage={errors.firstName?.message}
            onChange={(e) => {
              setValue("firstName", e.target.value);
              trigger("firstName");
            }}
            classNames={{
              label: "font-medium",
            }}
          />

          <Input
            label="Last Name"
            type="text"
            labelPlacement="outside"
            placeholder="Customer's last name"
            size="lg"
            value={watch("lastName")}
            isInvalid={!!errors.lastName}
            isDisabled={!!searchResult?.fullName}
            {...register("lastName")}
            errorMessage={errors.lastName?.message}
            onChange={(e) => {
              setValue("lastName", e.target.value);
              trigger("lastName");
            }}
            classNames={{
              label: "font-medium",
            }}
          />
        </div>

        <Input
          type="tel"
          label="Phone Number"
          labelPlacement="outside"
          placeholder="Enter customer phone number"
          size="lg"
          value={watch("phoneNumber")}
          isInvalid={!!errors.phoneNumber}
          isDisabled={!!searchResult?.phoneNumber}
          {...register("phoneNumber")}
          errorMessage={errors.phoneNumber?.message}
          onChange={(e) => {
            setValue("phoneNumber", e.target.value);
            trigger("phoneNumber");
          }}
          classNames={{
            label: "font-medium",
          }}
        />

        <Textarea
          placeholder="Add any special instructions for delivery (optional)"
          // value={deliveryNote}
          // onChange={handleDeliveryNoteChange}
          className="w-full"
          minRows={3}
          maxRows={5}
          variant="bordered"
          {...register("deliveryNote")}
          classNames={{
            label: "font-medium",
          }}
          errorMessage={errors.deliveryNote?.message}
          label="Delivery Note"
          labelPlacement="outside"
          isInvalid={!!errors.deliveryNote}
        />
        {/* <Input
          label="Delivery Note"
          labelPlacement="outside"
          placeholder="Enter delivery note (optional)"
          size="lg"
          isInvalid={!!errors.deliveryNote}
          {...register("deliveryNote")}
          errorMessage={errors.deliveryNote?.message}
          classNames={{
            label: "font-medium",
          }}
        /> */}

        <Button
          type="submit"
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
          size="lg"
          className="bg-green-500 text-white rounded-xl"
        >
          {isSubmitting ? "Processing..." : "Next"}
        </Button>
      </form>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Search Customer
              </ModalHeader>
              <ModalBody>
                <div className="flex gap-2">
                  <Input
                    fullWidth
                    type="email"
                    placeholder="Enter customer email"
                    value={searchEmail}
                    // onChange={(e) => setSearchEmail(e.target.value)}
                    onChange={(e) => {
                      setSearchEmail(e.target.value);
                      setSearchResult(null);
                      setUserNotFound(false);
                      setIsSearching(false);
                    }}
                  />
                  <Button
                    color="primary"
                    isLoading={isSearching}
                    onClick={handleSearchUser}
                  >
                    Search
                  </Button>
                </div>

                {userNotFound && !isSearching && (
                  <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
                    No customer found with this email. You can add them as a new
                    customer.
                  </div>
                )}

                {searchResult && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-lg">Customer Found:</h3>
                    <div className="grid grid-cols-2 gap-2 mt-2 h-full">
                      <div>
                        <p className="text-sm text-gray-500">Name:</p>
                        <p>{searchResult.fullName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email:</p>
                        <p className="break-words">
                          {searchResult.emailAddress}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone:</p>
                        <p className="break-words">
                          {searchResult.phoneNumber || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleSelectUser}
                  isDisabled={!searchResult}
                >
                  Use This Customer
                </Button>
                {userNotFound && (
                  <Button color="success" onPress={onClose}>
                    Add New Customer
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ShopmateForm;
