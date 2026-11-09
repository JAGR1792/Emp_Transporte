/**
 * SimpleGraph — React Bits Pro API-compatible implementation
 *
 * Props match the @reactbits-starter/simple-graph-tw component.
 * If you have installed the component via the shadcn CLI, you can
 * replace this file with the generated one — the props interface is identical.
 */
import { useRef, useState, useId, useMemo } from 'react';
import { motion } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────── types ── */

export interface DataPoint {
  label: string;
  value: number;
}

export interface SimpleGraphProps {
  /** Array of data points to plot */
  data: DataPoint[];
  /** Stroke color of the line — accepts any CSS color */
  color?: string;
  /** Start color of the fill gradient (top) */
  gradientFrom?: string;
  /** End color of the fill gradient (bottom, usually transparent) */
  gradientTo?: string;
  /** Height of the SVG canvas in pixels */
  height?: number;
  /** Animate the line drawing on mount */
  animated?: boolean;
  /** Show circle dots at each data point */
  showDots?: boolean;
  /** Show a floating tooltip on hover */
  showTooltip?: boolean;
  /** Format the tooltip value (e.g. add $ or %) */
  formatValue?: (v: number) => string;
  /** Additional class names */
  className?: string;
}

/* ───────────────────────────────────────────────────── helper utils ── */

function buildPath(points: { x: number; y: number }[], smooth = true): string {
  if (points.length < 2) return '';

  if (!smooth) {
    return points
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
      .join(' ');
  }

  // Catmull-Rom → cubic bezier
  let d = `M${points[0].x.toFixed(2)},${points[0].y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
  }
  return d;
}

/* ─────────────────────────────────────────────────── main component ── */

export default function SimpleGraph({
  data,
  color = '#f97316',
  gradientFrom = '#f97316',
  gradientTo = 'transparent',
  height = 200,
  animated = true,
  showDots = true,
  showTooltip = true,
  formatValue = (v) => String(v),
  className = '',
}: SimpleGraphProps) {
  const uid = useId().replace(/:/g, '');
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    label: string;
    value: number;
    idx: number;
  } | null>(null);

  const PAD = { top: 20, right: 24, bottom: 32, left: 8 };

  // Derive SVG points from data
  const points = useMemo(() => {
    if (!data.length) return [];
    const values = data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    // We use % widths resolved at render time; store normalized [0..1] here
    return data.map((d, i) => ({
      nx: i / Math.max(data.length - 1, 1),
      ny: 1 - (d.value - min) / range,
      label: d.label,
      value: d.value,
    }));
  }, [data]);

  // Build paths in a 1000×height coordinate space (viewBox), scale with preserveAspectRatio
  const W = 1000;
  const innerW = W - PAD.left - PAD.right;
  const innerH = height - PAD.top - PAD.bottom;

  const svgPoints = points.map((p) => ({
    x: PAD.left + p.nx * innerW,
    y: PAD.top + p.ny * innerH,
    label: p.label,
    value: p.value,
  }));

  const linePath = buildPath(svgPoints);
  const areaPath =
    linePath +
    ` L${(svgPoints[svgPoints.length - 1]?.x ?? 0).toFixed(2)},${(PAD.top + innerH).toFixed(2)}` +
    ` L${PAD.left.toFixed(2)},${(PAD.top + innerH).toFixed(2)} Z`;

  // Total path length estimation for stroke-dasharray animation
  // We use a high enough number; SVG will clamp it to actual length
  const STROKE_LEN = 3000;

  /* ── handlers ── */
  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!showTooltip || !svgRef.current || !svgPoints.length) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const ratio = mouseX / rect.width;
    // Find closest point
    let best = 0;
    let bestDist = Infinity;
    svgPoints.forEach((p, i) => {
      const d = Math.abs(p.x / W - ratio);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    const pt = svgPoints[best];
    setTooltip({
      x: (pt.x / W) * rect.width,
      y: (pt.y / height) * rect.height,
      label: pt.label,
      value: pt.value,
      idx: best,
    });
  }

  return (
    <div
      className={`relative w-full select-none ${className}`}
      style={{ height }}
      onMouseLeave={() => setTooltip(null)}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${height}`}
        preserveAspectRatio="none"
        className="w-full h-full overflow-visible"
        onMouseMove={handleMouseMove}
      >
        <defs>
          <linearGradient id={`sg-grad-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={gradientFrom} stopOpacity="0.25" />
            <stop offset="100%" stopColor={gradientTo} stopOpacity="0" />
          </linearGradient>
          {animated && (
            <mask id={`sg-mask-${uid}`}>
              <motion.rect
                x={0}
                y={0}
                height={height}
                fill="white"
                initial={{ width: 0 }}
                animate={{ width: W }}
                transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
              />
            </mask>
          )}
        </defs>

        {/* Filled area */}
        {animated ? (
          <path
            d={areaPath}
            fill={`url(#sg-grad-${uid})`}
            mask={`url(#sg-mask-${uid})`}
          />
        ) : (
          <path d={areaPath} fill={`url(#sg-grad-${uid})`} />
        )}

        {/* Line stroke */}
        {animated ? (
          <motion.path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ strokeDasharray: STROKE_LEN, strokeDashoffset: STROKE_LEN }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          />
        ) : (
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Dots */}
        {showDots &&
          svgPoints.map((p, i) => (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={tooltip?.idx === i ? 6 : 4}
              fill={color}
              stroke="white"
              strokeWidth={2}
              initial={animated ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: animated ? 1.0 + i * 0.05 : 0, duration: 0.2 }}
            />
          ))}

        {/* X-axis labels */}
        {svgPoints.map((p, i) => (
          <text
            key={`lbl-${i}`}
            x={p.x}
            y={PAD.top + innerH + 20}
            textAnchor="middle"
            fontSize={11}
            fill="#94a3b8"
            fontFamily="system-ui, sans-serif"
          >
            {p.label}
          </text>
        ))}

        {/* Vertical crosshair on hover */}
        {tooltip && (
          <line
            x1={svgPoints[tooltip.idx]?.x}
            y1={PAD.top}
            x2={svgPoints[tooltip.idx]?.x}
            y2={PAD.top + innerH}
            stroke={color}
            strokeWidth={1}
            strokeDasharray="4 3"
            opacity={0.4}
          />
        )}
      </svg>

      {/* Floating tooltip */}
      {showTooltip && tooltip && (
        <div
          className="absolute pointer-events-none z-10"
          style={{
            left: tooltip.x,
            top: Math.max(tooltip.y - 44, 2),
            transform: 'translateX(-50%)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.12 }}
            className="bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap"
          >
            <span className="text-slate-400 mr-1">{tooltip.label}</span>
            <span className="font-semibold">{formatValue(tooltip.value)}</span>
          </motion.div>
        </div>
      )}
    </div>
  );
}
