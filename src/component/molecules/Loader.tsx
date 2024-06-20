import { CircularProgress } from '@mui/material'
import React from 'react'
import "../../styles/atoms/loader.css"

type Props = {
  size: number;
}

export const Loader:React.FC<Props> = ({size=60}) => {
  return (
    <div className='loader_wrapper'>
      <CircularProgress size={size}/>
    </div>
  )
}
