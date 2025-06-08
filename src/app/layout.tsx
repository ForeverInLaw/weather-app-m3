import type { Metadata } from "next";
import "./globals.css";
import ThemeRegistry from "@/components/ThemeRegistry"; // Import ThemeRegistry

export const metadata: Metadata = {
  title: "Weather App M3", // Updated title
  description: "Detailed weather information with Material 3 expressive design", // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
