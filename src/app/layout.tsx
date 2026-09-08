import type { Metadata, Viewport } from "next";
import "@fontsource/bebas-neue";
import "@fontsource-variable/inter";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arqueros | Seguimiento de rendimiento",
  description:
    "Plataforma para que arqueros y entrenadores registren entrenamientos y estadísticas de rendimiento.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#132A22",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
