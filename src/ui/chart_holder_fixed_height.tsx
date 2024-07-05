import { createEffect, onMount } from "solid-js";
import {
  RectCoordsDims,
  TimChartInputs,
  renderChart,
} from "@timroberton/panther";

type Props = {
  chartInputs: TimChartInputs;
  domH: number;
};

export function ChartHolderFixedHeight(p: Props) {
  let div: HTMLDivElement;
  let canvas: HTMLCanvasElement;

  const fixedCanvasW = 4000;

  createEffect(() => {
    const domW = div.getBoundingClientRect().width;
    updateChart(canvas, p.chartInputs, fixedCanvasW, domW, p.domH);
  });

  onMount(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentBoxSize && p.chartInputs) {
          const w = entry.contentBoxSize[0].inlineSize;
          updateChart(canvas, p.chartInputs, fixedCanvasW, w, p.domH);
        }
      }
    });
    observer.observe(div);
  });

  return (
    <div ref={div!} class="w-full">
      <canvas ref={canvas!} class="w-full" width={fixedCanvasW} height={0} />
    </div>
  );
}

function updateChart(
  canvas: HTMLCanvasElement,
  chartInputs: TimChartInputs,
  fixedCanvasW: number,
  domW: number,
  domH: number
) {
  requestAnimationFrame(() => {
    if (domW === 0) {
      return;
    }
    canvas.height = (fixedCanvasW * domH) / domW;
    const ctx = canvas.getContext("2d")!;
    const rcd = new RectCoordsDims([0, 0, canvas.width, canvas.height]);
    renderChart(ctx, chartInputs, rcd, fixedCanvasW / domW);
  });
}
