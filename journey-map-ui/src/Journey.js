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
  "Checker Board Farm",
  "Red River Town",
  "Sugar Factory",
  "Southern Woods",
  "Southern Woods",
  "ALIVE LAB",
  "Southern Woods",
  "Southern Woods",
  "Southern Woods",
  "Red River Town",
  "Southern Woods",
  "Red River Town",
  "Red River Town",
  "Sugar Factory",
  "Sugar Factory",
  "Red River Town",
  "Checker Board Farm",
  "Checker Board Farm",
  "Southern Woods",
  "Checker Board Farm",
  "Red River Town",
  "ALIVE LAB",
];

const points = journeyOrder.map((zone) => zoneCoords[zone]);

function getPartialPathData(points, step) {
  if (step === 0) return '';
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < step && i < points.length; i++) {
    d += ` L ${points[i].x},${points[i].y}`;
  }
  return d;
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
    } else if (mode === 'step') {
      // no animation for step mode
    }
  }, [replayKey, controls, mode]);

  const pathToDraw = mode === 'full'
    ? `M ${points[0].x},${points[0].y} ` + points.slice(1).map((p) => `L ${p.x},${p.y}`).join(' ')
    : getPartialPathData(points, step);

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
          <motion.path
            key={mode === 'full' ? replayKey : `step-${step}`}
            d={pathToDraw}
            stroke="#3b82f6"
            strokeWidth="5"
            fill="none"
            animate={mode === 'full' ? controls : undefined}
            initial={mode === 'full' ? { pathLength: 0 } : false}
          />
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