import React, { CSSProperties } from 'react'
import "../../styles/atoms/sectionTitle.css"

type Props = {
  children: string;
  style?: CSSProperties;
};

export const SectionTitle:React.FC<Props> = ({children, style={}}) => {
  return (
    <h2 style={style} className='heading-section'>{children}</h2>
  )
}
