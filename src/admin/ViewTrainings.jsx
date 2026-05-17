import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import {
  Eye,
  X,
  Calendar,
  MapPin,
  Trash2,
  Pencil,
  Heart,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ViewTrainings() {
  const nav = useNavigate();
  const [trainings, setTrainings] = useState([]);
  const [filteredTrainings, setFilteredTrainings] = useState([]);
  const [sectorFilter, setSectorFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [details, setDetails] = useState({ favorites: [], completed: [] });
  const [loading, setLoading] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);

  const SECTORS = [
    "All",
    "Business Development",
    "Quality & Testing",
    "Innovation",
    "Emerging Technologies",
    "Digital Transformation",
  ];

  const fetchTrainings = async () => {
    const snap = await getDocs(collection(db, "trainings"));
    const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setTrainings(all);
    setFilteredTrainings(all);
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  useEffect(() => {
    if (sectorFilter === "All") {
      setFilteredTrainings(trainings);
    } else {
      setFilteredTrainings(
        trainings.filter((t) =>
          Array.isArray(t.sector)
            ? t.sector.includes(sectorFilter)
            : t.sector === sectorFilter
        )
      );
    }
  }, [sectorFilter, trainings]);

  const fetchDetails = async (trainingId) => {
    setLoading(true);
    try {
      const favSnap = await getDocs(
        query(collection(db, "favorites"), where("trainingId", "==", trainingId))
      );
      const compSnap = await getDocs(
        query(collection(db, "completed"), where("trainingId", "==", trainingId))
      );

      const favorites = [];
      const completed = [];

      for (const f of favSnap.docs) {
        const uRef = doc(db, "users", f.data().uid);
        const u = await getDoc(uRef);
        if (u.exists()) favorites.push(u.data().name || "Unknown User");
      }

      for (const c of compSnap.docs) {
        const uRef = doc(db, "users", c.data().uid);
        const u = await getDoc(uRef);
        if (u.exists()) completed.push(u.data().name || "Unknown User");
      }

      setDetails({ favorites, completed });
      setSelected(trainingId);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this training?")) return;
    await deleteDoc(doc(db, "trainings", id));
    alert("Training deleted successfully.");
    fetchTrainings();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editItem?.title) return alert("Please fill all fields.");
    setSaving(true);
    try {
      await updateDoc(doc(db, "trainings", editItem.id), {
        title: editItem.title,
        description: editItem.description,
        date: editItem.date,
        location: editItem.location,
        link: editItem.link,
        sector: editItem.sector || [],
      });
      alert("Training updated successfully!");
      setEditItem(null);
      fetchTrainings();
    } catch (err) {
      console.error(err);
      alert("Failed to update training.");
    } finally {
      setSaving(false);
    }
  };

  const toggleSector = (sector) => {
    setEditItem((prev) => {
      const exists = prev?.sector?.includes(sector);
      return {
        ...prev,
        sector: exists
          ? prev.sector.filter((s) => s !== sector)
          : [...(prev.sector || []), sector],
      };
    });
  };

  const selectedTraining = trainings.find((t) => t.id === selected);

  return (
    <div className="min-h-screen bg-[#EAECDC] text-[#325443] font-[Tajawal] p-10">
      <h1 className="text-3xl font-extrabold mb-10 text-center">All Trainings</h1>

      {/*  Back + Filter  BUTTONS */}
      <div className="mb-8 flex flex-wrap items-center justify-start gap-4">
        <button
          onClick={() => nav("/admin-home")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#325443] text-[#325443] font-semibold hover:bg-[#325443] hover:text-[#EAECDC] transition"
        >
          ← Back
        </button>

        <div
          className="rounded-xl px-4 py-2.5 border border-white/50 shadow-md bg-white/50 backdrop-blur-md hover:shadow-lg transition"
          style={{
            boxShadow:
              "inset 1px 1px 0 rgba(255,255,255,.5), inset -1px -1px 0 rgba(0,0,0,.06), 4px 6px 16px rgba(50,84,67,.14)",
            border: "1px solid rgba(255,255,255,.55)",
          }}
        >
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="bg-transparent text-[#325443] font-semibold outline-none cursor-pointer"
          >
            {SECTORS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Trainings grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTrainings.map((t) => (
          <div
            key={t.id}
            className="rounded-2xl p-6 transition hover:-translate-y-1"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,.62), rgba(255,255,255,.42))",
              boxShadow:
                "9px 14px 32px rgba(50,84,67,.16), inset -6px -6px 16px rgba(255,255,255,.7), inset 6px 6px 16px rgba(50,84,67,.08)",
              border: "1px solid rgba(255,255,255,.52)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="font-extrabold text-lg line-clamp-1">{t.title}</div>
            <div className="text-sm opacity-80 mt-2 line-clamp-3">{t.description}</div>

            <div className="mt-4 flex flex-col gap-1 text-[13px] opacity-80">
              <div className="flex items-center gap-2">
                <Calendar size={14} /> {t.openTime ? "Recorded" : (t.date || "Soon")}
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} /> {t.location || "Online"}
              </div>
            </div>

            <div className="flex justify-between items-center mt-5">
              <button
                onClick={() => fetchDetails(t.id)}
                className="flex-1 py-2.5 rounded-xl bg-[#325443] text-[#EAECDC] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition"
              >
                <Eye size={18} /> View
              </button>
              <button
                onClick={() => setEditItem(t)}
                className="p-2 bg-yellow-50 hover:bg-yellow-100 rounded-lg ml-2 transition border border-yellow-200"
                title="Edit"
              >
                <Pencil size={16} className="text-yellow-800" />
              </button>
              <button
                onClick={() => handleDelete(t.id)}
                className="p-2 bg-red-50 hover:bg-red-100 rounded-lg ml-1 transition border border-red-200"
                title="Delete"
              >
                <Trash2 size={16} className="text-red-800" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 💧 View Modal */}
      {selectedTraining && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="rounded-3xl p-8 relative shadow-2xl border border-white/40 bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-xl max-w-[720px] w-full"
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-5 right-6 text-[#325443] hover:opacity-70 transition"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-extrabold mb-4 text-center">
              {selectedTraining.title}
            </h2>
            <p className="text-sm opacity-80 mb-6 text-center">
              {selectedTraining.description}
            </p>

            <div className="flex justify-center gap-6 text-sm opacity-85 mb-6">
              <div className="flex items-center gap-2">
                <Calendar size={14} />{" "}
                {selectedTraining.openTime
                  ? "Recorded"
                  : selectedTraining.date || "Soon"}
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} /> {selectedTraining.location || "Online"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="rounded-2xl p-4 bg-white/60 shadow-inner border border-[#325443]/20">
                <div className="font-bold mb-2 flex items-center gap-1">
                  <Heart size={15} /> Favorites
                </div>
                {details.favorites.length > 0 ? (
                  <ul className="list-disc list-inside text-sm">
                    {details.favorites.map((n, i) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm opacity-70">No favorites yet.</div>
                )}
              </div>

              <div className="rounded-2xl p-4 bg-white/60 shadow-inner border border-[#325443]/20">
                <div className="font-bold mb-2 flex items-center gap-1">
                  <CheckCircle2 size={15} /> Completed
                </div>
                {details.completed.length > 0 ? (
                  <ul className="list-disc list-inside text-sm">
                    {details.completed.map((n, i) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm opacity-70">No completions yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal - Modern Flat Style */}
      {editItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white w-[700px] rounded-2xl p-8 relative shadow-2xl border border-[#dcded1]">
            <button
              onClick={() => setEditItem(null)}
              className="absolute top-5 right-6 text-[#325443] hover:opacity-70 transition"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-extrabold mb-6 text-center text-[#325443]">
              Edit Training
            </h2>

            <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="text-sm font-semibold">Title</label>
                <input
                  value={editItem.title}
                  onChange={(e) =>
                    setEditItem({ ...editItem, title: e.target.value })
                  }
                  className="w-full p-2 rounded-xl border border-[#c6c9b8] bg-[#f7f8f3]"
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-semibold">Description</label>
                <textarea
                  value={editItem.description}
                  onChange={(e) =>
                    setEditItem({ ...editItem, description: e.target.value })
                  }
                  className="w-full min-h-[100px] p-2 rounded-xl border border-[#c6c9b8] bg-[#f7f8f3]"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Date</label>
                <input
                  type="date"
                  value={editItem.date}
                  onChange={(e) =>
                    setEditItem({ ...editItem, date: e.target.value })
                  }
                  className="w-full p-2 rounded-xl border border-[#c6c9b8] bg-[#f7f8f3]"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Location</label>
                <input
                  value={editItem.location}
                  onChange={(e) =>
                    setEditItem({ ...editItem, location: e.target.value })
                  }
                  className="w-full p-2 rounded-xl border border-[#c6c9b8] bg-[#f7f8f3]"
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-semibold">Registration Link</label>
                <input
                  value={editItem.link}
                  onChange={(e) =>
                    setEditItem({ ...editItem, link: e.target.value })
                  }
                  className="w-full p-2 rounded-xl border border-[#c6c9b8] bg-[#f7f8f3]"
                />
              </div>

              <div className="col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 bg-[#325443] text-[#EAECDC] font-bold rounded-xl hover:bg-[#2b4639] transition"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}