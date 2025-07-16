import React from 'react'

interface LogoProps {
  width?: number
  height?: number
  className?: string
}

export const NinetwoLogo: React.FC<LogoProps> = ({ width = 40, height = 40, className = "" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className="bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center text-primary-foreground font-bold"
        style={{ width, height }}
      >
        <span className="text-lg font-serif">92</span>
      </div>
    </div>
  )
}

export const NinetwoLogoWithText: React.FC<LogoProps & { showText?: boolean }> = ({ 
  width = 40, 
  height = 40, 
  className = "", 
  showText = true 
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <NinetwoLogo width={width} height={height} />
      {showText && (
        <div className="flex flex-col">
          <span className="text-lg font-serif font-bold text-foreground">NINETWO</span>
          <span className="text-xs text-muted-foreground">DASH</span>
        </div>
      )}
    </div>
  )
}