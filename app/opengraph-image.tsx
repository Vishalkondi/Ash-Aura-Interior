import fs from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontDir = path.join(process.cwd(), "node_modules/@fontsource");

export default async function OpengraphImage() {
  const [serif, sans] = await Promise.all([
    fs.readFile(path.join(fontDir, "cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff")),
    fs.readFile(path.join(fontDir, "jost/files/jost-latin-400-normal.woff")),
  ]);

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
          background: "#0a0908",
          color: "#b8956a",
          fontFamily: "Cormorant",
        }}
      >
        <div style={{ fontSize: 150, lineHeight: 1 }}>AshAura</div>
        <div style={{ display: "flex", alignItems: "center", width: 640, margin: "28px 0" }}>
          <div style={{ flex: 1, height: 1, background: "#b8956a" }} />
          <div style={{ width: 8, height: 8, margin: "0 16px", background: "#b8956a", transform: "rotate(45deg)" }} />
          <div style={{ flex: 1, height: 1, background: "#b8956a" }} />
        </div>
        <div style={{ fontSize: 40, letterSpacing: 24, paddingLeft: 24 }}>INTERIORS</div>
        <div style={{ marginTop: 56, fontFamily: "Jost", fontSize: 24, letterSpacing: 6, color: "#e8dcc8" }}>
          INTERIOR DESIGN STUDIO · PCMC, PUNE
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cormorant", data: serif, weight: 400, style: "normal" },
        { name: "Jost", data: sans, weight: 400, style: "normal" },
      ],
    },
  );
}
