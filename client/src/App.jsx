import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  currentUserStart,
  currentUserSuccess,
  currentUserFailure,
} from "./app/user/userSlice";

// components
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Header from "./components/Header";
import CreateListing from "./pages/CreateListing";
import { PrivateRoute } from "./components/PrivateRoute";
import { PublicRoute } from "./components/PrivateRoute";
import UpdateListing from "./pages/UpdateListing";
import Listing from "./pages/Listing";
import PopupInfo from "./app/popup/PopupInfo";
import { Search } from "./pages/Search";
import Account from "./layouts/Account";
import MyListings from "./pages/MyListings";

function App() {
  const dispatch = useDispatch();
  const hasFetchedUser = useRef(false);

  useEffect(() => {
    // preventing fetch to fire more than one time
    if (hasFetchedUser.current) return;
    hasFetchedUser.current = true;

    const fetchCurrentUser = async () => {
      dispatch(currentUserStart());
      try {
        const res = await fetch("/api/user/getCurrentUser", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        dispatch(currentUserSuccess(data));
      } catch (err) {
        dispatch(currentUserFailure());
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <>
      <PopupInfo />
      <Router>
        <Header />
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<Search />} />
          <Route path="/listing/:listingId" element={<Listing />} />
          <Route element={<PrivateRoute />}>
            <Route path="/account" element={<Account />}>
              <Route index element={<Profile />} />
              <Route path="listings" element={<MyListings />} />
              <Route path="create-listing" element={<CreateListing />} />
            </Route>
            <Route
              path="/update-lsiting/:listingId"
              element={<UpdateListing />}
            />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
