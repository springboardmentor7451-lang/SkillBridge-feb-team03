import { useEffect, useState, useRef } from "react";

export default function CounterCard({
  label,
  endValue,
  duration = 2000,
  bgClass = "from-slate-50 to-slate-100",
  accentClass = "from-slate-200 to-slate-300",
}) {
  const [count, setCount] = useState(0);
  const containerRef = useRef(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStartedRef.current) {
          hasStartedRef.current = true;
          const startValue = 0;
          const startTime = Date.now();

          const updateCounter = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentValue = Math.floor(startValue + (endValue - startValue) * progress);

            setCount(currentValue);

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            }
          };

          requestAnimationFrame(updateCounter);
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [endValue, duration]);

  return (
    <div
      ref={containerRef}
      data-reveal
      className={`translate-y-8 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br ${bgClass} opacity-0 transition-all duration-700`}
    >
      <div className={`h-1.5 w-full bg-gradient-to-r ${accentClass}`} />
      <div className="p-4">
        <p className="text-2xl font-bold text-slate-900">
          {count.toLocaleString()}
          <span className="text-xl text-orange-600">+</span>
        </p>
        <p className="text-sm text-slate-600">{label}</p>
      </div>
    </div>
  );
}
