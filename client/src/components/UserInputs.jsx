import React from "react";
import { useState } from "react";
import { Icon } from "@iconify/react";

export default function UserInputs({
  type,
  placeholder,
  id,
  formData,
  setFormData,
}) {
  const [typo, setTypo] = useState(type);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="relative">
      <input
        type={typo}
        placeholder={placeholder}
        id={id}
        className="w-full rounded-lg border border-[#ddd] bg-white p-3 outline-none"
        onChange={handleChange}
        required
      />
      {type === "password" && (
        <Icon
          icon={typo === "password" ? "mdi:eye" : "ri:eye-off-line"}
          onClick={() => {
            typo === "password" ? setTypo("text") : setTypo("password");
          }}
          className="absolute top-1/2 right-8 -translate-y-1/2 cursor-pointer hover:opacity-70"
        />
      )}
    </div>
  );
}
