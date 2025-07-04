'use client'

import React, { useEffect, useState } from 'react'
import { useEnable2FA, useDisable2FA } from '@/hooks/mutations'
import { useToast } from "@/hooks/use-toast";
import { Switch } from '@nextui-org/react'
import { cn } from '@/lib/utils'

const Toggle2FA = () => {
  const [enabled, setEnabled] = useState(false)
  const { mutateAsync: enable2FA, isPending: isEnabling } = useEnable2FA()
  const { mutateAsync: disable2FA, isPending: isDisabling } = useDisable2FA()
  const { toast } = useToast()

  const handleEnable2FA = async () => { 
    const res = await enable2FA()

    if (res.hasError) {
      setEnabled(false)
      return toast({ description: res.message, variant: 'destructive' })
    }

    localStorage.setItem("is2FAEnabled", "true");
    
    toast({ description: res.message })
  }

  const handleDisable2FA = async () => {
    const res = await disable2FA()

    if (res.hasError) {
      setEnabled(true)
      return toast({ description: res.message, variant: 'destructive'})
    }

    localStorage.setItem("is2FAEnabled", "false");

    toast({ description: res.message })
  }

  const handleToggle = (checked: boolean) => {
    setEnabled(checked)
    checked ? handleEnable2FA() : handleDisable2FA()
  }

  useEffect(() => {
    const isEnabled = localStorage.getItem('is2FAEnabled') === 'true'
    setEnabled(isEnabled)
  }, [])

  return (
    <Switch
      isSelected={enabled}
      onValueChange={handleToggle}
      isDisabled={isEnabling || isDisabling}
      classNames={{
        base: cn(
          "inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center",
          "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
          "data-[selected=true]:border-green-500"
        ),
        wrapper: "p-0 h-4 overflow-visible",
        thumb: cn(
          "w-6 h-6 border-2 shadow-lg",
          "group-data-[hover=true]:border-green-500",
          //selected
          "group-data-[selected=true]:ml-6",
          // pressed
          "group-data-[pressed=true]:w-7",
          "group-data-[selected]:group-data-[pressed]:ml-4"
        ),
      }}
    >
      <div className="flex flex-col gap-1">
        <p className="text-medium">Enable 2FA</p>
        <p className="text-tiny text-default-400">
          Enable 2-Factor Authentication for extra security.
        </p>
      </div>
    </Switch>
  );
}

export default Toggle2FA