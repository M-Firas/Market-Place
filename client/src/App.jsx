import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// components
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        {/* <Route element={<PrivateRoute />}> */}
        <Route path="/profile" element={<Profile />} />
        {/* </Route> */}
      </Routes>
    </Router>
  );
}

export default App;
