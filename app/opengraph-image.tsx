import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Primordial Soup - Random BFF programs interacting in a computational soup, giving rise to self-replicating digital organisms";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a14 0%, #1a1a2e 50%, #0a0a14 100%)",
          fontFamily: "monospace",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Scattered "instruction" characters in background */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            flexWrap: "wrap",
            opacity: 0.15,
            fontSize: 28,
            lineHeight: "36px",
            color: "#22d35a",
            padding: 20,
            letterSpacing: 8,
          }}
        >
          {`+->.<-[+]{>.-<}[+>.<-]+->.<-[+]{>.-<}[+>.<-]+->.<-[+]{>.-<}[+>.<-]+->.<-[+]{>.-<}[+>.<-]+->.<-[+]{>.-<}[+>.<-]+->.<-[+]{>.-<}[+>.<-]+->.<-[+]{>.-<}[+>.<-]+->.<-[+]{>.-<}[+>.<-]+->.<-[+]{>.-<}[+>.<-]+->.<-[+]{>.-<}[+>.<-]+->.<-[+]{>.-<}[+>.<-]+->.<-[+]{>.-<}[+>.<-]+->.<-[+]{>.-<}[+>.<-]+->.<-[+]{>.-<}[+>.<-]`}
        </div>
        {/* Colored dots */}
        <div
          style={{
            position: "absolute",
            top: 80,
            left: 120,
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "#22d35a",
            opacity: 0.4,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 200,
            right: 180,
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "#e63946",
            opacity: 0.35,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 140,
            left: 200,
            width: 35,
            height: 35,
            borderRadius: "50%",
            background: "#4361ee",
            opacity: 0.3,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 100,
            right: 250,
            width: 25,
            height: 25,
            borderRadius: "50%",
            background: "#ffd60a",
            opacity: 0.35,
            display: "flex",
          }}
        />
        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#e0e0e0",
              letterSpacing: -2,
              display: "flex",
            }}
          >
            Primordial Soup
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#22d35a",
              marginTop: 16,
              opacity: 0.8,
              display: "flex",
            }}
          >
            Computational Life Simulator
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#888",
              marginTop: 24,
              maxWidth: 700,
              textAlign: "center",
              lineHeight: 1.5,
              display: "flex",
            }}
          >
            Watch self-replicating programs emerge from random noise
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
