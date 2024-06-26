import React, { CSSProperties, ChangeEvent, memo } from "react";
import "../../../styles/atoms/input/textarea.css";

type Props = {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  style?:CSSProperties;
  className?: string;
};

export const Textarea: React.FC<Props> = memo(
  ({ value, onChange, placeholder = "文字を入力", disabled = false, style={}, className="" }) => {
    return (
      <textarea
        className={`textarea ${className}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        style={style}
      />
    );
  }
);
