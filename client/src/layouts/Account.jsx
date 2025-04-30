import { Outlet, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";

const Account = () => {
  const { currentUser } = useSelector((state) => state.user);

  const navLinks = [
    { to: "/account", icon: "bx:user", label: "Profile", exact: true },
    { to: "/account/listings", icon: "bx:detail", label: "My Listings" },
    {
      to: "/account/create-listing",
      icon: "bx:duplicate",
      label: "Create New Listing",
    },
  ];

  const renderNavLink = ({ to, icon, label, exact }) => (
    <NavLink
      key={to}
      to={to}
      end={exact}
      className={({ isActive }) =>
        `flex items-center rounded-lg p-2 ${
          isActive ? "bg-slate-700 text-white" : "text-slate-600"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            icon={icon}
            className={`mr-3 h-6 w-6 ${isActive ? "text-white" : "text-slate-600"}`}
          />
          {label}
        </>
      )}
    </NavLink>
  );

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 md:flex-row">
      <div className="flex w-full flex-col gap-6 md:w-1/4">
        <div className="flex items-center gap-4 rounded-lg bg-slate-200 p-4 backdrop-blur-sm backdrop-filter">
          <img
            className="h-15 w-15 rounded-[50%] object-cover"
            src={currentUser.user.avatar}
            alt="profile"
          />
          <div className="flex flex-col">
            <p className="text-xl font-bold text-slate-700">
              {currentUser.user.username}
            </p>
            <p className="text-sm text-slate-600">{currentUser.user.email}</p>
          </div>
        </div>

        <nav className="flex flex-col gap-4 rounded-lg bg-slate-200 p-4 backdrop-blur-sm backdrop-filter">
          {navLinks.map(renderNavLink)}
        </nav>
      </div>

      <div className="w-full flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default Account;
