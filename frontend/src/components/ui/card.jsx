import { cn } from "../../lib/utils";

export function Card({ className, ...props }) {
  return <div className={cn("rounded-2xl border border-slate-200 bg-white/95 shadow-xl shadow-slate-200/50", className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn("p-6 sm:p-8", className)} {...props} />;
}
