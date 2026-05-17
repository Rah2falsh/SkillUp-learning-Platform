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
import { ArrowLeft, Heart, Calendar, MapPin } from "lucide-react";

export default function FavoriteCourses() {
  const nav = useNavigate();
  const uid = localStorage.getItem("skillup_uid");
  const [favorites, setFavorites] = useState([]); 
  const [trainings, setTrainings] = useState([]);

  useEffect(() => {
    if (!uid) return;
    (async () => {
      try {
        const favQ = query(collection(db, "favorites"), where("uid", "==", uid));
        const favSnap = await getDocs(favQ);
        const rows = [];
        favSnap.forEach((d) =>
          rows.push({ docId: d.id, trainingId: d.data().trainingId })
        );
        setFavorites(rows);
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

  const favIdsOnly = useMemo(
    () => new Set(favorites.map((f) => f.trainingId)),
    [favorites]
  );
  const favDocByTraining = useMemo(() => {
    const m = {};
    favorites.forEach((f) => {
      m[f.trainingId] = f.docId;
    });
    return m;
  }, [favorites]);

  const favTrainings = trainings.filter((t) => favIdsOnly.has(t.id));

  const removeFavorite = async (trainingId) => {
    try {
      const docId = favDocByTraining[trainingId];
      if (!docId) return;
      await deleteDoc(doc(db, "favorites", docId));
      setFavorites((prev) => prev.filter((f) => f.trainingId !== trainingId));
    } catch (e) {
      alert("Failed to remove favorite");
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
        <h2 className="text-2xl font-extrabold">Favorite Courses</h2>
      </div>

      {/*  المحتوى */}
      {favTrainings.length === 0 ? (
        <div className="opacity-70 text-center">No favorites yet.</div>
      ) : (
        <div className="flex gap-4 flex-wrap justify-center">
          {favTrainings.map((t) => (
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
                  onClick={() => removeFavorite(t.id)}
                  className="px-3 py-2 rounded-xl border border-[#325443] text-[#325443] hover:bg-[#325443] hover:text-[#EAECDC] transition"
                >
                  <span className="inline-flex items-center gap-1">
                    <Heart size={14} /> Remove
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