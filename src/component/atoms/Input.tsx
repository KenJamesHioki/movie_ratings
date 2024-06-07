import React, { ChangeEvent, memo } from "react";
import "../../styles/atoms/input.css";

type Props = {
  type?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

export const Input: React.FC<Props> = memo(
  ({ type = "text", value, onChange, placeholder = "文字を入力" }) => {
    return (
      <input
        className="input"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    );
  }
);
