import type { HistoryPoint } from "../types";

interface Props { points: HistoryPoint[] }

export default function HistoryChart({ points }: Props) {
  const width = 640;
  const height = 156;
  const padX = 34;
  const padY = 18;
  const maxTime = Math.max(points.at(-1)?.time ?? 1, 1);
  const stressMax = Math.max(...points.map((point) => point.stress), 1);
  const line = (selector: (point: HistoryPoint) => number, max: number) => points.map((point, index) => {
    const x = padX + (point.time / maxTime) * (width - padX * 2);
    const y = height - padY - (selector(point) / max) * (height - padY * 2);
    return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  return (
    <div className="chart-shell">
      <div className="chart-title">
        <span>공정 응답</span>
        <span className="chart-legend"><i className="stress-dot" />응력 <i className="risk-dot" />파손 위험</span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="시간에 따른 응력과 파손 위험 변화">
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
          <line key={ratio} x1={padX} x2={width - padX} y1={padY + ratio * (height - 2 * padY)} y2={padY + ratio * (height - 2 * padY)} className="grid-line" />
        ))}
        <path d={line((point) => point.stress, stressMax)} className="stress-line" />
        <path d={line((point) => point.risk, 100)} className="risk-line" />
        <text x={padX} y={height - 3} className="axis-label">0 s</text>
        <text x={width - padX} y={height - 3} textAnchor="end" className="axis-label">{maxTime.toFixed(2)} s</text>
      </svg>
    </div>
  );
}
