import React, { CSSProperties } from 'react'
import "../../styles/atoms/noResultMessage.css"

type Props = {
  children: string;
  style?:CSSProperties;
};

export const NoResultMessage:React.FC<Props> = ({children, style}) => {
  return (
    <p className='message-no-result' style={style}>{children}</p>
  )
}
