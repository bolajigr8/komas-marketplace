'use client'

import { disable2FA, enable2FA } from "@/lib/server-actions/auth"
import { useMutation } from "@tanstack/react-query"

export const useEnable2FA = () => {
  return useMutation({
    mutationFn: enable2FA,
  })
}

export const useDisable2FA = () => { 
  return useMutation({
    mutationFn: disable2FA,
  })
}