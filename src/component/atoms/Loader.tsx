import { CircularProgress } from '@mui/material'
import React from 'react'
import "../../styles/atoms/loader.css"

export const Loader:React.FC = () => {
  return (
    <div className='loader_wrapper'>
      <CircularProgress size={60}/>
    </div>
  )
}
