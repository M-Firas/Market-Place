import React from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import {
  signInSuccess,
  currentUserStart,
  currentUserSuccess,
  currentUserFailure,
} from "../app/user/userSlice";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      console.log(result);

      const res = await fetch(
        "https://market-place-jj5i.onrender.com/api/auth/google",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: result.user.displayName,
            email: result.user.email,
            photo: result.user.photoURL,
          }),
        },
      );
      const data = await res.json();
      dispatch(signInSuccess(data));
      // Fetching the actual current user from the backend after signing in (based on the cookie)
      dispatch(currentUserStart());
      const userRes = await fetch(
        "https://market-place-jj5i.onrender.com/api/user/getCurrentUser",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      if (!userRes.ok) {
        dispatch(currentUserFailure("Failed to get user data"));
        return;
      }

      const userData = await userRes.json();
      dispatch(currentUserSuccess(userData));

      navigate("/");
    } catch (error) {
      console.log("could not sign in with google", error);
    }
  };
  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      // className="cursor-pointer rounded-lg bg-red-700 p-3 text-white uppercase hover:opacity-80"
      className="flex h-20 w-30 cursor-pointer items-center justify-center self-center rounded-xl border-1 border-[#ddd] bg-[#f1f5f1] text-3xl text-rose-500 hover:opacity-70"
    >
      <Icon icon={"mdi:google"} />+
    </button>
  );
}
