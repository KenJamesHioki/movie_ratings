import React, { CSSProperties } from 'react'
import "../../styles/atoms/sectionTitle.css"

type Props = {
  children: string;
  style?: CSSProperties;
};

export const SectionTitle:React.FC<Props> = ({children, style={}}) => {
  return (
    <h2 style={style} className='section-title'>{children}</h2>
  )
}
