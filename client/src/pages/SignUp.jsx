import React from "react";
import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className="mx-auto max-w-lg p-3">
      <h1 className="my-7 text-center text-3xl font-semibold">Sign Up</h1>
      <form className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          id="username"
          className="rounded-lg border border-[#ddd] bg-white p-3 outline-none"
        />
        <input
          type="text"
          placeholder="email"
          id="email"
          className="rounded-lg border border-[#ddd] bg-white p-3 outline-none"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="rounded-lg border border-[#ddd] bg-white p-3 outline-none"
        />
        <button className="cursor-pointer rounded-lg bg-slate-700 p-3 text-white uppercase hover:opacity-95 disabled:opacity-80">
          Sign Up
        </button>
      </form>
      <div className="mt-5 flex gap-2">
        <p>Have an account?</p>
        <Link to="/signin">
          <span className="text-blue-700">Sign In</span>
        </Link>
      </div>
    </div>
  );
}
