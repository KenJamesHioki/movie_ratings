import React, { CSSProperties, memo } from "react";
import "../../../styles/atoms/button/primaryButton.css";

type Props = {
  type: "button" | "reset" | "submit" | undefined;
  children: string;
  disabled?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
};

export const PrimaryButton: React.FC<Props> = memo(
  ({ type, children, disabled = false, onClick, style={} }) => {
    return (
      <button type={type} className="button-primary" disabled={disabled} onClick={onClick} style={style}>
        {children}
      </button>
    );
  }
);
