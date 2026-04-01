import { motion } from "framer-motion";

const clouds = [
  { id: 1, width: 180, top: "6%", left: "5%", duration: 30, delay: 0 },
  { id: 2, width: 210, top: "18%", left: "72%", duration: 34, delay: 1.2 },
  { id: 3, width: 145, top: "50%", left: "10%", duration: 28, delay: 0.6 },
  { id: 4, width: 205, top: "66%", left: "70%", duration: 32, delay: 2.1 },
  { id: 5, width: 130, top: "84%", left: "22%", duration: 26, delay: 1.4 },
];

function Cloud({ width }) {
  return (
    <div className="relative drop-shadow-[0_0_10px_rgba(251,146,60,0.08)]" style={{ width, height: width * 0.45 }}>
      <div className="absolute inset-0 rounded-full border-[7px] border-orange-100/70" />
      <div className="absolute right-[8%] top-[-12%] h-[72%] w-[44%] rounded-full border-[7px] border-orange-100/70" />
    </div>
  );
}

export default function MovingCloudBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">

      {clouds.map((cloud) => (
        <motion.div
          key={cloud.id}
          className="absolute"
          style={{ top: cloud.top, left: cloud.left }}
          initial={{ opacity: 0.52, x: 0, y: 0 }}
          animate={{
            x: [0, 16, -14, 0],
            y: [0, -6, 8, 0],
            opacity: [0.42, 0.54, 0.46, 0.42],
          }}
          transition={{
            duration: cloud.duration,
            delay: cloud.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Cloud width={cloud.width} />
        </motion.div>
      ))}
    </div>
  );
}