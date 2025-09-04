import { useState } from "react";

function Input({ value, placeholder, onChange, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange && onChange(e.target.value)}
      className="w-full border border-black/10 rounded-sm px-3 outline-none duration-150 bg-black/70 py-1 hover:border-white/90"
    />
  );
}

export default Input;
