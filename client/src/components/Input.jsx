import { useState } from "react";

function Input({
  value,
  placeholder,
  onChange,
  type = "text",
  className = "",
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange && onChange(e.target.value)}
      className={`outline-none ${className}`}
    />
  );
}

export default Input;
