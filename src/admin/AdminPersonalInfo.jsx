import { useState } from "react";
import { User, Mail, Lock, Edit3, Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminPersonalInfo() {
  const nav = useNavigate();
  const [editing, setEditing] = useState(false);
  const [info, setInfo] = useState({
    name: localStorage.getItem("skillup_user_name") || "Admin User",
    email: localStorage.getItem("skillup_pending_email") || "admin@example.com",
    password: localStorage.getItem("skillup_user_password") || "********",
  });

  const handleChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem("skillup_user_name", info.name);
    localStorage.setItem("skillup_pending_email", info.email);
    localStorage.setItem("skillup_user_password", info.password);
    setEditing(false);
    alert(" Information updated successfully!");
  };

  return (
    <div className="min-h-screen bg-[#EAECDC] text-[#325443] font-[Tajawal] flex flex-col items-center justify-start p-8">
      {/* Back Button */}
      <div className="w-full max-w-[700px] flex justify-start mb-4">
        <button
          onClick={() => nav("/admin-home")}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl border border-[#325443] text-[#325443] font-semibold hover:bg-[#325443] hover:text-[#EAECDC] transition"
        >
          <ArrowLeft size={18} /> Back 
        </button>
      </div>

      <div
        className="w-full max-w-[700px] rounded-2xl p-10 mt-4"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,.65), rgba(255,255,255,.40))",
          border: "1px solid rgba(255,255,255,.55)",
          boxShadow: "8px 14px 32px rgba(50,84,67,.18)",
          backdropFilter: "blur(8px)",
        }}
      >
        <h2 className="text-3xl font-extrabold mb-8 text-center">
          Personal Information
        </h2>

        <div className="space-y-6">
          {/* Name */}
          <div className="flex items-center gap-4">
            <User size={22} className="text-[#325443]" />
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={info.name}
                onChange={handleChange}
                readOnly={!editing}
                className={`w-full rounded-xl py-2 px-3 border ${
                  editing
                    ? "border-[#325443]"
                    : "border-transparent bg-transparent"
                } outline-none transition`}
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-4">
            <Mail size={22} className="text-[#325443]" />
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={info.email}
                onChange={handleChange}
                readOnly={!editing}
                className={`w-full rounded-xl py-2 px-3 border ${
                  editing
                    ? "border-[#325443]"
                    : "border-transparent bg-transparent"
                } outline-none transition`}
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex items-center gap-4">
            <Lock size={22} className="text-[#325443]" />
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={info.password}
                onChange={handleChange}
                readOnly={!editing}
                className={`w-full rounded-xl py-2 px-3 border ${
                  editing
                    ? "border-[#325443]"
                    : "border-transparent bg-transparent"
                } outline-none transition`}
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center mt-8">
          {editing ? (
            <button
              onClick={handleSave}
              className="bg-[#325443] text-[#EAECDC] px-6 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition"
            >
              <Save size={18} /> Save Changes
            </button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="border border-[#325443] px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-[#325443] hover:text-[#EAECDC] transition"
            >
              <Edit3 size={18} /> Edit Info
            </button>
          )}
        </div>
      </div>
    </div>
  );
}