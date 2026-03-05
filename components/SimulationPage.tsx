"use client";

import { useState, useRef, useCallback } from "react";
import SoupCanvas from "./SoupCanvas";
import Controls from "./Controls";
import InfoModal from "./InfoModal";
import { DEFAULT_MUTATION_RATE } from "@/lib/soup/constants";

export default function SimulationPage() {
  const workerRef = useRef<Worker | null>(null);
  const [running, setRunning] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [mutationRate, setMutationRate] = useState(DEFAULT_MUTATION_RATE);
  const [infoOpen, setInfoOpen] = useState(false);

  const handleToggleRun = useCallback(() => {
    workerRef.current?.postMessage({ type: running ? "pause" : "start" });
  }, [running]);

  const handleStep = useCallback(() => {
    workerRef.current?.postMessage({ type: "step" });
  }, []);

  const handleMutationRateChange = useCallback((rate: number) => {
    setMutationRate(rate);
    workerRef.current?.postMessage({ type: "setMutationRate", rate });
  }, []);

  return (
    <>
      <SoupCanvas
        workerRef={workerRef}
        onEpoch={setEpoch}
        onRunningChange={setRunning}
      />
      <Controls
        running={running}
        epoch={epoch}
        mutationRate={mutationRate}
        onToggleRun={handleToggleRun}
        onStep={handleStep}
        onMutationRateChange={handleMutationRateChange}
        onOpenInfo={() => setInfoOpen(true)}
      />
      <InfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />
    </>
  );
}
