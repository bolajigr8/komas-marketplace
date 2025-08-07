import React, { useState, useEffect } from 'react'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
} from '@nextui-org/react'
import { fetchPickupStations } from '@/lib/server-actions/pickup'
import { PickupStation } from '@/lib/types'

type PickupStationProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectStation: (station: {
    name: string
    address: string
    city?: string
    state?: string
    id: string
    postCode?: string
    geolocation: {
      latitude: number
      longitude: number
    }
  }) => void
}

// Helper function to extract postal code from pickup station data
const getPostCodeFromStation = (station: PickupStation): string => {
  // First try to get from pickupStationAgent
  if (station.pickupStationAgent?.postCode) {
    return station.pickupStationAgent.postCode
  }

  const nigerianPostCodeMatch = station.address.match(/\b\d{6}\b/)
  if (nigerianPostCodeMatch) return nigerianPostCodeMatch[0]

  const generalPostCodeMatch = station.address.match(/\b[A-Z0-9]{3,8}\b$/i)
  if (generalPostCodeMatch) return generalPostCodeMatch[0]

  return ''
}

const PickupStations: React.FC<PickupStationProps> = ({
  open,
  onOpenChange,
  onSelectStation,
}) => {
  const [state, setState] = useState('')
  const [pickupStations, setPickupStations] = useState<PickupStation[]>([])
  const [selectedStation, setSelectedStation] = useState<PickupStation | null>(
    null
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [defaultStationLoaded, setDefaultStationLoaded] = useState(false)

  // Load default Lagos station when component mounts
  useEffect(() => {
    const loadDefaultStation = async () => {
      if (!defaultStationLoaded) {
        setLoading(true)
        try {
          // console.log('Loading default Lagos pickup stations...')
          const response = await fetchPickupStations({ state: 'Lagos' })
          const stations = response?.data || []

          // console.log('Default Lagos stations found:', stations)

          if (stations.length > 0) {
            setPickupStations(stations)
            setSelectedStation(stations[0]) // Auto-select first station
            setState('Lagos')
            setHasSearched(true)
            // console.log('Default station selected:', stations[0])
          }
        } catch (err) {
          console.error('Error loading default Lagos stations:', err)
        } finally {
          setLoading(false)
          setDefaultStationLoaded(true)
        }
      }
    }

    if (open && !defaultStationLoaded) {
      loadDefaultStation()
    }
  }, [open, defaultStationLoaded])

  const handleStateSubmit = async () => {
    if (!state.trim()) return

    setLoading(true)
    setError(null)
    setHasSearched(true)

    // console.log('Searching for pickup stations in state:', state)

    try {
      // Make the search case-insensitive by capitalizing first letter
      const formattedState = state
        .trim()
        .toLowerCase()
        .replace(/^\w/, (c) => c.toUpperCase())
      // console.log('Formatted state for search:', formattedState)

      const response = await fetchPickupStations({ state: formattedState })
      const stations = response?.data || []

      // console.log('Found pickup stations:', stations)
      // console.log('Station count:', stations.length)

      setPickupStations(stations)

      // Auto-select first station if available
      if (stations.length > 0) {
        setSelectedStation(stations[0])
        // console.log('Auto-selected first station:', stations[0])
      } else {
        setSelectedStation(null)
      }
    } catch (err) {
      console.error('Error fetching pickup stations:', err)
      setError('Failed to fetch pickup stations. Please try again.')
      setPickupStations([])
      setSelectedStation(null)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = () => {
    if (selectedStation) {
      // console.log('Selected station data:', selectedStation)

      // Extract postCode from station data (pickupStationAgent has the postCode)
      const postCode = getPostCodeFromStation(selectedStation)

      // console.log('PostCode for selected station:', postCode)
      // console.log(
      //   'PostCode source - pickupStationAgent:',
      //   selectedStation.pickupStationAgent?.postCode
      // )

      const stationData = {
        name: selectedStation.name,
        address: selectedStation.address,
        id: selectedStation._id,
        city: selectedStation.city,
        state: selectedStation.state,
        postCode: postCode,
        geolocation: {
          latitude: selectedStation.geolocation.latitude,
          longitude: selectedStation.geolocation.longitude,
        },
      }

      // console.log('Sending station data to parent:', stationData)

      onSelectStation(stationData)
      onOpenChange(false)
    } else {
      alert('Please select a pickup station.')
    }
  }

  // Enhanced station selection with logging
  const handleStationSelect = (station: PickupStation) => {
    // console.log('Station selected:', station)
    setSelectedStation(station)
  }

  // Handle Enter key press for search
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleStateSubmit()
    }
  }

  // console.log('Current selected station:', selectedStation)

  return (
    <Modal
      isOpen={open}
      onOpenChange={onOpenChange}
      backdrop='blur'
      placement='center'
      className='w-[75%] h-[80%] max-w-none'
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='text-center'>
              Select a Pickup Station
            </ModalHeader>
            <ModalBody className='h-full'>
              <div className='flex flex-col md:flex-row gap-6 h-full'>
                {/* Left Section: Search */}
                <div className='flex-1 flex flex-col'>
                  <p className='mb-4 text-sm font-medium'>
                    Enter your state to find available pickup stations.
                  </p>
                  <Input
                    fullWidth
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder='e.g. Lagos, Abuja, Kano'
                    className='mb-2'
                  />
                  <Button
                    color='primary'
                    onPress={handleStateSubmit}
                    isLoading={loading}
                    className='w-full'
                  >
                    Search
                  </Button>
                  {loading && (
                    <p className='text-sm text-gray-500 mt-2'>
                      Loading stations...
                    </p>
                  )}
                  {error && (
                    <p className='text-sm text-red-500 mt-2'>{error}</p>
                  )}
                  {hasSearched &&
                    pickupStations.length === 0 &&
                    !loading &&
                    !error && (
                      <p className='text-sm text-gray-500 mt-2'>
                        No stations found for "{state}".
                      </p>
                    )}
                </div>

                {/* Right Section: Results */}
                <div className='flex-1 overflow-auto h-full border p-4 rounded'>
                  {pickupStations.length > 0 && (
                    <>
                      <p className='text-sm font-medium mb-3 text-gray-700'>
                        {selectedStation
                          ? 'Selected Station:'
                          : 'Available Stations:'}
                      </p>
                      <ul className='space-y-4'>
                        {pickupStations.map((station) => {
                          // Extract postCode for display from pickupStationAgent
                          const displayPostCode =
                            getPostCodeFromStation(station)

                          return (
                            <li
                              key={station._id}
                              className={`p-3 cursor-pointer rounded border transition-all duration-200 ${
                                selectedStation?._id === station._id
                                  ? 'bg-primary-100 text-primary-600 border-primary-300 shadow-md'
                                  : 'hover:bg-gray-50 border-gray-200 hover:shadow-sm'
                              }`}
                              onClick={() => handleStationSelect(station)}
                            >
                              <div className='space-y-1'>
                                <p className='font-bold text-sm'>
                                  {station.name}
                                  {selectedStation?._id === station._id && (
                                    <span className='ml-2 text-xs bg-primary-500 text-white px-2 py-1 rounded'>
                                      Selected
                                    </span>
                                  )}
                                </p>
                                <p className='text-xs text-gray-600'>
                                  {station.address}
                                </p>
                                <p className='text-xs text-gray-500'>
                                  {station.phoneNumber}
                                </p>
                                {displayPostCode && (
                                  <p className='text-xs text-gray-500'>
                                    Postal Code: {displayPostCode}
                                  </p>
                                )}
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    </>
                  )}
                  {!loading && !hasSearched && (
                    <div className='flex items-center justify-center h-full text-gray-500'>
                      <p className='text-sm'>Loading default stations...</p>
                    </div>
                  )}
                </div>
              </div>
            </ModalBody>
            <ModalFooter className='flex flex-col sm:flex-row gap-2 sm:gap-0'>
              <Button
                color='secondary'
                onPress={() => onOpenChange(false)}
                className='w-full sm:w-auto sm:mr-2 order-2 sm:order-1'
              >
                Cancel
              </Button>
              <Button
                color='primary'
                onPress={handleConfirm}
                isDisabled={!selectedStation}
                className='w-full sm:w-auto order-1 sm:order-2'
              >
                {selectedStation
                  ? 'Confirm Selection'
                  : 'Select Pickup Station'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default PickupStations
