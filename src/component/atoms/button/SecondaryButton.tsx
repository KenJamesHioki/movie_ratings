import React, { memo } from "react";
import "../../../styles/atoms/button/secondaryButton.css";
import { ButtonProps } from "../../../types/types";

export const SecondaryButton: React.FC<ButtonProps> = memo(
  ({
    type,
    children,
    disabled = false,
    onClick,
    style = {},
    className = "",
  }) => {
    return (
      <button
        type={type}
        className={`button-secondary ${className}`}
        disabled={disabled}
        onClick={onClick}
        style={style}
      >
        {children}
      </button>
    );
  }
);
