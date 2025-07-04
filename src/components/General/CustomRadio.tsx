import React from "react";
import { Radio, RadioProps } from "@nextui-org/radio";
import { cn } from "@/lib/utils";

const CustomRadio = ({ children, ...props }: RadioProps) => {
  return (
    <Radio
      {...props}
      classNames={{
        ...props.classNames,
        base: cn(
          "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
          "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
          "data-[selected=true]:border-primary",
          props.classNames?.base
        ),
      }}
    >
      {children}
    </Radio>
  );
};

export default CustomRadio;
