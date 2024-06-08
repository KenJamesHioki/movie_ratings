import React from 'react'
import "../../styles/atoms/noResultMessage.css"

type Props = {
  children: string;
  style?:object;
};

export const NoResultMessage:React.FC<Props> = ({children, style}) => {
  return (
    <p className='no-result' style={style}>{children}</p>
  )
}
