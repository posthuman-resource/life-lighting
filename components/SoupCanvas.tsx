"use client";

import { useRef, useEffect, type MutableRefObject } from "react";
import { createRenderer } from "@/lib/soup/renderer";
import type { WorkerMessage } from "@/lib/soup/worker-protocol";

interface SoupCanvasProps {
  workerRef: MutableRefObject<Worker | null>;
  onEpoch?: (epoch: number) => void;
  onRunningChange?: (running: boolean) => void;
}

export default function SoupCanvas({
  workerRef,
  onEpoch,
  onRunningChange,
}: SoupCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = createRenderer(canvas);
    let latestBuffer: Uint8Array | null = null;
    let raf = 0;

    function renderLoop() {
      if (latestBuffer) {
        renderer.uploadSoup(latestBuffer);
        renderer.draw();
        latestBuffer = null;
      }
      raf = requestAnimationFrame(renderLoop);
    }
    raf = requestAnimationFrame(renderLoop);

    const worker = new Worker(
      new URL("../lib/soup/worker.ts", import.meta.url)
    );
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent<WorkerMessage>) => {
      const msg = e.data;
      if (msg.type === "render") {
        latestBuffer = new Uint8Array(msg.buffer);
        onEpoch?.(msg.epoch);
      } else if (msg.type === "status") {
        onRunningChange?.(msg.running);
      }
    };

    worker.postMessage({ type: "init" });

    return () => {
      cancelAnimationFrame(raf);
      worker.terminate();
      workerRef.current = null;
      renderer.destroy();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <canvas ref={canvasRef} className="soup-canvas" />;
}
