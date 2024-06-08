import React, { memo } from "react";
import "../../styles/atoms/invertedButton.css";

type Props = {
  children: string;
  disabled?: boolean;
  onClick: () => void;
  style?: object;
};

export const InvertedButton: React.FC<Props> = memo(
  ({ children, disabled = false, onClick, style={} }) => {
    return (
      <button className="inverted-button" style={style} disabled={disabled} onClick={onClick}>
        {children}
      </button>
    );
  }
);
