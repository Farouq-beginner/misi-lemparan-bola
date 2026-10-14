import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keluaran mandiri (standalone) — dipakai oleh `bun run start`.
  output: "standalone",
  // Sengaja nonaktif: mode ketat memanggil efek dua kali saat pengembangan,
  // sehingga tulisan berulang ke localStorage terlihat seperti ganda.
  reactStrictMode: false,
};

export default nextConfig;
