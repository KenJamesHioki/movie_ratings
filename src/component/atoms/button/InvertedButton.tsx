import React, { memo } from "react";
import "../../../styles/atoms/button/invertedButton.css";
import { ButtonProps } from "../../../types/types";

export const InvertedButton: React.FC<ButtonProps> = memo(
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
        className={`button-inverted ${className}`}
        style={style}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
);
