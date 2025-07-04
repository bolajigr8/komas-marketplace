import React, { Suspense } from "react";
import Loader from "../General/Loader";
import { Input } from "@nextui-org/react";
import { auth } from "@/auth";
import DeliveryAddressManager from "./DeliveryAddressManager";

type PropsType = {
  controls?: React.ReactNode;
};

const AccountInfoDisplay = ({ controls }: PropsType) => {
  return (
    <div className="flex flex-col gap-6 p-4 rounded-xl border">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Account Information</h2>
        {controls}
      </div>
      <Suspense
        fallback={
          <div className="w-full h-[250px] flex items-center justify-center">
            <Loader className="!w-6" />
          </div>
        }
      >
        <AccountInfo />
      </Suspense>
    </div>
  );
};

const AccountInfo = async () => {
  const session = await auth();

  const user = session?.user;
  return (
    <div className="flex flex-col gap-4">
      <Input
        label="First Name"
        labelPlacement="outside"
        defaultValue={user?.fullName.split(" ")[0]}
        isReadOnly
        size="lg"
        classNames={{ label: "font-medium" }}
      />
      <Input
        label="Last Name"
        labelPlacement="outside"
        defaultValue={user?.fullName.split(" ")[1]}
        isReadOnly
        size="lg"
        classNames={{ label: "font-medium" }}
      />
      <Input
        label="Email"
        labelPlacement="outside"
        defaultValue={user?.emailAddress}
        isReadOnly
        size="lg"
        classNames={{ label: "font-medium" }}
      />
    </div>
  );
};

export default AccountInfoDisplay;
