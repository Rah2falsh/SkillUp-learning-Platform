import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import logo from "./assets/skillupempty.png";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const user = res.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        alert(" User record not found.");
        setLoading(false);
        return;
      }

      const userData = userDoc.data();
      if (userData.role !== "employee") {
        alert("⚠️ This account is not registered as Employee.");
        setLoading(false);
        return;
      }

      localStorage.setItem("skillup_user_name", userData.name);
      localStorage.setItem("skillup_role", "employee");
      localStorage.setItem("skillup_uid", userData.uid);

      navigate("/employee-home");
    } catch (err) {
      console.error(err);
      alert(" Login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EAECDC] text-[#325443] font-[Tajawal] flex flex-col items-center justify-center relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(900px 600px at 20% 10%, rgba(255,255,255,.6), transparent 60%), radial-gradient(900px 500px at 90% 80%, rgba(255,255,255,.4), transparent 70%)",
        }}
      />

      {/* SkillUp LOGO here :  */}
      <img
        src={logo}
        alt="SkillUp"
        className="h-24 w-auto mb-8 drop-shadow-md animate-fade-in"
      />

      {/*  The form here : */}
      <div
        className="relative w-full max-w-[480px] rounded-2xl p-10 z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,.65), rgba(255,255,255,.40))",
          border: "1px solid rgba(255,255,255,.55)",
          boxShadow:
            "9px 14px 32px rgba(50,84,67,.18), inset -5px -5px 16px rgba(255,255,255,.7), inset 5px 5px 14px rgba(50,84,67,.08)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* title of form here : */}
        <h1 className="text-3xl font-extrabold text-center mb-8">
          Employee Login
        </h1>

    
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
       
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              required
              placeholder="username@jodayn.com"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-3 px-4 rounded-xl bg-white/70 border border-[#325443]/30 outline-none focus:border-[#325443] shadow-inner transition"
            />
          </div>

       
          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-3 px-4 rounded-xl bg-white/70 border border-[#325443]/30 outline-none focus:border-[#325443] shadow-inner transition"
            />
          </div>

         
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-[#325443] text-[#EAECDC] font-bold rounded-xl hover:brightness-95 transition-all shadow-md hover:shadow-lg"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

      
        <div className="mt-6 h-px bg-[#325443]/20" />

      
        <p className="mt-6 text-center text-sm opacity-80">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="font-bold underline cursor-pointer hover:opacity-90"
          >
            Create Employee Account
          </span>
        </p>
      </div>

      {/*  Back button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 text-[#325443] border border-[#325443] px-4 py-2 rounded-xl font-semibold hover:bg-[#325443] hover:text-[#EAECDC] transition z-20"
      >
        ← Back
      </button>

     
      <p className="absolute bottom-6 text-xs opacity-60">
        © {new Date().getFullYear()} SkillUp
      </p>
    </div>
  );
}