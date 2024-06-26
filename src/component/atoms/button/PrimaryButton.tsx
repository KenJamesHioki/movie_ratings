import React, { memo } from "react";
import "../../../styles/atoms/button/primaryButton.css";
import { ButtonProps } from "../../../types/types";

export const PrimaryButton: React.FC<ButtonProps> = memo(
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
        className={`button-primary ${className}`}
        disabled={disabled}
        onClick={onClick}
        style={style}
      >
        {children}
      </button>
    );
  }
);
