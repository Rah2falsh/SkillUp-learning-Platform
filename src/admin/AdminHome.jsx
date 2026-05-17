import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import jodayn from "../assets/whiteskillup.png";
import {
  PlusCircle,
  Eye,
  BarChart3,
  LogOut,
  User,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminHome() {
  const nav = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState([]);
  const [totalCompletions, setTotalCompletions] = useState(0);

  const SECTORS = [
    "Business Development",
    "Quality & Testing",
    "Innovation",
    "Emerging Technologies",
    "Digital Transformation",
  ];

  const [form, setForm] = useState({
    title: "",
    description: "",
    sector: [],
    date: "",
    location: "",
    link: "",
    openTime: false, // If Open or Record is selected
  });

  const uid = localStorage.getItem("skillup_uid");
  const name = localStorage.getItem("skillup_user_name") || "Admin";

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const completedSnap = await getDocs(collection(db, "completed"));
      const trainingsSnap = await getDocs(collection(db, "trainings"));
      const counts = {};

      completedSnap.forEach((doc) => {
        const tId = doc.data().trainingId;
        counts[tId] = (counts[tId] || 0) + 1;
      });

      const result = trainingsSnap.docs.map((t) => ({
        id: t.id,
        title: t.data().title,
        count: counts[t.id] || 0,
      }));

      const total = Object.values(counts).reduce((a, b) => a + b, 0);
      setTotalCompletions(total);
      setInsights(result.sort((a, b) => b.count - a.count));
    } catch (err) {
      console.error("Error fetching insights:", err);
    }
  };

  const handleAddTraining = async (e) => {
    e.preventDefault();

   
    if (!form.openTime && (!form.location || !form.link)) {
      alert("Please complete all fields.");
      return;
    }

 
    if (
      !form.title ||
      !form.description ||
      form.sector.length === 0 ||
      (form.openTime && !form.date) ||
      !form.location
    ) {
      alert("Please complete all fields.");
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "trainings"), {
        ...form,
        createdAt: serverTimestamp(),
        createdBy: uid,
      });
      alert("Training added successfully!");
      setShowAddModal(false);
      setForm({
        title: "",
        description: "",
        sector: [],
        date: "",
        location: "",
        link: "",
        openTime: false,
      });
      fetchInsights();
    } catch (err) {
      console.error(err);
      alert("Failed to add training.");
    } finally {
      setLoading(false);
    }
  };

  const handleSectorToggle = (sector) => {
    setForm((prev) => {
      const exists = prev.sector.includes(sector);
      return {
        ...prev,
        sector: exists
          ? prev.sector.filter((s) => s !== sector)
          : [...prev.sector, sector],
      };
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    nav("/");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#EAECDC] to-[#dfe4d1] text-[#325443] font-[Tajawal]">
      {/* Sidebar */}
      <aside className="w-72 bg-[#325443] text-[#EAECDC] p-6 flex flex-col justify-between shadow-2xl">
        <div>
          <div className="flex justify-center mb-4">
            <img src={jodayn} alt="Jodayn Logo" className="h-20 w-auto drop-shadow-md" />
          </div>
          <div className="h-px bg-[#EAECDC]/25 mb-5" />
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#EAECDC] text-[#325443] w-10 h-10 rounded-full grid place-items-center font-bold text-lg">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold">Hello, {name}</p>
              <p className="text-xs opacity-80">Admin</p>
            </div>
          </div>
          <button
            onClick={() => nav("/admin-personal")}
            className="flex items-center gap-2 text-sm hover:underline transition"
          >
            <User size={16} /> Personal Info
          </button>
        </div>

        <div className="border-t border-[#EAECDC]/25 pt-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm hover:bg-[#EAECDC]/10 rounded-lg px-2 py-1 transition w-full"
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10 relative overflow-auto">
        <h1 className="text-4xl font-extrabold mb-10 tracking-tight">Admin HomePage</h1>

        <div className="grid grid-cols-3 gap-8">
          {/* Add */}
          <div
            onClick={() => setShowAddModal(true)}
            className="cursor-pointer p-10 bg-white/70 backdrop-blur-md border border-[#325443]/10 rounded-3xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 text-center"
          >
            <div className="bg-[#325443]/10 w-16 h-16 rounded-2xl grid place-items-center mx-auto mb-4">
              <PlusCircle size={34} className="text-[#325443]" />
            </div>
            <h3 className="text-xl font-bold">Add New Training</h3>
            <p className="text-sm opacity-70 mt-2 leading-relaxed">
              Create a new training that will be visible to all employees.
            </p>
          </div>

          {/* View */}
          <div
            onClick={() => nav("/view-trainings")}
            className="cursor-pointer p-10 bg-white/70 backdrop-blur-md border border-[#325443]/10 rounded-3xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 text-center"
          >
            <div className="bg-[#325443]/10 w-16 h-16 rounded-2xl grid place-items-center mx-auto mb-4">
              <Eye size={34} className="text-[#325443]" />
            </div>
            <h3 className="text-xl font-bold">View Trainings</h3>
            <p className="text-sm opacity-70 mt-2 leading-relaxed">
              Browse and manage all previously added trainings.
            </p>
          </div>

          {/* Insights */}
          <div
            onClick={() => setShowInsights(true)} // عرض نافذة Insights
            className="cursor-pointer p-10 bg-white/70 backdrop-blur-md border border-[#325443]/10 rounded-3xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 text-center"
          >
            <div className="bg-[#325443]/10 w-16 h-16 rounded-2xl grid place-items-center mx-auto mb-4">
              <BarChart3 size={34} className="text-[#325443]" />
            </div>
            <h3 className="text-xl font-bold">Training Insights</h3>
            <p className="text-sm opacity-70 mt-2 leading-relaxed">
              View detailed analytics and completions stats.
            </p>
          </div>
        </div>


        {/* Add New Training form */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <div
              className="relative w-[85%] max-w-2xl rounded-[32px] p-8 bg-gradient-to-br from-[#f9faf4] to-[#e3e7d7] shadow-[0_12px_60px_rgba(50,84,67,0.25)] border border-white/40 backdrop-blur-2xl overflow-hidden"
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-6 right-8 p-2 bg-[#325443]/10 hover:bg-[#325443]/20 rounded-full transition"
              >
                <X size={24} className="text-[#325443]" />
              </button>

              <h2 className="text-4xl font-extrabold text-center text-[#325443] mb-10">
                Add New Training
              </h2>

              <form onSubmit={handleAddTraining} className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full p-3 bg-white border border-[#325443]/20 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full p-3 bg-white border border-[#325443]/20 rounded-lg"
                  />
                </div>

                {/* Right Column */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Sector</label>
                  <div className="space-y-2">
                    {SECTORS.map((sector) => (
                      <div key={sector} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={form.sector.includes(sector)}
                          onChange={() => handleSectorToggle(sector)}
                          className="mr-2"
                        />
                        <span>{sector}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Choose Time</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="time"
                      checked={form.openTime}
                      onChange={() => setForm({ ...form, openTime: true })}
                    />
                    <span>Date</span>
                    <input
                      type="radio"
                      name="time"
                      checked={!form.openTime}
                      onChange={() => setForm({ ...form, openTime: false })}
                    />
                    <span>Record</span>
                  </div>
                </div>

                {form.openTime && (
                  <div>
                    <label className="block text-sm font-semibold mb-2">Date</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full p-3 bg-white border border-[#325443]/20 rounded-lg"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold mb-2">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full p-3 bg-white border border-[#325443]/20 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Link</label>
                  <input
                    type="url"
                    value={form.link}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                    className="w-full p-3 bg-white border border-[#325443]/20 rounded-lg"
                  />
                </div>

                <div className="col-span-2 text-center mt-6">
                  <button
                    type="submit"
                    className="p-3 bg-[#325443] text-white rounded-lg hover:bg-[#2b4735] transition-all"
                  >
                    {loading ? "Adding..." : "Add Training"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/*  Training Insights Pop */}
        {showInsights && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <div
              className="relative w-[80%] max-w-3xl rounded-[32px] p-8 bg-gradient-to-br from-[#f9faf4] to-[#e3e7d7] shadow-[0_12px_60px_rgba(50,84,67,0.25)] border border-white/40 backdrop-blur-2xl overflow-hidden"
            >
              <button
                onClick={() => setShowInsights(false)} // إغلاق نافذة Insights
                className="absolute top-6 right-8 p-2 bg-[#325443]/10 hover:bg-[#325443]/20 rounded-full transition"
              >
                <X size={24} className="text-[#325443]" />
              </button>

              <h2 className="text-4xl font-extrabold text-center text-[#325443] mb-10">
                Training Insights & Analytics
              </h2>

              {insights.length > 0 ? (
                <div className="flex flex-col h-full">
                  {/* Highlight */}
                  <div className="text-center mb-8">
                    <p className="text-sm opacity-80 mb-1">Top Completed Training</p>
                    <h3 className="text-2xl font-extrabold text-[#325443]">
                      {insights[0].title}
                    </h3>
                    <p className="text-sm opacity-70">
                      {insights[0].count} completions ({Math.round((insights[0].count / totalCompletions) * 100)}%)
                    </p>
                  </div>

                  {/* Chart */}
                  <div className="flex-1 flex flex-col md:flex-row gap-8">
                    <div className="flex-1 bg-white/50 rounded-2xl p-6 shadow-inner border border-[#325443]/10">
                      <h4 className="text-lg font-bold mb-4 text-center">
                        Completion Overview
                      </h4>
                      {/* Add chart logic here */}
                    </div>

                    <div className="w-full md:w-[35%] bg-white/50 rounded-2xl p-6 shadow-inner border border-[#325443]/10 overflow-y-auto">
                      <h4 className="text-lg font-bold mb-4 text-center">
                        All Trainings Stats
                      </h4>
                      {insights.map((t, i) => (
                        <div
                          key={t.id}
                          className="flex justify-between py-1 border-b border-[#325443]/10 text-sm"
                        >
                          <span className="truncate w-[70%] font-semibold">
                            {i + 1}. {t.title}
                          </span>
                          <span className="font-bold">
                            {t.count} ({Math.round((t.count / totalCompletions) * 100)}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center opacity-70 mt-20">
                  No completion data available yet.
                </p>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-center text-xs text-[#325443]/60">
        © {new Date().getFullYear()} SkillUp, for JODAYN company.
      </footer>
    </div>
  );
}