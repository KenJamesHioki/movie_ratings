import React, { memo } from "react";
import "../../styles/atoms/invertedButton.css";

type Props = {
  children?: string;
  disabled?: boolean;
  onClick?: () => void;
};

export const InvertedButton: React.FC<Props> = memo(
  ({ children, disabled = false, onClick }) => {
    return (
      <button className="inverted-button" disabled={disabled} onClick={onClick}>
        {children}
      </button>
    );
  }
);
