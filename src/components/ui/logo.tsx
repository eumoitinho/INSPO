import React from 'react'

interface NinetwoLogoWithTextProps {
  width?: number
  height?: number
  className?: string
}

export const NinetwoLogoWithText: React.FC<NinetwoLogoWithTextProps> = ({ 
  width = 32, 
  height = 32, 
  className = "" 
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div 
        className="bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center text-white font-bold"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        92
      </div>
      <span className="ml-2 text-lg font-bold text-foreground">NINETWO</span>
    </div>
  )
}

export default NinetwoLogoWithText 