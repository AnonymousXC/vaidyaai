import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "VaidyaAI — Local Language Symptom Explainer",
  description:
    "Describe your symptoms in your own language and get clear, compassionate guidance from our AI health assistant.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: "var(--font-nunito), Nunito, sans-serif",
              borderRadius: "12px",
            },
          }}
        />
      </body>
    </html>
  );
}
