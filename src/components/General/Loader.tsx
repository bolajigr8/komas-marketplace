import React from 'react'

type PropsType = {
  className?: string
}

const Loader = ({ className }: PropsType) => {
  return (
    <div className={`loader ${className}`} />
  )
}

export default Loader