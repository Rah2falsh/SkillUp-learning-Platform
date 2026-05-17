import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import logo from "../assets/skillupempty.png";
import { ArrowLeft, CheckCircle2, Calendar, MapPin } from "lucide-react";

export default function CompletedCourses() {
  const nav = useNavigate();
  const uid = localStorage.getItem("skillup_uid");
  const [completed, setCompleted] = useState([]); 
  const [trainings, setTrainings] = useState([]);

  
  useEffect(() => {
    if (!uid) return;
    (async () => {
      try {
        const qComp = query(
          collection(db, "completed"),
          where("uid", "==", uid)
        );
        const compSnap = await getDocs(qComp);
        const rows = [];
        compSnap.forEach((d) =>
          rows.push({ docId: d.id, trainingId: d.data().trainingId })
        );
        setCompleted(rows);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [uid]);

  
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

  const compIdsOnly = useMemo(
    () => new Set(completed.map((c) => c.trainingId)),
    [completed]
  );
  const compDocByTraining = useMemo(() => {
    const m = {};
    completed.forEach((c) => {
      m[c.trainingId] = c.docId;
    });
    return m;
  }, [completed]);

  const compTrainings = trainings.filter((t) => compIdsOnly.has(t.id));

  const unmarkCompleted = async (trainingId) => {
    try {
      const docId = compDocByTraining[trainingId];
      if (!docId) return;
      await deleteDoc(doc(db, "completed", docId));
      setCompleted((prev) => prev.filter((c) => c.trainingId !== trainingId));
    } catch (e) {
      alert("Failed to unmark completed");
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#EAECDC] text-[#325443] font-[Tajawal] p-8">

      <div className="flex flex-col items-center text-center relative mb-10">

        {/* زر الرجوع */}
        <button
          onClick={() => nav(-1)}
          className="absolute right-0 top-0 px-4 py-2 border border-[#325443] rounded-xl hover:bg-[#325443] hover:text-[#EAECDC] transition"
        >
          <span className="inline-flex items-center gap-1">
            <ArrowLeft size={18} /> Back
          </span>
        </button>

        {/* الشعار */}
        <img
          src={logo}
          alt="SkillUp Logo"
          className="h-28 w-auto object-contain mb-3"
        />

        {/* العنوان */}
        <h2 className="text-2xl font-extrabold">Completed Courses</h2>
      </div>

      {/* ✅ عرض الدورات */}
      {compTrainings.length === 0 ? (
        <div className="opacity-70 text-center">
          No completed courses yet.
        </div>
      ) : (
        <div className="flex gap-4 flex-wrap justify-center">
          {compTrainings.map((t) => (
            <div
              key={t.id}
              className="w-[285px] h-[400px] bg-white border border-[#325443]/30 rounded-[18px] p-4 flex flex-col shadow hover:shadow-lg transition"
            >
              <h3 className="text-base font-extrabold leading-5">
                {t.title || t.name}
              </h3>

              <p className="text-[13px] text-[#4b5a52] mt-2 line-clamp-4">
                {t.description}
              </p>

              <div className="mt-4 flex items-center gap-3 text-[12px] text-[#4b5a52]">
                <span className="flex items-center gap-1">
                  <Calendar size={14} /> {t.date || "Soon"}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {t.location || "Online"}
                </span>
              </div>

              <div className="mt-auto flex items-center justify-between pt-4">
                <button
                  onClick={() => unmarkCompleted(t.id)}
                  className="px-3 py-2 rounded-xl border border-[#325443] text-[#325443] hover:bg-[#325443] hover:text-[#EAECDC] transition"
                >
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 size={14} /> Unmark
                  </span>
                </button>
                {t.link ? (
                  <a
                    href={t.link}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#325443] text-[#EAECDC] px-3 py-2 rounded-xl font-bold hover:opacity-90 transition"
                  >
                    Register
                  </a>
                ) : (
                  <span className="text-[12px] opacity-70">No link</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}