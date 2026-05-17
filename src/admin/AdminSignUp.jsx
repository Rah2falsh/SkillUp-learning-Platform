import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc, getDocs, query, where, limit, serverTimestamp } from "firebase/firestore";
import logo from "../assets/skillupempty.png";
import { UserPlus, ShieldCheck, ArrowLeft, Mail, Lock, Type } from "lucide-react";

const ADMIN_SECRET = "Admin-SkillUp-123";

export default function AdminSignUp() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [secret, setSecret] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    setErr("");
    setOk("");

    if (!name || !email || !password || !confirm || !secret) {
      setErr("Please complete all fields.");
      return;
    }
    if (password !== confirm) {
      setErr("Passwords do not match.");
      return;
    }
    if (secret !== ADMIN_SECRET) {
      setErr("Invalid admin secret code.");
      return;
    }

    try {
      setBusy(true);

      const qDup = query(
        collection(db, "users"),
        where("role", "==", "admin"),
        where("email", "==", email),
        limit(1)
      );
      const dupSnap = await getDocs(qDup);
      if (!dupSnap.empty) {
        setErr("An admin with this email already exists.");
        setBusy(false);
        return;
      }

      const docRef = await addDoc(collection(db, "users"), {
        name,
        email,
        password,
        role: "admin",
        createdAt: serverTimestamp(),
      });

      localStorage.setItem("skillup_role", "admin");
      localStorage.setItem("skillup_uid", docRef.id);
      localStorage.setItem("skillup_user_name", name);

      nav("/admin-home");
    } catch (e) {
      console.error(e);
      setErr("Failed to create admin. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#EAECDC] text-[#325443] font-[Tajawal] flex flex-col items-center justify-center overflow-hidden">
    
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-150px] left-[-100px] w-[400px] h-[400px] bg-[#325443]/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-200px] right-[-150px] w-[350px] h-[350px] bg-[#325443]/15 rounded-full blur-[100px] animate-pulse"></div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => nav(-1)}
        className="absolute top-8 left-8 text-[#325443] font-bold border border-[#325443] px-4 py-2 rounded-xl hover:bg-[#325443] hover:text-[#EAECDC] transition"
      >
        <ArrowLeft size={18} className="inline mr-2" /> Back
      </button>

      {/* Logo */}
      <img src={logo} alt="SkillUp Logo" className="h-24 mb-6 drop-shadow-md" />


      <div
        className="relative z-10 w-full max-w-[600px] rounded-2xl p-10 shadow-xl"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,.68), rgba(255,255,255,.46))",
          border: "1px solid rgba(255,255,255,.55)",
          boxShadow:
            "inset -5px -5px 15px rgba(255,255,255,.7), inset 6px 6px 15px rgba(50,84,67,.1), 8px 14px 32px rgba(50,84,67,.18)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="flex items-center gap-2 mb-6">
          <ShieldCheck size={24} />
          <h2 className="text-2xl font-extrabold">Admin Sign Up</h2>
        </div>

        {/*  رسائل التنبيه */}
        {err && (
          <div className="mb-4 text-sm bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg">
            {err}
          </div>
        )}
        {ok && (
          <div className="mb-4 text-sm bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg">
            {ok}
          </div>
        )}

        <form className="grid grid-cols-1 sm:grid-cols-2 gap-5" onSubmit={handleCreate}>

          <div className="sm:col-span-2">
            <label className="text-sm font-semibold">Full Name</label>
            <div className="mt-1 flex items-center gap-2 rounded-xl px-3 py-2 border border-[#325443]/30 bg-white/60 backdrop-blur-sm focus-within:border-[#325443] transition-all">
              <Type size={18} />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent outline-none flex-1 text-sm"
                placeholder="Enter full name"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-semibold">Email</label>
            <div className="mt-1 flex items-center gap-2 rounded-xl px-3 py-2 border border-[#325443]/30 bg-white/60 backdrop-blur-sm focus-within:border-[#325443] transition-all">
              <Mail size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent outline-none flex-1 text-sm"
                placeholder="admin@jodayn.com"
              />
            </div>
          </div>


          <div className="sm:col-span-2">
            <label className="text-sm font-semibold">Admin Secret</label>
            <div className="mt-1 flex items-center gap-2 rounded-xl px-3 py-2 border border-[#325443]/30 bg-white/60 backdrop-blur-sm focus-within:border-[#325443] transition-all">
              <ShieldCheck size={18} />
              <input
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="bg-transparent outline-none flex-1 text-sm"
                placeholder="Enter admin secret"
              />
            </div>
          </div>

 
          <div>
            <label className="text-sm font-semibold">Password</label>
            <div className="mt-1 flex items-center gap-2 rounded-xl px-3 py-2 border border-[#325443]/30 bg-white/60 backdrop-blur-sm focus-within:border-[#325443] transition-all">
              <Lock size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent outline-none flex-1 text-sm"
                placeholder="********"
              />
            </div>
          </div>

         
          <div>
            <label className="text-sm font-semibold">Confirm Password</label>
            <div className="mt-1 flex items-center gap-2 rounded-xl px-3 py-2 border border-[#325443]/30 bg-white/60 backdrop-blur-sm focus-within:border-[#325443] transition-all">
              <Lock size={18} />
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="bg-transparent outline-none flex-1 text-sm"
                placeholder="********"
              />
            </div>
          </div>

          {/* Create button */}
          <div className="sm:col-span-2 mt-4">
            <button
              type="submit"
              disabled={busy}
              className="w-full py-3 rounded-xl font-bold text-lg text-[#EAECDC] bg-[#325443] hover:bg-[#2b4639] shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <UserPlus size={20} />
              {busy ? "Creating..." : "Create Admin Account"}
            </button>
          </div>

          {/* Link for login page    */}
          <div className="sm:col-span-2 text-center text-sm mt-2">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => nav("/admin-login")}
              className="underline font-bold"
            >
              Log in
            </button>
          </div>
        </form>
      </div>

      {/* الشريط السفلي */}
      <footer className="absolute bottom-0 left-0 w-full h-[40px] bg-[#325443]" />
    </div>
  );
}