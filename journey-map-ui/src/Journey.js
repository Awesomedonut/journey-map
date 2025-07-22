import React from "react";
import { motion, useAnimation } from "framer-motion";

const zoneCoords = {
  "Southern Woods": { x: 110, y: 400 }, //   Southern Woods
  "ALIVE LAB": { x: 100, y: 200 }, // ALIVE LAB
  "Sugar Factory": { x: 330, y: 240 }, //   Sugar Factory
  "Red River Town": { x: 400, y: 300 }, //   Red River Town
  "Checker Board Farm": { x: 460, y: 420 }, //   Checker Board Farm
};

const journeyOrder = [
"ALIVE LAB",
"Red River Town",
"Checker Board Farm",
"Southern Woods",
"Checker Board Farm",
"Checker Board Farm",
"Red River Town",
"Sugar Factory",
"Sugar Factory",
"Red River Town",
"Red River Town",
"Southern Woods",
"Red River Town",
"Southern Woods",
"Southern Woods",
"Southern Woods",
"ALIVE LAB",
"Southern Woods",
"Southern Woods",
"Sugar Factory",
"Red River Town",
"Checker Board Farm",
"ALIVE LAB"
];

const points = journeyOrder.map((zone) => zoneCoords[zone]);

const colorPalette = [
  "#3b82f6", // blue
  "#f59e42", // orange
  "#10b981", // green
  "#ef4444", // red
  "#a855f7", // purple
  "#eab308", // yellow
  "#6366f1", // indigo
  "#f43f5e", // pink
];

function getSegmentKey(a, b, directionSensitive = false) {
  if (directionSensitive) {
    return `${a.x},${a.y}-${b.x},${b.y}`;
  }
  // direction-agnostic key
  return a.x < b.x || (a.x === b.x && a.y <= b.y)
    ? `${a.x},${a.y}-${b.x},${b.y}`
    : `${b.x},${b.y}-${a.x},${a.y}`;
}

function getSegmentColors(points, step) {
  const segmentCounts = {};
  const segmentColors = [];
  for (let i = 1; i < step && i < points.length; i++) {
    const from = points[i - 1];
    const to = points[i];
    // Special case: Southern Woods -> ALIVE LAB (directional)
    if (
      from === zoneCoords["Southern Woods"] &&
      to === zoneCoords["ALIVE LAB"]
    ) {
      segmentColors.push({ from, to, color: "#ef4444" });
      continue;
    }
    const key = getSegmentKey(from, to, false);
    if (!segmentCounts[key]) segmentCounts[key] = 0;
    segmentCounts[key]++;
    const color = colorPalette[(segmentCounts[key] - 1) % colorPalette.length];
    segmentColors.push({ from, to, color });
  }
  return segmentColors;
}

const Journey = () => {
  const controls = useAnimation();
  const [replayKey, setReplayKey] = React.useState(0);
  const [step, setStep] = React.useState(0);
  const [mode, setMode] = React.useState('full');

  const handleReplay = () => {
    setReplayKey((k) => k + 1);
    setMode('full');
  };

  const handleNext = () => {
    setMode('step');
    setStep((s) => {
      if (s >= points.length) {
        return 1;
      } else if (s === 0) {
        return 1;
      } else {
        return s + 1;
      }
    });
  };

  React.useEffect(() => {
    if (mode === 'full') {
      controls.set({ pathLength: 0 });
      controls.start({
        pathLength: 1,
        transition: { duration: 2, ease: "easeInOut" },
      });
    }
  }, [replayKey, controls, mode]);

  const segmentColors = mode === 'full'
    ? getSegmentColors(points, points.length)
    : getSegmentColors(points, step);

  return (
    <div>
      <div style={{ textAlign: 'center', fontSize: 28, fontWeight: 600, marginBottom: 16 }}>User ID 999006</div>
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
          {segmentColors.map(({ from, to, color }, idx) => (
            <motion.line
              key={idx}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={color}
              strokeWidth="5"
              initial={mode === 'full' ? { pathLength: 0 } : false}
              animate={mode === 'full' ? controls : undefined}
              style={{ pathLength: mode === 'full' ? undefined : 1 }}
            />
          ))}
          {Object.values(zoneCoords).map((point, idx) => (
            <g key={idx}>
              <circle cx={point.x} cy={point.y} r="14" fill="#2563eb" />
            </g>
          ))}
        </svg>
        <div style={{ position: 'absolute', bottom: 20, left: 20, zIndex: 2, display: 'flex', gap: 12 }}>
          <button
            onClick={handleReplay}
            style={{ padding: "10px 20px", fontSize: 16 }}
          >
            Replay Journey
          </button>
          <button
            onClick={handleNext}
            style={{ padding: "10px 20px", fontSize: 16 }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Journey; 