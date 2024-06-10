import React, { CSSProperties, memo } from "react";
import "../../styles/atoms/invertedButton.css";

type Props = {
  type: "button" | "reset" | "submit" | undefined;
  children: string;
  disabled?: boolean;
  onClick: () => void;
  style?: CSSProperties;
};

export const InvertedButton: React.FC<Props> = memo(
  ({ type, children, disabled = false, onClick, style={} }) => {
    return (
      <button type={type} className="inverted-button" style={style} disabled={disabled} onClick={onClick}>
        {children}
      </button>
    );
  }
);
