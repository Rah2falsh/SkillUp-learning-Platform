import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import logo from "../assets/skillupempty.png";
import { ArrowLeft, User2, Pencil, Check, X } from "lucide-react";

const SECTORS = [
  "Business Development",
  "Quality & Testing",
  "Innovation",
  "Emerging Technologies",
  "Digital Transformation",
];

export default function PersonalInfo() {
  const nav = useNavigate();
  const uid = localStorage.getItem("skillup_uid");
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const docRef = doc(db, "users", uid);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setUserData(snapshot.data());
          setTempData(snapshot.data());
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
      setLoading(false);
    };

    if (uid) fetchUser();
  }, [uid]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "users", uid);
      const updatedData = {
        name: tempData.name,
        sector: tempData.sector,
      };

      if (tempData.password && tempData.password.trim() !== "") {
        updatedData.password = tempData.password;
      }

      await updateDoc(docRef, updatedData);
      setUserData({ ...tempData });

      localStorage.setItem("skillup_user_name", tempData.name);

      alert("Information updated successfully!");
      setEditMode(false);
    } catch (e) {
      alert("Failed to update");
    }
    setLoading(false);
  };

  if (loading || !userData)
    return <div className="text-center mt-20 text-skill-primary">Loading...</div>;

  return (
    <div className="min-h-screen bg-skill-bg text-skill-primary font-[Tajawal] p-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        {/* Centered Logo & Title */}
        <div className="flex flex-col mx-auto text-center">
          <img
            src={logo}
            alt="SkillUp"
            className="h-28 w-auto object-contain mx-auto mb-3"
          />
          <h2 className="text-3xl font-extrabold tracking-wide">
            Personal Information
          </h2>
        </div>

        {/* Back Button */}
        <button
          onClick={() => nav(-1)}
          className="glass px-4 py-2 rounded-xl hover-lift"
        >
          <span className="inline-flex items-center gap-2">
            <ArrowLeft size={18} /> Back
          </span>
        </button>
      </div>

      {/* Profile Card */}
      <div className="glass rounded-[20px] w-[600px] mx-auto p-10 hover-lift shadow-xl transition">
        {/* Avatar & Basic Info */}
        <div className="flex items-center gap-6 mb-10">
          <div className="w-20 h-20 rounded-full bg-skill-primary text-skill-bg grid place-items-center shadow-lg">
            <User2 size={38} />
          </div>
          <div>
            <h3 className="text-2xl font-bold capitalize">
              {editMode ? (
                <input
                  className="border border-skill-primary rounded-lg px-3 py-2 w-full"
                  value={tempData.name}
                  onChange={(e) =>
                    setTempData({ ...tempData, name: e.target.value })
                  }
                />
              ) : (
                userData.name
              )}
            </h3>
            <p className="text-sm opacity-75 mt-1">Employee</p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-8 text-lg">
          {/* Email */}
          <div>
            <label className="text-sm font-semibold uppercase opacity-70">
              Email
            </label>
            <div className="mt-1">
              <p className="font-medium">{userData.email}</p>
            </div>
          </div>

          {/* Sector */}
          <div>
            <label className="text-sm font-semibold uppercase opacity-70">
              Sector
            </label>
            {editMode ? (
              <select
                value={tempData.sector}
                onChange={(e) =>
                  setTempData({ ...tempData, sector: e.target.value })
                }
                className="border border-skill-primary rounded-lg px-3 py-2 w-full"
              >
                {SECTORS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            ) : (
              <p className="font-medium mt-1">{userData.sector}</p>
            )}
          </div>


          {editMode && (
            <div>
              <label className="text-sm font-semibold uppercase opacity-70">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                className="border border-skill-primary rounded-lg px-3 py-2 w-full mt-1"
                value={tempData.password || ""}
                onChange={(e) =>
                  setTempData({ ...tempData, password: e.target.value })
                }
              />
              <p className="text-xs opacity-70 mt-1">
                Leave blank if you don’t want to change your password.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-10">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="btn-sk inline-flex items-center gap-2"
            >
              <Pencil size={18} /> Edit
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setEditMode(false);
                  setTempData(userData);
                }}
                className="glass px-4 py-2 rounded-xl hover-lift inline-flex items-center gap-2"
              >
                <X size={18} /> Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn-sk inline-flex items-center gap-2"
              >
                <Check size={18} /> Save
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}