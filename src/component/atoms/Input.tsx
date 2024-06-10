import React, { CSSProperties, ChangeEvent, memo } from "react";
import "../../styles/atoms/input.css";

type Props = {
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  style?:CSSProperties;
};

export const Input: React.FC<Props> = memo(
  ({ type, value, onChange, placeholder = "文字を入力", style={} }) => {
    return (
      <input
        className="input"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={style}
      />
    );
  }
);
