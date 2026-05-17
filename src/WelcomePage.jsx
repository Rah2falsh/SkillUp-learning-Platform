import { useNavigate } from "react-router-dom";
import logo from "./assets/skillupempty.png";
import jodayn from "./assets/jodaynlogo.png"; 

export default function WelcomePage() {
  const nav = useNavigate();

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-between text-[#325443] font-[Tajawal] overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #EAECDC 0%, #dce2c9 40%, #c9d3be 90%)",
      }}
    >
     
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-200px] left-[-150px] w-[400px] h-[400px] bg-[#325443]/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-180px] right-[-120px] w-[350px] h-[350px] bg-[#325443]/15 rounded-full blur-[100px] animate-pulse"></div>
      </div>

      {/*  header :  */}
      <header className="w-full flex justify-between items-center px-8 py-6 z-20 absolute top-0 left-0 right-0">
        {/* SkillUp LOGO here :  */}
        <img
          src={logo}
          alt="skillup logo"
          className="h-44 w-auto drop-shadow-md"
        />

        {/* SignUp/LogIn button here : */}
        <div className="flex gap-4">
          <button
            onClick={() => nav("/role-selection", { state: { from: "login" } })}
            className="px-5 py-2.5 text-sm font-semibold border border-[#325443] rounded-full hover:bg-[#325443] hover:text-[#EAECDC] transition-all"
          >
            Log In
          </button>
          <button
            onClick={() => nav("/role-selection", { state: { from: "signup" } })}
            className="px-5 py-2.5 text-sm font-semibold bg-[#325443] text-[#EAECDC] rounded-full hover:opacity-90 transition-all"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/*  center of page here : */}
      <main
        className="relative z-10 flex flex-col items-center justify-center px-6 text-center"
        style={{
          minHeight: "calc(100vh - 160px)", 
        }}
      >
       

        <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 tracking-tight leading-tight">
          Welcome to <span className="text-[#2b4639]">SkillUp</span>
        </h1>

        <p className="max-w-2xl text-base sm:text-lg text-[#325443]/80 leading-relaxed mb-10">
          Your personal platform to <strong>learn</strong>, <strong>grow</strong>,
          and <strong>track your skills</strong>.  
          Explore trainings, improve your expertise, and reach your full potential.
        </p>

        <button
          onClick={() => nav("/role-selection", { state: { from: "signup" } })}
          className="px-10 py-4 rounded-full font-bold text-lg bg-[#325443] text-[#EAECDC] hover:bg-[#2b4639] transition-all shadow-md hover:shadow-lg"
        >
          Start Now →
        </button>
      </main>

      {/* footer here :*/}
      <footer className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-center text-xs text-[#325443]/60">
        © {new Date().getFullYear()} SkillUp, for JODAYN company.
      </footer>
    </div>
  );
}