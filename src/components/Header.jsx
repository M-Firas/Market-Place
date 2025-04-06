import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function Header() {
  const ListItem = ({ label, link }) => (
    <Link
      to={link}
      className="hidden sm:inline text-slate-700 hover:text-slate-950 hover:font-semibold cursor-pointer"
    >
      <li>{label}</li>
    </Link>
  );

  return (
    <header className=" bg-slate-200 shadow-md ">
      <div className="flex justify-between items-center max-w-6xl p-3 mx-auto">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Market</span>
            <span className="text-slate-700">Place</span>
          </h1>
        </Link>
        <form className="flex bg-slate-100 p-3 rounded-lg items-center">
          <input
            type="text"
            placeholder="Search..."
            id="search_icon"
            className=" bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <label htmlFor="search_icon" className=" cursor-pointer">
            <Icon icon="oui:search" className="text-slate-600" />
          </label>
        </form>
        <ul className="flex  space-x-4">
          <ListItem label={"Home"} link="/" />
          <ListItem label={"About"} link="/about" />
          <ListItem label={"Signin"} link="/signin" />
        </ul>
      </div>
    </header>
  );
}
