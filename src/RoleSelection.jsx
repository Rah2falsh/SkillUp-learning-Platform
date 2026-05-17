import { useLocation, useNavigate } from "react-router-dom";
import logo from "./assets/skillupempty.png";

export default function RoleSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "login";

  const handleSelectRole = (role) => {
    if (role === "employee") {
      if (from === "signup" || from === "start") navigate("/signup");
      else navigate("/login");
    } else if (role === "manager") {
      if (from === "signup" || from === "start") navigate("/admin-signup");
      else navigate("/admin-login");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#EAECDC] text-[#325443] font-[Tajawal] flex flex-col items-center justify-center overflow-hidden">
    
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(900px 600px at 15% 10%, rgba(255,255,255,.6), transparent 60%), radial-gradient(900px 500px at 90% 90%, rgba(255,255,255,.45), transparent 70%)",
        }}
      />

     {/* logo for  SkillUp here :*/}
<img
  src={logo}
  alt="SkillUp Logo"
  className="absolute top-6 right-10 h-36 drop-shadow-sm"
/>

      {/*  Back button   */}
      <button
        onClick={() => navigate("/welcome")}
        className="absolute top-8 left-8 text-[#325443] border border-[#325443] px-4 py-2 rounded-xl font-semibold hover:bg-[#325443] hover:text-[#EAECDC] transition z-20"
      >
        ← Back
      </button>

  
      <div
        className="relative z-10 w-full max-w-[580px] rounded-2xl p-12 text-center"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,.65), rgba(255,255,255,.40))",
          border: "1px solid rgba(255,255,255,.55)",
          boxShadow:
            "9px 14px 32px rgba(50,84,67,.18), inset -6px -6px 16px rgba(255,255,255,.7), inset 6px 6px 16px rgba(50,84,67,.08)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h1 className="text-4xl font-extrabold mb-4">
          Choose Your <span className="text-[#2b4639]">Role</span>
        </h1>
        <p className="text-[#325443]/80 text-lg mb-10 max-w-md mx-auto">
          Select whether you’re logging in as an{" "}
          <strong>Employee</strong> or a <strong>Manager</strong> to continue
          your journey with SkillUp.
        </p>

        <div className="flex flex-wrap justify-center gap-8">
          <button
            onClick={() => handleSelectRole("employee")}
            className="px-12 py-4 text-lg rounded-2xl font-semibold bg-[#325443] text-[#EAECDC] hover:brightness-95 hover:scale-105 transition-all shadow-md"
          >
            Employee
          </button>

          <button
            onClick={() => handleSelectRole("manager")}
            className="px-12 py-4 text-lg rounded-2xl font-semibold border border-[#325443]/60 bg-white/60 text-[#325443] hover:bg-[#325443] hover:text-[#EAECDC] hover:scale-105 transition-all shadow-md"
          >
            Manager
          </button>
        </div>
      </div>

      {/*  Footer here : */}
      <footer className="absolute bottom-0 left-0 w-full h-[40px] bg-[#325443]" />
    </div>
  );
}