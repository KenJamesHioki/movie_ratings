import React, { CSSProperties, ChangeEvent, memo } from "react";
import "../../styles/atoms/textarea.css";

type Props = {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  style?:CSSProperties;
};

export const Textarea: React.FC<Props> = memo(
  ({ value, onChange, placeholder = "文字を入力", disabled = false, style={} }) => {
    return (
      <textarea
        className="textarea"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        style={style}
      />
    );
  }
);
