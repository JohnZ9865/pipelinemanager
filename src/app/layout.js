import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from './context/AuthContext';
import Navbar from '../components/Navbar';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Pipeline Dashboard",
  description: "Contact management pipeline dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthContextProvider>
          <Navbar />
          <main>{children}</main>
        </AuthContextProvider>
      </body>
    </html>
  );
}
