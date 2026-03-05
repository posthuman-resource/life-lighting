"use client";

const LEGEND = [
  { sym: "+", label: "inc", color: "#00ff88" },
  { sym: "-", label: "dec", color: "#ff4444" },
  { sym: "<", label: "h0\u2190", color: "#00ddff" },
  { sym: ">", label: "h0\u2192", color: "#ff8800" },
  { sym: "{", label: "h1\u2190", color: "#00ffcc" },
  { sym: "}", label: "h1\u2192", color: "#ff6655" },
  { sym: ".", label: "copy\u2192", color: "#ffdd00" },
  { sym: ",", label: "copy\u2190", color: "#ff00ff" },
  { sym: "[", label: "loop", color: "#4488ff" },
  { sym: "]", label: "end", color: "#8844ff" },
];

interface ControlsProps {
  running: boolean;
  epoch: number;
  mutationRate: number;
  onToggleRun: () => void;
  onStep: () => void;
  onMutationRateChange: (rate: number) => void;
  onOpenInfo: () => void;
}

export default function Controls({
  running,
  epoch,
  mutationRate,
  onToggleRun,
  onStep,
  onMutationRateChange,
  onOpenInfo,
}: ControlsProps) {
  return (
    <div className="controls-bar">
      <div className="controls-group">
        <button onClick={onToggleRun} className="control-btn">
          {running ? "Pause" : "Start"}
        </button>
        <button onClick={onStep} disabled={running} className="control-btn">
          Step
        </button>
      </div>

      <div className="controls-group">
        <label className="control-label">
          Mutation:
          <input
            type="range"
            min="0"
            max="0.004"
            step="0.0001"
            value={mutationRate}
            onChange={(e) => onMutationRateChange(parseFloat(e.target.value))}
            className="mutation-slider"
          />
          <span className="control-value">
            {(mutationRate * 100).toFixed(3)}%
          </span>
        </label>
      </div>

      <div className="controls-group">
        <span>
          Epoch: <strong>{epoch}</strong>
        </span>
      </div>

      <div className="controls-group legend">
        {LEGEND.map((item) => (
          <span key={item.sym} className="legend-item">
            <span
              className="legend-swatch"
              style={{ backgroundColor: item.color }}
            />
            <span className="legend-sym" style={{ color: item.color }}>
              {item.sym}
            </span>
            <span className="legend-label">{item.label}</span>
          </span>
        ))}
      </div>

      <button onClick={onOpenInfo} className="control-btn info-btn">
        About
      </button>
    </div>
  );
}
