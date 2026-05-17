import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import logo from "../assets/skillupempty.png";
import { ShieldCheck, LogIn, ArrowLeft, Mail, Lock } from "lucide-react";

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr("");

    if (!email || !password) {
      setErr("Please enter your email and password.");
      return;
    }

    try {
      setBusy(true);

      const q = query(
        collection(db, "users"),
        where("role", "==", "admin"),
        where("email", "==", email),
        limit(1)
      );
      const snap = await getDocs(q);

      if (snap.empty) {
        setErr("Admin user not found.");
        setBusy(false);
        return;
      }

      const docRef = snap.docs[0];
      const user = docRef.data();

      if (user.password !== password) {
        setErr("Incorrect password.");
        setBusy(false);
        return;
      }

      
      localStorage.setItem("skillup_role", "admin");
      localStorage.setItem("skillup_uid", docRef.id);
      localStorage.setItem("skillup_user_name", user.name || "Admin");

      nav("/admin-home");
    } catch (e) {
      console.error(e);
      setErr("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-[#EAECDC] text-[#325443] font-[Tajawal]"
      style={{
        background:
          "linear-gradient(160deg, #EAECDC 0%, #dce2c9 40%, #c9d3be 90%)",
      }}
    >

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-180px] left-[-150px] w-[400px] h-[400px] bg-[#325443]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-200px] right-[-120px] w-[350px] h-[350px] bg-[#325443]/15 rounded-full blur-[100px]" />
      </div>

 
      <button
        onClick={() => nav(-1)}
        className="absolute top-8 left-8 border border-[#325443] text-[#325443] px-4 py-2 rounded-xl hover:bg-[#325443] hover:text-[#EAECDC] font-semibold transition-all"
      >
        <ArrowLeft size={18} className="inline mr-1" /> Back
      </button>

      <div
        className="relative z-10 w-full max-w-[500px] rounded-2xl p-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,.62), rgba(255,255,255,.42))",
          border: "1px solid rgba(255,255,255,.55)",
          boxShadow:
            "8px 14px 32px rgba(50,84,67,.18), inset -6px -6px 16px rgba(255,255,255,.7), inset 6px 6px 16px rgba(50,84,67,.08)",
          backdropFilter: "blur(10px)",
        }}
      >
    
        <div className="text-center mb-6">
          <img
            src={logo}
            alt="SkillUp Logo"
            className="h-20 w-auto mx-auto mb-3 drop-shadow-sm"
          />
          <h1 className="text-2xl font-extrabold">Welcome Back, Admin</h1>
          <p className="text-sm opacity-70 mt-1">
            Lead your learning platform with confidence.
          </p>
        </div>


        {err && (
          <div className="mb-4 text-sm bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg">
            {err}
          </div>
        )}

   
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="text-sm font-semibold">Email</label>
            <div
              className="flex items-center gap-2 mt-1 px-3 py-2 rounded-xl"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,.8), rgba(255,255,255,.6))",
                border: "1px solid rgba(50,84,67,.3)",
                boxShadow:
                  "inset 2px 2px 5px rgba(50,84,67,.1), inset -2px -2px 6px rgba(255,255,255,.6)",
              }}
            >
              <Mail size={16} />
              <input
                type="email"
                placeholder="admin@jodayn.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent outline-none flex-1 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold">Password</label>
            <div
              className="flex items-center gap-2 mt-1 px-3 py-2 rounded-xl"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,.8), rgba(255,255,255,.6))",
                border: "1px solid rgba(50,84,67,.3)",
                boxShadow:
                  "inset 2px 2px 5px rgba(50,84,67,.1), inset -2px -2px 6px rgba(255,255,255,.6)",
              }}
            >
              <Lock size={16} />
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent outline-none flex-1 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full py-3 rounded-xl mt-4 font-bold flex items-center justify-center gap-2 text-[#EAECDC] bg-[#325443] hover:bg-[#2b4639] transition-all shadow-md hover:shadow-lg"
          >
            <LogIn size={18} />
            {busy ? "Signing in..." : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          Don’t have an account?{" "}
          <button
            onClick={() => nav("/admin-signup")}
            className="underline font-bold hover:text-[#2b4639]"
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
}