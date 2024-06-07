import React, { memo } from "react";
import "../../styles/atoms/primaryButton.css";

type Props = {
  children?: string;
  disabled?: boolean;
  onClick?: () => void;
};

export const PrimaryButton: React.FC<Props> = memo(
  ({ children, disabled = false, onClick }) => {
    return (
      <button className="primary-button" disabled={disabled} onClick={onClick}>
        {children}
      </button>
    );
  }
);
