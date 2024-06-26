import React, { CSSProperties, memo } from "react";
import "../../../styles/atoms/button/secondaryButton.css";

type Props = {
  type: "button" | "reset" | "submit" | undefined;
  children: string;
  disabled?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
};

export const SecondaryButton: React.FC<Props> = memo(
  ({ type, children, disabled = false, onClick, style={} }) => {
    return (
      <button type={type} className="button-secondary" disabled={disabled} onClick={onClick} style={style}>
        {children}
      </button>
    );
  }
);
