import React from 'react'
import { Metadata } from 'next'
import InfluencerClient from '@/components/General/Influencer'

export const metadata: Metadata = {
  title: 'Influencers',
  description: 'Join Komas as an Influencer',
}

const InfluencerPage = () => {
  return <InfluencerClient />
}

export default InfluencerPage
