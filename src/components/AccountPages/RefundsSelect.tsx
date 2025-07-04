'use client'

import React, { useState } from 'react'
import { Select, SelectSection, SelectItem } from "@nextui-org/select";
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { SharedSelection } from '@nextui-org/react';

const refundsOptions = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
]

type PropsType = {
  status?: string
}

const RefundsSelect = ({ status }: PropsType) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selected, setSelected] = useState(status || 'all')
  const handleValueChange = (value: SharedSelection) => {
    const { currentKey } = value

    setSelected(currentKey || '')

    const newLink = currentKey !== 'all' && currentKey !== undefined
      ? formUrlQuery({
          params: searchParams.toString(),
          keys: ["status"],
          values: [currentKey],
        })
      : removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["status"],
        });

    router.push(newLink, { scroll: false })
  }

  return (
    <Select
      label="Filter by"
      className="max-w-[200px]"
      selectedKeys={[selected]}
      onSelectionChange={handleValueChange}
      labelPlacement='outside-left'
      classNames={{
        label: 'text-nowrap font-medium my-auto'
      }}
    >
      {refundsOptions.map((option) => (
        <SelectItem key={option.value}>{option.label}</SelectItem>
      ))}
    </Select>
  );
}

export default RefundsSelect