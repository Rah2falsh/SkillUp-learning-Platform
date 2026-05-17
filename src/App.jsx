import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./WelcomePage";
import SignUp from "./SignUp";
import LogIn from "./LogIn";
import ForgotPassword from "./ForgotPassword";
import VerifyCode from "./VerifyCode";

<div className="bg-red-300 p-4">Tailwind works!</div>

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/forgot" element={<ForgotPassword />} />
<Route path="/verify" element={<VerifyCode />} />

      </Routes>
    </Router>
  );
}
