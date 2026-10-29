"use client";

import { useState } from "react";

export interface MetricPoint {
  timeLabel: string;
  value: number;
}

interface MetricChartProps {
  title: string;
  unit?: string;
  colorHex?: string;
  strokeClass?: string;
  gradientId: string;
  points: MetricPoint[];
  currentValue: number | null;
  loading?: boolean;
  emptyMessage?: string;
}

export default function MetricChart({
  title,
  unit = "%",
  colorHex = "#22d3ee",
  gradientId,
  points,
  currentValue,
  loading = false,
  emptyMessage = "Calibrating baseline metrics...",
}: MetricChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const width = 500;
  const height = 160;
  const padLeft = 38;
  const padRight = 12;
  const padTop = 14;
  const padBottom = 24;

  const chartWidth = width - padLeft - padRight;
  const chartHeight = height - padTop - padBottom;

  const validPoints = points.filter(
    (p) => p.value !== null && Number.isFinite(p.value)
  );

  const hasData = validPoints.length > 0;

  // Calculate coordinates
  const coords = validPoints.map((p, i) => {
    const x =
      validPoints.length === 1
        ? padLeft + chartWidth
        : padLeft + (i / (validPoints.length - 1)) * chartWidth;
    const clampedVal = Math.max(0, Math.min(100, p.value));
    const y = padTop + chartHeight - (clampedVal / 100) * chartHeight;
    return { x, y, point: p };
  });

  const linePath = coords.length > 0
    ? `M ${coords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" L ")}`
    : "";

  const areaPath = coords.length > 0
    ? `${linePath} L ${coords[coords.length - 1].x.toFixed(1)},${(padTop + chartHeight).toFixed(1)} L ${coords[0].x.toFixed(1)},${(padTop + chartHeight).toFixed(1)} Z`
    : "";

  const hoveredPoint =
    hoverIndex !== null && coords[hoverIndex]
      ? coords[hoverIndex]
      : coords.length > 0
      ? coords[coords.length - 1]
      : null;

  // Time labels for X axis: first and last
  const firstTime = validPoints.length > 0 ? validPoints[0].timeLabel : "";
  const lastTime =
    validPoints.length > 1
      ? validPoints[validPoints.length - 1].timeLabel
      : "";

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-xs font-mono tracking-wide text-muted uppercase">
            {title}
          </h3>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-bold font-mono text-white">
              {currentValue !== null ? `${currentValue.toFixed(1)}${unit}` : "—"}
            </span>
            {hoverIndex !== null && hoveredPoint && (
              <span className="text-[11px] font-mono text-muted">
                at {hoveredPoint.point.timeLabel} ({hoveredPoint.point.value.toFixed(1)}{unit})
              </span>
            )}
          </div>
        </div>

        {/* Pulse indicator */}
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: colorHex }}
            />
            <span
              className="relative inline-flex rounded-full h-2 w-2"
              style={{ backgroundColor: colorHex }}
            />
          </span>
          <span className="text-[10px] font-mono text-muted">LIVE</span>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative w-full aspect-[500/160] overflow-hidden">
        {!hasData || loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <p className="text-xs font-mono text-muted animate-pulse">
              {emptyMessage}
            </p>
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full select-none"
            onMouseLeave={() => setHoverIndex(null)}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colorHex} stopOpacity={0.35} />
                <stop offset="100%" stopColor={colorHex} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            {/* Grid lines and Y-axis labels */}
            {[100, 75, 50, 25, 0].map((percent) => {
              const y = padTop + chartHeight - (percent / 100) * chartHeight;
              return (
                <g key={percent}>
                  <line
                    x1={padLeft}
                    y1={y}
                    x2={width - padRight}
                    y2={y}
                    stroke="currentColor"
                    className="text-border/60"
                    strokeDasharray={percent === 0 ? "0" : "3 3"}
                    strokeWidth="1"
                  />
                  <text
                    x={padLeft - 6}
                    y={y + 3}
                    textAnchor="end"
                    className="fill-muted text-[9px] font-mono"
                  >
                    {percent}%
                  </text>
                </g>
              );
            })}

            {/* Filled Area */}
            {areaPath && (
              <path d={areaPath} fill={`url(#${gradientId})`} />
            )}

            {/* Line Path */}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke={colorHex}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* X-axis time labels */}
            {firstTime && (
              <text
                x={padLeft}
                y={height - 6}
                textAnchor="start"
                className="fill-muted text-[9px] font-mono"
              >
                {firstTime}
              </text>
            )}
            {lastTime && (
              <text
                x={width - padRight}
                y={height - 6}
                textAnchor="end"
                className="fill-muted text-[9px] font-mono"
              >
                {lastTime}
              </text>
            )}

            {/* Hover Guides & Interactive Points */}
            {coords.map((c, i) => (
              <rect
                key={i}
                x={c.x - (chartWidth / Math.max(1, coords.length)) / 2}
                y={padTop}
                width={chartWidth / Math.max(1, coords.length)}
                height={chartHeight}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoverIndex(i)}
              />
            ))}

            {/* Current or hovered point dot */}
            {hoveredPoint && (
              <g>
                <line
                  x1={hoveredPoint.x}
                  y1={padTop}
                  x2={hoveredPoint.x}
                  y2={padTop + chartHeight}
                  stroke={colorHex}
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  opacity="0.6"
                />
                <circle
                  cx={hoveredPoint.x}
                  cy={hoveredPoint.y}
                  r="4.5"
                  fill="#080b12"
                  stroke={colorHex}
                  strokeWidth="2"
                />
              </g>
            )}
          </svg>
        )}
      </div>
    </div>
  );
}

