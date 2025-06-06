// import "../public/styles/statistics.css";
import "/app/styles/statistics.css";

export const metadata = {
  title: "Student Management App",
  description: "Generated by Next.js",
};

import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
