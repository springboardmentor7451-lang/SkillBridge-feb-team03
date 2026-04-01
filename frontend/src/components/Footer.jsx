import { useEffect, useState } from "react";

export default function Footer() {
  const getFormattedDateTime = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    return `${day}-${month}-${year} ${String(hours).padStart(2, "0")}:${minutes}:${seconds} ${ampm}`;
  };

  const [currentDateTime, setCurrentDateTime] = useState(getFormattedDateTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(getFormattedDateTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="relative mt-8 overflow-hidden border-t border-slate-200 bg-gradient-to-r from-white via-amber-50/70 to-rose-50/70">
      <div className="pointer-events-none absolute -left-10 bottom-0 h-24 w-24 rounded-full bg-orange-200/35 blur-2xl" />
      <div className="pointer-events-none absolute right-10 bottom-0 h-24 w-24 rounded-full bg-pink-200/35 blur-2xl" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-2 px-4 py-5 text-sm text-slate-600 md:grid-cols-3 md:items-center md:px-6">
        <p className="text-center md:text-left">SkillBridge - Connecting volunteers and NGOs.</p>
        <p className="text-center font-medium text-slate-700">{currentDateTime}</p>
        <p className="text-center md:text-right">Copyright © {new Date().getFullYear()} | Build by Aman Kumar</p>
      </div>
    </footer>
  );
}
