import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  Menu,
  X,
  Search as SearchIcon,
  MapPin,
  Calendar,
  Heart,
  CheckCircle2,
  ChevronRight,
  UserCircle2,
  Activity,
  LogOut,
} from "lucide-react";
import logo from "../assets/skillupempty.png";

const SECTORS = [
  "Business Development",
  "Quality & Testing",
  "Innovation",
  "Emerging Technologies",
  "Digital Transformation",
 
];

const TABS = ["My Trainings", "Favorites", "Completed"];
const PAGE_SIZE = 3;

export default function EmployeeHome() {
  const nav = useNavigate();
  const uid = localStorage.getItem("skillup_uid");

  // Identity
  const [userName, setUserName] = useState("User");

  // UI / Menu
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Data
  const [trainings, setTrainings] = useState([]);
  const [favMap, setFavMap] = useState({});
  const [completedMap, setCompletedMap] = useState({});

  // Filters / pagination
  const [sector, setSector] = useState(SECTORS[0]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [page, setPage] = useState(0);
// Popup state
const [showPopup, setShowPopup] = useState(false);
const [popupLink, setPopupLink] = useState("");
  // ---- Bootstrap
  useEffect(() => {
    const n = localStorage.getItem("skillup_user_name") || "User";
    setUserName(n);
  }, []);

  // Trainings
  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, "trainings"));
        setTrainings(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // Favorites & Completed for this uid
  useEffect(() => {
    if (!uid) return;
    (async () => {
      try {
        const favSnap = await getDocs(
          query(collection(db, "favorites"), where("uid", "==", uid))
        );
        const favs = {};
        favSnap.forEach((row) => (favs[row.data().trainingId] = row.id));
        setFavMap(favs);

        const compSnap = await getDocs(
          query(collection(db, "completed"), where("uid", "==", uid))
        );
        const comps = {};
        compSnap.forEach((row) => (comps[row.data().trainingId] = row.id));
        setCompletedMap(comps);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [uid]);

  // ---- Derived
  const filtered = useMemo(() => {
    let base = trainings;

    if (activeTab === "Favorites") {
      const ids = new Set(Object.keys(favMap));
      base = base.filter((t) => ids.has(t.id));
    } else if (activeTab === "Completed") {
      const ids = new Set(Object.keys(completedMap));
      base = base.filter((t) => ids.has(t.id));
    } else if (activeTab === "Recommended") {
 
      base = base
        .filter((t) => t.sector === sector)
        .filter((t) => !completedMap[t.id]);
    }

  
    if (activeTab !== "Recommended") {
      base = base.filter((t) => {
        if (!sector) return true;
        if (!t.sector) return false;
    
   
        if (Array.isArray(t.sector)) {
          return t.sector.includes(sector);
        }
        return t.sector === sector;
      });
    }

    // search
    const q = search.trim().toLowerCase();
    if (q) {
      base = base.filter((t) =>
        ((t.title || "") + " " + (t.description || ""))
          .toLowerCase()
          .includes(q)
      );
    }

    return base;
  }, [trainings, sector, search, activeTab, favMap, completedMap]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const items = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const next = () => setPage((p) => (p + 1) % pages);

  // Stats 
  const statCompleted = Object.keys(completedMap).length;
  const statFavorites = Object.keys(favMap).length;
  const statUpcoming = trainings.filter((t) => !!t.date).length;

 
  const toggleFavorite = async (id) => {
    if (!uid) return nav("/login");
    try {
      if (favMap[id]) {
        await deleteDoc(doc(db, "favorites", favMap[id]));
        const copy = { ...favMap };
        delete copy[id];
        setFavMap(copy);
      } else {
        const d = await addDoc(collection(db, "favorites"), {
          uid,
          trainingId: id,
          createdAt: serverTimestamp(),
        });
        setFavMap({ ...favMap, [id]: d.id });
      }
    } catch (e) {
      alert("Failed updating favorites");
      console.error(e);
    }
  };

  const toggleCompleted = async (id) => {
    if (!uid) return nav("/login");
    try {
      if (completedMap[id]) {
        await deleteDoc(doc(db, "completed", completedMap[id]));
        const copy = { ...completedMap };
        delete copy[id];
        setCompletedMap(copy);
      } else {
        const d = await addDoc(collection(db, "completed"), {
          uid,
          trainingId: id,
          createdAt: serverTimestamp(),
        });
        setCompletedMap({ ...completedMap, [id]: d.id });
      }
    } catch (e) {
      alert("Failed updating completed");
      console.error(e);
    }
  };

  const logout = () => {
    localStorage.removeItem("skillup_user_name");
    localStorage.removeItem("skillup_role");
    localStorage.removeItem("skillup_uid");
    nav("/login");
  };

  const initial = (userName?.trim()?.[0] || "U").toUpperCase();

  return (
    <div className="relative min-h-screen bg-[#EAECDC] text-[#325443] font-[Tajawal] overflow-x-hidden">
     
      <div className="pointer-events-none absolute inset-0"
           style={{
             background:
               "radial-gradient(1200px 600px at -10% -10%, rgba(255,255,255,.5), transparent 60%), radial-gradient(900px 500px at 110% 10%, rgba(255,255,255,.4), transparent 55%)",
           }}/>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
    
        <header
          className="rounded-2xl px-5 py-4 mb-8"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,.56), rgba(255,255,255,.36))",
            boxShadow:
              "inset 1px 1px 0 rgba(255,255,255,.5), inset -1px -1px 0 rgba(0,0,0,.04), 6px 10px 28px rgba(50,84,67,.12)",
            border: "1px solid rgba(255,255,255,.45)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={logo}
                alt="SkillUp"
                className="h-16 w-auto object-contain"
                style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.08))" }}
              />
              <div className="leading-tight">
                <div className="text-sm opacity-70">Welcome</div>
                <div className="text-2xl font-extrabold capitalize tracking-tight">
                  {userName}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-3 rounded-xl bg-[#325443] text-[#EAECDC] hover:opacity-90 transition"
              aria-label="Open Menu"
              title="Menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </header>

     
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div
            className="rounded-2xl p-5"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,.6), rgba(255,255,255,.4))",
              boxShadow:
                "6px 10px 28px rgba(50,84,67,.14), inset -5px -5px 12px rgba(255,255,255,.7), inset 6px 6px 12px rgba(50,84,67,.08)",
              border: "1px solid rgba(255,255,255,.5)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="text-xs opacity-70 tracking-wide">COMPLETED</div>
            <div className="mt-1 text-3xl font-extrabold">{statCompleted}</div>
          </div>

          <div
            className="rounded-2xl p-5"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,.6), rgba(255,255,255,.4))",
              boxShadow:
                "6px 10px 28px rgba(50,84,67,.14), inset -5px -5px 12px rgba(255,255,255,.7), inset 6px 6px 12px rgba(50,84,67,.08)",
              border: "1px solid rgba(255,255,255,.5)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="text-xs opacity-70 tracking-wide">FAVORITES</div>
            <div className="mt-1 text-3xl font-extrabold">{statFavorites}</div>
          </div>

          <div
            className="rounded-2xl p-5"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,.6), rgba(255,255,255,.4))",
              boxShadow:
                "6px 10px 28px rgba(50,84,67,.14), inset -5px -5px 12px rgba(255,255,255,.7), inset 6px 6px 12px rgba(50,84,67,.08)",
              border: "1px solid rgba(255,255,255,.5)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="text-xs opacity-70 tracking-wide">UPCOMING</div>
            <div className="mt-1 text-3xl font-extrabold">{statUpcoming}</div>
          </div>
        </section>

        {/* Welcome tools — Sector + Search */}
        <section
          className="rounded-2xl p-5 mb-6"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,.58), rgba(255,255,255,.38))",
            boxShadow:
              "inset 1px 1px 0 rgba(255,255,255,.5), inset -1px -1px 0 rgba(0,0,0,.04), 6px 10px 28px rgba(50,84,67,.12)",
            border: "1px solid rgba(255,255,255,.45)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            <select
              className="min-w-[260px] px-4 py-3 rounded-xl font-semibold bg-[#325443] text-[#EAECDC] border border-[#325443] outline-none"
              value={sector}
              onChange={(e) => {
                setSector(e.target.value);
                setPage(0);
              }}
            >
              {SECTORS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <div className="flex items-center gap-2 w-full lg:w-[420px] px-4 py-3 rounded-xl bg-white/70 border border-[#D9DCCF]">
              <SearchIcon size={18} />
              <input
                type="text"
                placeholder="Search trainings, programs, certificates…"
                className="bg-transparent outline-none w-full text-sm"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
              />
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map((tab) => {
            const on = tab === activeTab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setPage(0);
                }}
                className={[
                  "px-6 py-2 rounded-full text-sm font-extrabold transition",
                  on
                    ? "bg-white/70 border border-white/60 shadow"
                    : "bg-[#D9DCCF] hover:bg-[#cfd3c3]",
                ].join(" ")}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((t) => {
            const isFav = !!favMap[t.id];
            const isComp = !!completedMap[t.id];

            return (
              <div
                key={t.id}
                className="rounded-2xl p-5 transition hover:-translate-y-0.5"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,.62), rgba(255,255,255,.42))",
                  boxShadow:
                    "9px 14px 32px rgba(50,84,67,.16), inset -6px -6px 16px rgba(255,255,255,.7), inset 6px 6px 16px rgba(50,84,67,.08)",
                  border: "1px solid rgba(255,255,255,.52)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div className="text-base font-extrabold line-clamp-1">
                  {t.title || t.name || "Untitled"}
                </div>
                <div className="text-[13px] opacity-80 mt-2 line-clamp-4">
                  {t.description || ""}
                </div>

                <div className="mt-4 flex items-center gap-3 text-[12px] opacity-75">
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={14} /> {t.date || "Record"}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={14} /> {t.location || "Online"}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={() => toggleFavorite(t.id)}
                    className={`text-sm px-3 py-2 rounded-xl border inline-flex items-center gap-1 transition ${
                      isFav
                        ? "bg-[#325443] text-[#EAECDC] border-[#325443]"
                        : "border-[#325443] hover:bg-[#325443] hover:text-[#EAECDC]"
                    }`}
                    title="Toggle favorite"
                  >
                    <Heart size={14} /> {isFav ? "Favorited" : "Favorite"}
                  </button>

                  <button
                    onClick={() => toggleCompleted(t.id)}
                    className={`text-sm px-3 py-2 rounded-xl border inline-flex items-center gap-1 transition ${
                      isComp
                        ? "bg-[#325443] text-[#EAECDC] border-[#325443]"
                        : "border-[#325443] hover:bg-[#325443] hover:text-[#EAECDC]"
                    }`}
                    title="Mark as completed / unmark"
                  >
                    <CheckCircle2 size={14} /> {isComp ? "Completed" : "Mark Done"}
                  </button>

                  {t.link ? (
  <button
    onClick={() => {
      setPopupLink(t.link);
      setShowPopup(true);
    }}
    className="text-sm px-3 py-2 rounded-xl font-bold bg-[#325443] text-[#EAECDC] hover:opacity-90 transition inline-flex items-center gap-1"
  >
    Register <ChevronRight size={16} />
  </button>
) : (
  <span className="text-[12px] opacity-70">No link</span>
)}
                </div>
              </div>
            );
          })}
        </section>

        {/* More */}
        {filtered.length > PAGE_SIZE && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={next}
              className="w-[46px] h-[46px] rounded-full grid place-items-center"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,.64), rgba(255,255,255,.44))",
                boxShadow:
                  "6px 10px 28px rgba(50,84,67,.14), inset -5px -5px 12px rgba(255,255,255,.7), inset 6px 6px 12px rgba(50,84,67,.08)",
                border: "1px solid rgba(255,255,255,.5)",
                backdropFilter: "blur(6px)",
              }}
              title="More"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="mt-10 opacity-70">No trainings available.</div>
        )}
      </div>
      

      {/* Sidebar (Menu) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => setIsSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black/35 backdrop-blur-sm" />

          <aside
            className="absolute right-0 top-0 h-full w-[340px] p-6 text-[#EAECDC]"
            style={{
              background: "rgba(50,84,67,.92)",
              boxShadow:
                "-18px 0 36px rgba(50,84,67,.22), inset -6px -6px 16px rgba(0,0,0,.08), inset 6px 6px 16px rgba(255,255,255,.06)",
              borderLeft: "1px solid rgba(255,255,255,.12)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-white/15 grid place-items-center text-lg font-extrabold">
                  {initial}
                </div>
                <div className="leading-tight">
                  <div className="font-extrabold capitalize">{userName}</div>
                  <div className="text-xs opacity-80">Employee</div>
                </div>
              </div>

              <button
                className="hover:opacity-80"
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Close"
              >
                <X size={22} />
              </button>
            </div>

            <div className="h-px bg-white/15 mb-5" />

            <nav className="flex flex-col gap-2">
              <button
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10"
                onClick={() => {
                  setIsSidebarOpen(false);
                  nav("/personal-info");
                }}
              >
                <UserCircle2 size={18} /> Personal Information
              </button>

              <button
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10"
                onClick={() => {
                  setIsSidebarOpen(false);
                  nav("/learning-journey");
                }}
              >
                <Activity size={18} /> Learning Journey
              </button>
              
            </nav>

            <div className="absolute left-0 right-0 bottom-0 p-6">
              <button
                onClick={logout}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#EAECDC] text-[#325443] px-4 py-3 rounded-xl font-bold hover:brightness-95"
              >
                <LogOut size={18} />
                Log Out
              </button>
            </div>
          </aside>
        </div>
      )}
       {/*  Popup for external link */}
{showPopup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-[#f9f9f3] text-[#325443] rounded-3xl p-8 shadow-2xl border border-[#325443]/20 w-[400px] text-center">
      <h2 className="text-xl font-extrabold mb-3">External Link</h2>
      <p className="text-sm opacity-80 mb-6">
        You are about to leave SkillUp and open an external website.
      </p>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => {
            window.open(popupLink, "_blank");
            setShowPopup(false);
          }}
          className="px-5 py-2 rounded-xl font-semibold bg-[#325443] text-[#EAECDC] hover:opacity-90 transition"
        >
          OK
        </button>
        <button
          onClick={() => setShowPopup(false)}
          className="px-5 py-2 rounded-xl font-semibold border border-[#325443] hover:bg-[#325443] hover:text-[#EAECDC] transition"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
         <footer className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-center text-xs text-[#325443]/60">
  © {new Date().getFullYear()} SkillUp, for JODAYN company.
</footer>
    </div>
    
  );
}