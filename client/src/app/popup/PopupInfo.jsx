import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hidePopup, selectPopupMessage, selectPopupType } from "./popupSlice";

export default function PopupInfo() {
  const dispatch = useDispatch();
  const message = useSelector(selectPopupMessage);
  const type = useSelector(selectPopupType);
  const [visible, setVisible] = useState(false);
  const [animatingOut, setAnimatingOut] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      setAnimatingOut(false);

      const hideTimer = setTimeout(() => {
        setAnimatingOut(true);

        // Wait for the animation to finish before hiding completely
        const removeTimer = setTimeout(() => {
          setVisible(false);
          dispatch(hidePopup());
        }, 750); // must match fade-out duration

        return () => clearTimeout(removeTimer);
      }, 3000);

      return () => clearTimeout(hideTimer);
    }
  }, [message, dispatch]);

  if (!visible) return null;

  return (
    <div
      className={`${animatingOut ? "animate-fade-out" : "animate-show-in"} ${
        type === "success" ? "bg-[#5bba6f]" : "bg-[#ef233c]"
      } fixed top-[60px] right-[10px] z-10 flex items-center justify-start rounded-xl px-4 py-2 font-semibold text-white capitalize shadow-lg sm:top-1/4`}
    >
      <p>{message}</p>
    </div>
  );
}
