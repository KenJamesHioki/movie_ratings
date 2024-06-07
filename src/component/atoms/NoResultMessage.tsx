import React from 'react'
import "../../styles/atoms/noResultMessage.css"

type Props = {
  children?: string;
};

export const NoResultMessage:React.FC<Props> = ({children}) => {
  return (
    <p className='no-result'>{children}</p>
  )
}
