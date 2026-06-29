import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MyCapy — Ferramentas Gratuitas Online";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "28px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div
          style={{
            width: 88,
            height: 88,
            background: "#4f46e5",
            borderRadius: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 52,
          }}
        >
          🦫
        </div>
        <span
          style={{
            fontSize: 80,
            fontWeight: 800,
            color: "white",
            letterSpacing: "-2px",
          }}
        >
          MyCapy
        </span>
      </div>

      <p
        style={{
          fontSize: 32,
          color: "#94a3b8",
          margin: 0,
          textAlign: "center",
        }}
      >
        Ferramentas Gratuitas Online · Para todos os brasileiros
      </p>

      <div style={{ display: "flex", gap: "16px" }}>
        {["90+ ferramentas", "Gratuito", "Sem cadastro"].map((tag) => (
          <span
            key={tag}
            style={{
              background: "#1e3a5f",
              color: "#93c5fd",
              borderRadius: 9999,
              padding: "10px 24px",
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
