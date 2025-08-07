import React from 'react'

type PropsType = {
  className?: string
}

const Loader = ({ className }: PropsType) => {
  return (
    <div className='root-loading-container'>
      <div className={`loader ${className}`} />
    </div>
  )
}

export default Loader
