import React, { ChangeEvent, memo } from "react";
import "../../styles/atoms/textarea.css";

type Props = {
  value?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
};

export const Textarea: React.FC<Props> = memo(
  ({ value = "", onChange, placeholder = "文字を入力", disabled }) => {
    return (
      <textarea
        className="textarea"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
      />
    );
  }
);
