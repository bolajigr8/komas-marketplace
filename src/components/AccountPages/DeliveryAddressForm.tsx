// "use client";

// import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
// import {
//   DeliveryAddress,
//   deliveryActions,
// } from "@/redux-store/store-slices/DeliverySlice";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { generateRandomId } from "@/lib/utils";
// import { shippingSchema } from "@/lib/schemas";
// import { useToast } from "@/hooks/use-toast";
// import { Button, Input } from "@nextui-org/react";
// import { useSession } from "next-auth/react";

// type FormData = z.infer<typeof shippingSchema>;

// interface Props {
//   action: "add" | "edit";
//   addressId?: string;
//   isIntercepted?: boolean;
// }

// const DeliveryAddressForm = ({ action, addressId, isIntercepted }: Props) => {
//   const { data: session } = useSession();
//   const user = session?.user;
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const dispatch = useAppDispatch();
//   const { toast } = useToast();
//   const router = useRouter();

//   const addressList = useAppSelector((state) => state.delivery.addressList);
//   const selectedAddress = addressList.find(
//     (address) => address.id === addressId
//   );

//   const defaultValues = {
//     firstName:
//       selectedAddress?.firstName || user?.fullName?.split(" ")[0] || "",
//     lastName: selectedAddress?.lastName || user?.fullName?.split(" ")[1] || "",
//     emailAddress: selectedAddress?.emailAddress || user?.emailAddress || "",
//     phoneNumber: selectedAddress?.phoneNumber || user?.phoneNumber || "",
//     houseNumber: selectedAddress?.houseNumber || "",
//     address: selectedAddress?.address || "",
//     city: selectedAddress?.city || "",
//     state: selectedAddress?.state || "",
//     country: selectedAddress?.country || "",
//     postCode: selectedAddress?.postCode || "",
//   };

//   const form = useForm<FormData>({
//     resolver: zodResolver(shippingSchema),
//     defaultValues,
//     mode: "onChange",
//   });

//   const onSubmit = async (data: FormData) => {
//     try {
//       setIsSubmitting(true);

//       const deliveryAddress: DeliveryAddress = {
//         id: action === "add" ? generateRandomId(15) : addressId || "",
//         ...data,
//         houseNumber: data.houseNumber || "",
//         isDefault:
//           action === "add"
//             ? addressList.length === 0
//             : selectedAddress?.isDefault || false,
//       };

//       if (action === "add") {
//         dispatch(deliveryActions.addDeliveryAddress(deliveryAddress));
//         // If delivery details exist and method is home delivery, update address
//         const deliveryDetails = useAppSelector(
//           (state) => state.delivery.deliveryDetails
//         );
//         if (
//           deliveryDetails &&
//           deliveryDetails.deliveryMethod.category === "home"
//         ) {
//           dispatch(deliveryActions.setSelectedAddress(deliveryAddress.id));
//         }
//         toast({ description: "Address added successfully" });
//       } else {
//         dispatch(deliveryActions.editDeliveryAddress(deliveryAddress));
//         // If this is the selected address and delivery method is home, update delivery details
//         const selectedAddressId = useAppSelector(
//           (state) => state.delivery.selectedAddressId
//         );
//         const deliveryDetails = useAppSelector(
//           (state) => state.delivery.deliveryDetails
//         );
//         if (
//           selectedAddressId === addressId &&
//           deliveryDetails &&
//           deliveryDetails.deliveryMethod.category === "home"
//         ) {
//           dispatch(deliveryActions.setSelectedAddress(deliveryAddress.id));
//         }
//         toast({ description: "Address updated successfully" });
//       }

//       isIntercepted ? router.back() : router.refresh();
//     } catch (error) {
//       toast({
//         description: "An error occurred. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={form.handleSubmit(onSubmit)}
//       className="flex flex-col w-full gap-4 bg-white"
//     >
//       <div className="flex flex-col gap-4">
//         {[
//           { name: "firstName", label: "First Name", type: "text" },
//           { name: "lastName", label: "Last Name", type: "text" },
//           { name: "emailAddress", label: "Email", type: "email" },
//           { name: "phoneNumber", label: "Phone Number", type: "tel" },
//           { name: "houseNumber", label: "House Number", type: "text" },
//           { name: "postCode", label: "Postal Code", type: "text" },
//           { name: "address", label: "Address", type: "text" },
//           { name: "city", label: "City", type: "text" },
//           { name: "state", label: "State", type: "text" },
//           { name: "country", label: "Country", type: "text" },
//         ].map((field) => (
//           <Input
//             key={field.name}
//             type={field.type}
//             label={field.label}
//             labelPlacement="outside"
//             placeholder={field.label}
//             size="lg"
//             isInvalid={!!form.formState.errors[field.name as keyof FormData]}
//             {...form.register(field.name as keyof FormData)}
//             errorMessage={
//               form.formState.errors[field.name as keyof FormData]?.message
//             }
//             classNames={{
//               label: "font-medium",
//             }}
//           />
//         ))}
//       </div>

//       <Button
//         type="submit"
//         size="lg"
//         isDisabled={!form.formState.isDirty || isSubmitting}
//         isLoading={isSubmitting}
//         className={`w-full md:w-[75%] text-white mx-auto my-4 ${
//           !form.formState.isDirty || isSubmitting
//             ? "bg-green-300"
//             : "bg-green-500"
//         }`}
//       >
//         {isSubmitting ? "Submitting" : "Continue"}
//       </Button>
//     </form>
//   );
// };

