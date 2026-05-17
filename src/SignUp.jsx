import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import logo from "./assets/skillupempty.png";

const SECTORS = [
  "Business Development",
  "Quality & Testing",
  "Innovation",
  "Emerging Technologies",
  "Digital Transformation",
];

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    sector: SECTORS[0],
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = res.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        role: "employee",
        sector: formData.sector,
        favorites: [],
        completed: [],
      });

      localStorage.setItem(
        "skillup_user_name",
        `${formData.firstName} ${formData.lastName}`
      );
      localStorage.setItem("skillup_role", "employee");

      navigate("/employee-home");
    } catch (error) {
      console.error("Error during sign-up:", error);
      alert(" Failed to register: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#EAECDC] text-[#325443] font-[Tajawal] flex flex-col items-center justify-center overflow-hidden">
    
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(900px 600px at 10% 10%, rgba(255,255,255,.6), transparent 60%), radial-gradient(800px 500px at 100% 90%, rgba(255,255,255,.4), transparent 70%)",
        }}
      />

      {/* SkillUp logo*/}
      <img
        src={logo}
        alt="SkillUp Logo"
        className="h-24 mb-6 drop-shadow-md z-10"
      />

      {/* the form : */}
      <div
        className="relative z-10 w-full max-w-[650px] rounded-2xl p-10 grid grid-cols-2 gap-6"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,.65), rgba(255,255,255,.40))",
          border: "1px solid rgba(255,255,255,.55)",
          boxShadow:
            "9px 14px 32px rgba(50,84,67,.18), inset -6px -6px 16px rgba(255,255,255,.7), inset 6px 6px 14px rgba(50,84,67,.08)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h1 className="col-span-2 text-3xl font-extrabold mb-4 text-center">
          Create Employee Account
        </h1>

        {/* First Name */}
        <div>
          <label className="text-sm font-semibold mb-1 block">First Name</label>
          <input
            type="text"
            name="firstName"
            required
            onChange={handleChange}
            className="w-full py-3 px-4 rounded-xl bg-white/70 border border-[#325443]/30 outline-none focus:border-[#325443] shadow-inner transition"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="text-sm font-semibold mb-1 block">Last Name</label>
          <input
            type="text"
            name="lastName"
            required
            onChange={handleChange}
            className="w-full py-3 px-4 rounded-xl bg-white/70 border border-[#325443]/30 outline-none focus:border-[#325443] shadow-inner transition"
          />
        </div>

        {/* Email */}
        <div className="col-span-2">
          <label className="text-sm font-semibold mb-1 block">Email</label>
          <input
            type="email"
            name="email"
            required
            placeholder="username@jodayn.com"
            onChange={handleChange}
            className="w-full py-3 px-4 rounded-xl bg-white/70 border border-[#325443]/30 outline-none focus:border-[#325443] shadow-inner transition"
          />
        </div>

        {/* Password */}
        <div className="col-span-2">
          <label className="text-sm font-semibold mb-1 block">Password</label>
          <input
            type="password"
            name="password"
            required
            onChange={handleChange}
            className="w-full py-3 px-4 rounded-xl bg-white/70 border border-[#325443]/30 outline-none focus:border-[#325443] shadow-inner transition"
          />
        </div>

        {/* Sector */}
        <div className="col-span-2">
          <label className="text-sm font-semibold mb-1 block">Select Sector</label>
          <select
            name="sector"
            value={formData.sector}
            onChange={handleChange}
            className="w-full py-3 px-4 rounded-xl bg-white/70 border border-[#325443]/30 outline-none focus:border-[#325443] shadow-inner transition"
          >
            {SECTORS.map((sector, i) => (
              <option key={i}>{sector}</option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <div className="col-span-2">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 mt-2 bg-[#325443] text-[#EAECDC] font-bold rounded-xl hover:brightness-95 transition-all shadow-md hover:shadow-lg"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </div>
      </div>

 
      <button
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 text-[#325443] border border-[#325443] px-4 py-2 rounded-xl font-semibold hover:bg-[#325443] hover:text-[#EAECDC] transition z-20"
      >
        ← Back
      </button>


      <p className="z-12 mt-2 text-sm text-center opacity-80">
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          className="font-bold underline cursor-pointer hover:opacity-90"
        >
          Log in
        </span>
      </p>

      <p className="absolute bottom-6 text-xs opacity-80 z-0">
        © {new Date().getFullYear()} SkillUp
      </p>
      
    </div>
  );
}