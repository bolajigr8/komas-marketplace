'use client'

import React, { Key } from 'react'
import { RxDotsVertical } from 'react-icons/rx'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from '@nextui-org/dropdown'
import { Button } from '@nextui-org/react'
import { useRouter } from 'next/navigation'

interface OrderCardControlsProps {
  id: string
}

const OrderCardControls = ({ id }: OrderCardControlsProps) => {
  const router = useRouter()

  const handleActions = (key: Key) => {
    switch (key) {
      case 'view-details':
        router.push(`/account/view-details?orderId=${id}`)

        break
      case 'track-order':
        router.push(`/account/track-order?orderId=${id}`)

        break
      case 'cancel-order':
        console.log('Triggering cancel confirmation...')

        break
      default:
        console.log('Unhandled action:', key)
    }
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant='ghost'>
          <RxDotsVertical />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label='Order Actions' onAction={handleActions}>
        <DropdownItem key='view-details'>View Details</DropdownItem>
        <DropdownItem key='track-order'>Track Order</DropdownItem>
        <DropdownItem key='cancel-order' className='text-danger' color='danger'>
          Cancel Order
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

export default OrderCardControls
