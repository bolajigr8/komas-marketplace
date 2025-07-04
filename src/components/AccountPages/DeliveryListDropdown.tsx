import { DeliveryAddress } from "@/redux-store/store-slices/DeliverySlice";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@nextui-org/react";
import { ChevronDown, Edit, MapPin, Plus, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux-store/hooks";
import { deliveryActions } from "@/redux-store/store-slices/DeliverySlice";

type DeliveryListDropdownProps = {
  addresses: DeliveryAddress[];
  selectedAddressId: string | null;
  onSelectAddress: (addressId: string) => void;
};

const DeliveryListDropdown = ({
  addresses,
  selectedAddressId,
  onSelectAddress,
}: DeliveryListDropdownProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const selectedAddress = addresses.find(
    (addr) => addr.id === selectedAddressId
  );

  const handleSetDefault = (addressId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(deliveryActions.setDefaultAddress(addressId));
  };

  const handleEditAddress = (addressId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/account/profile/edit/delivery-address/${addressId}`);
  };

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button
          variant="bordered"
          className="text-sm p-2 border-green-500 text-green-500"
          endContent={<ChevronDown size={16} />}
        >
          {selectedAddress ? "Change Address" : "Select Address"}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Delivery Addresses"
        className="w-[300px] max-h-[400px] overflow-y-auto"
      >
        <DropdownSection title="Your Addresses" showDivider>
          {addresses.map((address) => (
            <DropdownItem
              key={address.id}
              startContent={<MapPin size={16} className="text-gray-500" />}
              endContent={
                <div className="flex items-center gap-2">
                  {!address.isDefault && (
                    <Button
                      size="sm"
                      variant="light"
                      className="min-w-0 p-1"
                      onClick={(e) => handleSetDefault(address.id, e)}
                      title="Set as default"
                    >
                      <Star size={16} className="text-gray-400" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="light"
                    className="min-w-0 p-1"
                    onClick={(e) => handleEditAddress(address.id, e)}
                    title="Edit address"
                  >
                    <Edit size={16} className="text-gray-400" />
                  </Button>
                </div>
              }
              onClick={() => onSelectAddress(address.id)}
              description={`${address.houseNumber} ${address.address}, ${address.city}, ${address.state}`}
              className={`py-2 ${
                selectedAddressId === address.id ? "bg-green-50" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {address.firstName} {address.lastName}
                </span>
                {address.isDefault && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    Default
                  </span>
                )}
              </div>
            </DropdownItem>
          ))}
        </DropdownSection>

        <DropdownItem
          key="add-new"
          className="py-2 text-primary"
          startContent={<Plus size={16} />}
          onClick={() =>
            router.push("/account/profile/edit/delivery-address/add")
          }
        >
          Add New Address
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default DeliveryListDropdown;
