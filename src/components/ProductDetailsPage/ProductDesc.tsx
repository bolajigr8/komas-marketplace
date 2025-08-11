import React, { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'

interface ProductDescriptionProps {
  description: string
  maxLines?: number
  textProp?: boolean
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  description,
  textProp = false,
  maxLines = 3,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // Check if description is long enough to need truncation
  const words = description.split(' ')
  const shouldTruncate = words.length > 50 || description.length > 300

  // Create truncated version based on word count
  const truncatedDescription = shouldTruncate
    ? words.slice(0, 50).join(' ') + '...'
    : description

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  // Format description with proper line breaks and structure
  const formatDescription = (text: string) => {
    // Split by common separators and create paragraphs
    const paragraphs = text
      .split(/\n\n|\r\n\r\n|\.(?:\s|$)/)
      .filter((p) => p.trim().length > 0)
      .map((p) => p.trim())

    if (paragraphs.length <= 1) {
      return <p className='text-gray-600 leading-relaxed'>{text}</p>
    }

    return paragraphs.map((paragraph, index) => (
      <p key={index} className='text-gray-600 leading-relaxed mb-3 last:mb-0'>
        {paragraph.endsWith('.') ? paragraph : paragraph + '.'}
      </p>
    ))
  }

  return (
    <div className='py-6 border-b'>
      <div className='space-y-2'>
        {textProp ? (
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Product Description
          </h3>
        ) : null}

        <div
          className={`transition-all duration-300 ease-in-out ${
            !isExpanded && shouldTruncate ? 'overflow-hidden' : ''
          }`}
        >
          <div
            className={`${
              !isExpanded && shouldTruncate ? `line-clamp-${maxLines}` : ''
            }`}
          >
            {formatDescription(
              isExpanded || !shouldTruncate ? description : truncatedDescription
            )}
          </div>
        </div>

        {shouldTruncate && (
          <button
            onClick={toggleExpanded}
            className='inline-flex items-center gap-2 text-[#3bb77e] hover:text-[#2da56d] font-medium text-sm transition-colors mt-3 group'
          >
            <span>{isExpanded ? 'Read Less' : 'Read More'}</span>
            {isExpanded ? (
              <ChevronUpIcon className='w-4 h-4 transition-transform group-hover:-translate-y-0.5' />
            ) : (
              <ChevronDownIcon className='w-4 h-4 transition-transform group-hover:translate-y-0.5' />
            )}
          </button>
        )}
      </div>

      <style jsx>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-5 {
          display: -webkit-box;
          -webkit-line-clamp: 5;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}

export default ProductDescription
