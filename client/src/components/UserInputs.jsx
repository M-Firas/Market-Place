import React from "react";
import { useState } from "react";
import { Icon } from "@iconify/react";

export default function UserInputs({
  type,
  placeholder,
  id,
  defaultVal,
  formData,
  setFormData,
  read,
  notRequired,
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
        defaultValue={defaultVal}
        readOnly={read ? true : false}
        className={`w-full rounded-lg border border-[#ddd] bg-white p-3 outline-none ${read && "cursor-default"} `}
        onChange={handleChange}
        required={!notRequired ? true : false}
      />
      {type === "password" && (
        <Icon
          icon={typo === "password" ? "mdi:eye" : "ri:eye-off-line"}
          onClick={() => setTypo(typo === "password" ? "text" : "password")}
          className="absolute top-1/2 right-8 -translate-y-1/2 cursor-pointer hover:opacity-70"
        />
      )}
    </div>
  );
}
