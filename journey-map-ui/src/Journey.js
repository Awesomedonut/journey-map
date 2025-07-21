import React from "react";
import { motion, useAnimation } from "framer-motion";

const points = [
  { x: 50, y: 100, label: "A" },
  { x: 200, y: 50, label: "B" },
  { x: 350, y: 120, label: "C" },
];

const pathData =
  `M ${points[0].x},${points[0].y} ` +
  points
    .slice(1)
    .map((p) => `L ${p.x},${p.y}`)
    .join(" ");

const Journey = () => {
  const controls = useAnimation();
  const [replayKey, setReplayKey] = React.useState(0);

  const handleReplay = () => {
    setReplayKey((k) => k + 1);
  };

  React.useEffect(() => {
    controls.set({ pathLength: 0 });
    controls.start({
      pathLength: 1,
      transition: { duration: 2, ease: "easeInOut" },
    });
  }, [replayKey, controls]);

  return (
    <div style={{
      position: 'relative',
      width: 400,
      height: 200,
      backgroundImage: 'url("/Map_Asset.jpeg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      border: '1px solid #ccc',
      margin: '0 auto'
    }}>
      <svg width="400" height="200" style={{ position: 'absolute', top: 0, left: 0 }}>
        <motion.path
          key={replayKey}
          d={pathData}
          stroke="#3b82f6"
          strokeWidth="3"
          fill="none"
          animate={controls}
          initial={{ pathLength: 0 }}
        />
        {points.map((point, idx) => (
          <g key={idx}>
            <circle cx={point.x} cy={point.y} r="6" fill="#2563eb" />
            <text x={point.x + 8} y={point.y - 8} fontSize="12" fill="#333">
              {point.label}
            </text>
          </g>
        ))}
      </svg>
      <button
        onClick={handleReplay}
        style={{ position: 'absolute', bottom: 10, left: 10, padding: "6px 12px", zIndex: 2 }}
      >
        Replay Journey
      </button>
    </div>
  );
};

export default Journey; 