// export default DeliveryAddressForm;

"use client";

import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import {
  DeliveryAddress,
  deliveryActions,
} from "@/redux-store/store-slices/DeliverySlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateRandomId } from "@/lib/utils";
import { shippingSchema } from "@/lib/schemas";
import { useToast } from "@/hooks/use-toast";
import { Button, Input } from "@nextui-org/react";
import { useSession } from "next-auth/react";

type FormData = z.infer<typeof shippingSchema>;

interface Props {
  action: "add" | "edit";
  addressId?: string;
  isIntercepted?: boolean;
  onSuccess?: () => void;
}

const DeliveryAddressForm = ({
  action,
  addressId,
  isIntercepted,
  onSuccess,
}: Props) => {
  const { data: session } = useSession();
  const user = session?.user;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();

  const addressList = useAppSelector((state) => state.delivery.addressList);
  const selectedAddressId = useAppSelector(
    (state) => state.delivery.selectedAddressId
  );
  const deliveryDetails = useAppSelector(
    (state) => state.delivery.deliveryDetails
  );

  const selectedAddress = addressList.find(
    (address) => address.id === addressId
  );

  // console.log("list", addressList);
  // console.log("selected", selectedAddress);
  // console.log("selected id", selectedAddressId);
  // console.log("details", deliveryDetails);
  const defaultValues = {
    firstName:
      selectedAddress?.firstName || user?.fullName?.split(" ")[0] || "",
    lastName: selectedAddress?.lastName || user?.fullName?.split(" ")[1] || "",
    emailAddress: selectedAddress?.emailAddress || user?.emailAddress || "",
    phoneNumber: selectedAddress?.phoneNumber || user?.phoneNumber || "",
    houseNumber: selectedAddress?.houseNumber || "",
    address: selectedAddress?.address || "",
    city: selectedAddress?.city || "",
    state: selectedAddress?.state || "",
    country: selectedAddress?.country || "",
    postCode: selectedAddress?.postCode || "",
  };

  const form = useForm<FormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues,
    mode: "all",
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      const deliveryAddress: DeliveryAddress = {
        id: action === "add" ? generateRandomId(15) : addressId || "",
        ...data,
        houseNumber: data.houseNumber || "",
        isDefault:
          action === "add"
            ? addressList.length === 0
            : selectedAddress?.isDefault || false,
      };

      if (action === "add") {
        dispatch(deliveryActions.addDeliveryAddress(deliveryAddress));

        // Check if we need to set this as selected address
        if (
          deliveryDetails &&
          deliveryDetails.deliveryMethod.category === "home"
        ) {
          dispatch(deliveryActions.setSelectedAddress(deliveryAddress.id));
        }

        toast({ description: "Address added successfully" });
      } else {
        dispatch(deliveryActions.editDeliveryAddress(deliveryAddress));

        // Update selected address if needed
        if (
          selectedAddressId === addressId &&
          deliveryDetails &&
          deliveryDetails.deliveryMethod.category === "home"
        ) {
          dispatch(deliveryActions.setSelectedAddress(deliveryAddress.id));
        }

        toast({ description: "Address updated successfully" });
      }

      // Properly handle success callback
      if (isIntercepted && onSuccess) {
        // Add a small delay to ensure Redux state updates complete
        setTimeout(() => {
          onSuccess();
        }, 100);
      } else {
        router.refresh();
      }
    } catch (error) {
      toast({
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col w-full gap-4 bg-white"
    >
      <div className="flex flex-col gap-4">
        {[
          { name: "firstName", label: "First Name", type: "text" },
          { name: "lastName", label: "Last Name", type: "text" },
          { name: "emailAddress", label: "Email", type: "email" },
          { name: "phoneNumber", label: "Phone Number", type: "tel" },
          { name: "houseNumber", label: "House Number", type: "text" },
          { name: "postCode", label: "Postal Code", type: "text" },
          { name: "address", label: "Address", type: "text" },
          { name: "city", label: "City", type: "text" },
          { name: "state", label: "State", type: "text" },
          { name: "country", label: "Country", type: "text" },
        ].map((field) => (
          <Input
            key={field.name}
            type={field.type}
            label={field.label}
            labelPlacement="outside"
            placeholder={field.label}
            size="lg"
            isInvalid={!!form.formState.errors[field.name as keyof FormData]}
            {...form.register(field.name as keyof FormData)}
            errorMessage={
              form.formState.errors[field.name as keyof FormData]?.message
            }
            classNames={{
              label: "font-medium",
            }}
          />
        ))}
      </div>

      <Button
        type="submit"
        size="lg"
        isDisabled={!form.formState.isValid || isSubmitting}
        isLoading={isSubmitting}
        spinner={isSubmitting}
        className={`w-full md:w-[75%] text-white mx-auto my-4 ${
          !form.formState.isValid || isSubmitting
            ? "bg-green-300"
            : "bg-green-500"
        }`}
      >
        {isSubmitting ? "Submitting..." : "Continue"}
      </Button>
    </form>
  );
};

export default DeliveryAddressForm;
