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

function getStatusMessage(epoch: number, running: boolean): string {
  if (!running && epoch === 0) {
    return "Press Start to begin. 131,072 random programs will interact and may spontaneously give rise to self-replicating life.";
  }
  if (epoch < 100) {
    return "Warming up. The soup is random noise right now. Replicators typically emerge between epochs 1,000 and 5,000.";
  }
  if (epoch < 1000) {
    return "Pre-life phase. Interactions are reshuffling bytes. Watch for the moment the soup suddenly shifts. This can take 8 to 40 minutes (~40% chance within 16,000 epochs).";
  }
  if (epoch < 5000) {
    return "Prime emergence window. If a self-replicator appears, you will see a dramatic wave of uniform color sweeping across the soup.";
  }
  if (epoch < 16000) {
    return "Still searching. About 40% of runs produce replicators within 16,000 epochs. Keep watching, or restart for a fresh random seed.";
  }
  return "Deep run. Most runs that produce replicators do so before this point, but emergence is always possible. Try restarting for a new seed.";
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
  const status = getStatusMessage(epoch, running);

  return (
    <div className="controls-wrapper">
      <div className="status-bar">
        <span className="status-text">{status}</span>
        <button onClick={onOpenInfo} className="read-more-btn">
          Read more
        </button>
      </div>
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
      </div>
    </div>
  );
}
