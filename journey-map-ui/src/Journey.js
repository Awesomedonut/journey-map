import React from "react";
import { motion, useAnimation } from "framer-motion";

const zoneCoords = {
  "Southern Woods": { x: 110, y: 400 },
  "ALIVE LAB": { x: 100, y: 200 },
  "Sugar Factory": { x: 330, y: 240 },
  "Red River Town": { x: 400, y: 300 },
  "Checker Board Farm": { x: 460, y: 420 },
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
  "#3b82f6",
  "#f59e42",
  "#10b981",
  "#ef4444",
  "#a855f7",
  "#eab308",
  "#6366f1",
  "#f43f5e",
];

function getSegmentKey(a, b, directionSensitive = false) {
  if (directionSensitive) {
    return `${a.x},${a.y}-${b.x},${b.y}`;
  }
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

function JourneySegment({ from, to, color, shouldAnimate, onComplete, visible, mode, replayKey, idx }) {
  const controls = useAnimation();
  React.useEffect(() => {
    if (shouldAnimate && mode === 'full') {
      controls.set({ pathLength: 0 });
      controls.start({
        pathLength: 1,
        transition: { duration: 0.5, ease: "easeInOut" },
      }).then(() => {
        if (onComplete) onComplete();
      });
    } else if (mode !== 'full') {
      controls.set({ pathLength: 1 });
    }
    // eslint-disable-next-line
  }, [shouldAnimate, mode, replayKey]);

  return (
    <motion.line
      key={idx + '-' + replayKey + '-' + mode}
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke={color}
      strokeWidth="5"
      initial={mode === 'full' ? { pathLength: 0 } : false}
      animate={mode === 'full' ? controls : undefined}
      style={{ pathLength: mode === 'full' ? undefined : 1, opacity: visible ? 1 : 0 }}
    />
  );
}

const Journey = () => {
  const [replayKey, setReplayKey] = React.useState(0);
  const [step, setStep] = React.useState(0);
  const [mode, setMode] = React.useState('full');
  const [animatedSegments, setAnimatedSegments] = React.useState(points.length - 1);
  const [currentAnimating, setCurrentAnimating] = React.useState(0);

  const segmentColors = mode === 'full'
    ? getSegmentColors(points, points.length)
    : getSegmentColors(points, step);

  React.useEffect(() => {
    if (mode === 'full') {
      setAnimatedSegments(0);
      setCurrentAnimating(0);
    }
  }, [replayKey, mode]);

  React.useEffect(() => {
    if (mode === 'full' && currentAnimating < segmentColors.length) {
      setAnimatedSegments(currentAnimating + 1);
    }
  }, [currentAnimating, mode, segmentColors.length]);

  const handleReplay = () => {
    setReplayKey((k) => k + 1);
    setMode('full');
    setAnimatedSegments(0);
    setCurrentAnimating(0);
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
            <JourneySegment
              key={idx + '-' + replayKey + '-' + mode}
              from={from}
              to={to}
              color={color}
              shouldAnimate={mode === 'full' && idx === currentAnimating}
              onComplete={() => setCurrentAnimating((c) => c + 1)}
              visible={mode === 'full' ? idx < animatedSegments : true}
              mode={mode}
              replayKey={replayKey}
              idx={idx}
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