import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: "#EAECDC",
        fontFamily: "'Tajawal', sans-serif",
        color: "#325443",
        overflow: "hidden",
      }}
    >
      {/* زر الرجوع */}
      <button
        onClick={() => navigate("/login")}
        style={{
          position: "absolute",
          top: "35px",
          right: "40px",
          backgroundColor: "transparent",
          border: "none",
          color: "#325443",
          fontSize: "28px",
          cursor: "pointer",
          fontWeight: "bold",
          zIndex: 10,
        }}
        title="Back"
      >
        ←
      </button>

 
      <img
        src="/manjodayn.PNG"
        alt="Background"
        style={{
          position: "absolute",
          right: "0",
          bottom: "0",
          width: "600px",
          height: "auto",
          opacity: 0.15,
          zIndex: 1,
        }}
      />

      <div style={{ padding: "40px 60px", zIndex: 2, position: "relative" }}>
        <img
          src="/skillupempty.png"
          alt="SkillUp Logo"
          style={{ height: "150px", width: "auto" }}
        />
      </div>

      
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "40px",
          zIndex: 5,
          position: "relative",
        }}
      >
        <h1 style={{ fontSize: "32px", fontWeight: 800, marginBottom: "30px" }}>
          Forgot Password
        </h1>

        <p style={{ marginBottom: "25px", fontSize: "16px" }}>
          Enter your email to verify your account.
        </p>

        {/* حقل الإيميل */}
        <input
          type="email"
          placeholder="username@jodayn.com"
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #325443",
            fontSize: "16px",
            width: "300px",
            marginBottom: "20px",
          }}
        />

        {/* زر Verify */}
        <button
          onClick={() => navigate("/verify")}
          style={{
            padding: "12px 32px",
            backgroundColor: "#325443",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "18px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Verify
        </button>
      </div>

      {/* الشريط السفلي */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: 0,
          width: "100%",
          height: "40px",
          backgroundColor: "#325443",
          zIndex: 2,
        }}
      ></div>
    </div>
  );
}
