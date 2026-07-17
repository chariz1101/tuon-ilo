import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";

export const metadata: Metadata = {
  title: "charchives — Chariz Dianne Falco",
  description: "Portfolio of Chariz Dianne Falco, BS Computer Science — Artificial Intelligence, Magna Cum Laude.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}