import React from "react";
import { motion, useAnimation } from "framer-motion";

const points = [
  { x: 100, y: 500, label: "A" },
  { x: 300, y: 100, label: "B" },
  { x: 500, y: 400, label: "C" },
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
      width: 600,
      height: 600,
      backgroundImage: 'url("/Map_Asset.jpeg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      border: '1px solid #ccc',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <svg width="600" height="600" style={{ position: 'absolute', top: 0, left: 0 }}>
        <motion.path
          key={replayKey}
          d={pathData}
          stroke="#3b82f6"
          strokeWidth="5"
          fill="none"
          animate={controls}
          initial={{ pathLength: 0 }}
        />
        {points.map((point, idx) => (
          <g key={idx}>
            <circle cx={point.x} cy={point.y} r="14" fill="#2563eb" />
            <text x={point.x + 18} y={point.y - 18} fontSize="24" fill="#333">
              {point.label}
            </text>
          </g>
        ))}
      </svg>
      <button
        onClick={handleReplay}
        style={{ position: 'absolute', bottom: 20, left: 20, padding: "10px 20px", zIndex: 2, fontSize: 16 }}
      >
        Replay Journey
      </button>
    </div>
  );
};

export default Journey; 