import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const ListItem = ({ label, link }) => (
    <li className="hidden sm:inline">
      <Link
        to={link}
        className="cursor-pointer text-slate-950 hover:text-slate-700 hover:opacity-85"
      >
        {label === "signin" && currentUser ? (
          <img
            className="h-7 w-7 rounded-lg object-cover"
            src={currentUser.avatar}
            alt="profile"
          />
        ) : (
          label
        )}
      </Link>
    </li>
  );

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-3">
        <Link to="/">
          <h1 className="flex flex-wrap text-sm font-bold sm:text-xl">
            <span className="text-slate-500">Market</span>
            <span className="text-slate-700">Place</span>
          </h1>
        </Link>
        <form className="flex items-center rounded-lg bg-slate-100 p-3">
          <input
            type="text"
            placeholder="Search..."
            id="search_icon"
            className="w-24 bg-transparent focus:outline-none sm:w-64"
          />
          <label htmlFor="search_icon" className="cursor-pointer">
            <Icon icon="oui:search" className="text-slate-600" />
          </label>
        </form>
        <ul className="flex gap-4">
          <ListItem label={"Home"} link="/" />
          <ListItem label={"About"} link="/about" />
          <ListItem label={"Signin"} link="/profile" />
        </ul>
      </div>
    </header>
  );
}
