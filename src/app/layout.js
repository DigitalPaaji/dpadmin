"use client";
import "./globals.css"
import Sidebar from "./components/Sidebar";
import { ToastContainer } from "react-toastify";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
 
 const path = usePathname()
 console.log(path)

  return (
    <html lang="en">
      <body>
       
        <div className="relative flex h-screen bg-[#faf8f8] transition-all duration-300 text-[#333] font-sans">
          <ToastContainer className="z-[999999]" />
{path.includes("auth")? " " :
          <Sidebar />}
          <main className="flex-1 p-8 overflow-y-auto shadow-2xl">
          {children}
          </main>
        </div>
       
      </body>
    </html>
  );
}