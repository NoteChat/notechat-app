import React from 'react'

export const CenterLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className="absolute left-0 top-0 right-0 bottom-0 m-auto">{children}</div>
}
