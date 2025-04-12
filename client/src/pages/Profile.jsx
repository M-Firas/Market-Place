import React from "react";
import { useSelector } from "react-redux";
import UserInputs from "../components/UserInputs";
import avatar from "../assets/imgs/profile_avatar.png";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="mx-auto max-w-lg p-3 select-none">
      <h1 className="my-7 text-center text-3xl font-semibold">profile</h1>
      <form className="flex flex-col gap-4">
        <img
          src={currentUser ? currentUser.avatar : avatar}
          alt="profile"
          className="h-24 w-24 cursor-pointer self-center rounded-full object-cover"
        />
        <UserInputs type="text" placeholder={"username"} id={"username"} />
        <UserInputs type="text" placeholder={"email"} id={"email"} />
        <UserInputs type="password" placeholder={"password"} id={"password"} />
        <button className="cursor-pointer rounded-xl bg-slate-800 p-3 text-white uppercase hover:opacity-80 disabled:opacity-80">
          update
        </button>
      </form>
      <div className="mt-5 flex justify-between">
        <span className="cursor-pointer text-red-700 capitalize">
          delete account
        </span>
        <span className="cursor-pointer text-red-700 capitalize">sign out</span>
      </div>
    </div>
  );
}
