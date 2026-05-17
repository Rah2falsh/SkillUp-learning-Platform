import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/skillupempty.png";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";

export default function LearningJourney() {
  const nav = useNavigate();
  const uid = localStorage.getItem("skillup_uid");

  const [userName, setUserName] = useState("User");
  const [trainings, setTrainings] = useState([]);
  const [completedRows, setCompletedRows] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const n = localStorage.getItem("skillup_user_name") || "User";
    setUserName(n);
  }, []);

  // Fetch trainings
  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, "trainings"));
        const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setTrainings(all);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // Fetch completed
  useEffect(() => {
    if (!uid) return;
    (async () => {
      try {
        const qComp = query(collection(db, "completed"), where("uid", "==", uid));
        const compSnap = await getDocs(qComp);
        const rows = [];
        compSnap.forEach((d) => rows.push({ docId: d.id, ...d.data() }));
        setCompletedRows(rows);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [uid]);

  // Fetch favorites
  useEffect(() => {
    if (!uid) return;
    (async () => {
      try {
        const qFav = query(collection(db, "favorites"), where("uid", "==", uid));
        const favSnap = await getDocs(qFav);
        const favs = favSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setFavorites(favs);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [uid]);

  const trainingMap = useMemo(() => {
    const m = {};
    trainings.forEach((t) => {
      m[t.id] = t;
    });
    return m;
  }, [trainings]);

  const completed = useMemo(() => {
    return completedRows
      .map((r) => ({ ...r, training: trainingMap[r.trainingId] }))
      .filter((r) => r.training);
  }, [completedRows, trainingMap]);

  const completedCount = completed.length;
  const favCount = favorites.length;

  // now depending on favorites onlyyyy
  const percent = Math.round((favCount / (trainings.length || 1)) * 100);

  const size = 220;
  const stroke = 14;
  const center = size / 2;
  const radius = center - stroke / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#EAECDC] text-[#325443] font-[Tajawal]">
        <img
          src={logo}
          alt="SkillUp"
          className="h-24 w-auto mb-6 drop-shadow-md animate-pulse"
        />
        <p className="text-lg font-semibold animate-pulse opacity-70">
          Loading your Learning Journey...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EAECDC] text-[#325443] font-[Tajawal] relative overflow-x-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 600px at -10% -10%, rgba(255,255,255,.55), transparent 60%), radial-gradient(900px 500px at 110% 10%, rgba(255,255,255,.45), transparent 55%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <img
            src={logo}
            alt="SkillUp"
            className="h-24 w-auto object-contain"
            style={{ filter: "drop-shadow(0 6px 12px rgba(0,0,0,.08))" }}
          />
          <h1 className="text-3xl font-extrabold tracking-tight">Learning Journey</h1>
          <p className="opacity-70 text-sm">Performance overview for {userName}</p>

          <button
            onClick={() => nav(-1)}
            className="mt-2 px-4 py-2 rounded-xl border border-[#325443] hover:bg-[#325443] hover:text-[#EAECDC] transition"
          >
            <span className="inline-flex items-center gap-2">
              <ArrowLeft size={18} /> Back 
            </span>
          </button>
        </div>

        {/* الكومبونت اللي تعرض لي نسبة الانجااز*/}
        <section className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 mb-10 items-center">
          <div
            className="rounded-3xl p-5 mx-auto"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,.62), rgba(255,255,255,.42))",
              boxShadow:
                "9px 14px 32px rgba(50,84,67,.16), inset -6px -6px 16px rgba(255,255,255,.7), inset 6px 6px 16px rgba(50,84,67,.08)",
              border: "1px solid rgba(255,255,255,.52)",
              backdropFilter: "blur(8px)",
            }}
          >
            <svg width={size} height={size}>
              <circle cx={center} cy={center} r={radius} stroke="#D9DCCF" strokeWidth={stroke} fill="none" />
              <circle
                cx={center}
                cy={center}
                r={radius}
                stroke="#325443"
                strokeWidth={stroke}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 800ms ease" }}
                transform={`rotate(-90 ${center} ${center})`}
              />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                fontSize="28"
                fontWeight="800"
                fill="#325443"
              >
                {percent}%
              </text>
              <text
                x="50%"
                y="62%"
                textAnchor="middle"
                fontSize="12"
                fill="#325443"
                opacity="0.7"
              >
                Favorites Progress
              </text>
            </svg>
          </div>

          <div>
            {/* Progress Bar */}
            <div
              className="rounded-2xl p-5 mb-6"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,.6), rgba(255,255,255,.4))",
                boxShadow:
                  "6px 10px 28px rgba(50,84,67,.14), inset -5px -5px 12px rgba(255,255,255,.7), inset 6px 6px 12px rgba(50,84,67,.08)",
                border: "1px solid rgba(255,255,255,.5)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-bold">Overall Progress</div>
                <div className="text-sm opacity-70">
                  {favCount}/{trainings.length || 0}
                </div>
              </div>
              <div className="w-full h-4 rounded-full bg-[#D9DCCF] overflow-hidden">
                <div
                  className="h-full"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: "#325443",
                    transition: "width 800ms ease",
                  }}
                />
              </div>
            </div>

            {/* كرتين فقط — متوسعين */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Completed", value: completedCount },
                { label: "In Progress", value: favCount },
              ].map((card) => (
                <div
                  key={card.label}
                  className="rounded-2xl p-6 sm:p-8 w-full"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,.6), rgba(255,255,255,.4))",
                    boxShadow:
                      "6px 10px 28px rgba(50,84,67,.14), inset -5px -5px 12px rgba(255,255,255,.7), inset 6px 6px 12px rgba(50,84,67,.08)",
                    border: "1px solid rgba(255,255,255,.5)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div className="text-sm opacity-70 tracking-wide font-semibold">
                    {card.label}
                  </div>
                  <div className="mt-2 text-4xl font-extrabold">{card.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/*  Timeline */}
        <section
          className="rounded-3xl p-6"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,.58), rgba(255,255,255,.38))",
            boxShadow:
              "inset 1px 1px 0 rgba(255,255,255,.5), inset -1px -1px 0 rgba(0,0,0,.04), 6px 10px 28px rgba(50,84,67,.12)",
            border: "1px solid rgba(255,255,255,.45)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-extrabold">Completed Timeline</h3>
            <div className="text-sm opacity-70">{completedCount} items</div>
          </div>

          {completed.length === 0 ? (
            <div className="opacity-70">No completed trainings yet.</div>
          ) : (
            <ol className="relative border-s border-[#D9DCCF] ml-4">
              {completed.map((row) => {
                const t = row.training;
                const created =
                  row.createdAt?.toDate?.() ||
                  (row.createdAt?.seconds
                    ? new Date(row.createdAt.seconds * 1000)
                    : null);
                const dateLabel = created
                  ? created.toLocaleDateString()
                  : t?.date || "Completed";
                return (
                  <li key={row.docId} className="mb-6 ms-5">
                    <span className="absolute -start-2.5 inline-flex items-center justify-center w-5 h-5 rounded-full ring-4 ring-[#EAECDC] bg-[#325443]" />
                    <div
                      className="rounded-2xl p-4"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,.62), rgba(255,255,255,.42))",
                        boxShadow:
                          "9px 14px 32px rgba(50,84,67,.16), inset -6px -6px 16px rgba(255,255,255,.7), inset 6px 6px 16px rgba(50,84,67,.08)",
                        border: "1px solid rgba(255,255,255,.52)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <h4 className="text-base font-extrabold line-clamp-1">
                          {t?.title || t?.name || "Untitled"}
                        </h4>
                        <div className="text-xs opacity-70">{dateLabel}</div>
                      </div>
                      <p className="text-[13px] opacity-80 mt-2 line-clamp-2">
                        {t?.description || ""}
                      </p>
                      <div className="mt-3 flex items-center gap-3 text-[12px] opacity-75">
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={14} /> {t?.date || "Completed"}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={14} /> {t?.location || "—"}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </section>

        <div className="flex justify-center mt-10">
          <button
            onClick={() => nav("/employee-home")}
            className="px-5 py-3 rounded-xl font-bold bg-[#325443] text-[#EAECDC] hover:opacity-90 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}