import { createEffect, onMount } from "solid-js";
import {
  RectCoordsDims,
  TimChartInputs,
  renderChart,
} from "@timroberton/panther";

type Props = {
  chartInputs: TimChartInputs;
};

export function ChartHolderFlex(p: Props) {
  let div: HTMLDivElement;
  let canvas: HTMLCanvasElement;

  const fixedCanvasW = 2000;

  createEffect(() => {
    const domW = div.getBoundingClientRect().width;
    const domH = div.getBoundingClientRect().height;
    updateChart(canvas, p.chartInputs, fixedCanvasW, domW, domH);
  });

  onMount(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentBoxSize && p.chartInputs) {
          const w = entry.contentBoxSize[0].inlineSize;
          const h = entry.contentBoxSize[0].blockSize;
          updateChart(canvas, p.chartInputs, fixedCanvasW, w, h);
        }
      }
    });
    observer.observe(div);
  });

  return (
    <div ref={div!} class="h-full w-full overflow-hidden">
      <canvas ref={canvas!} class="h-full" width={fixedCanvasW} height={0} />
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
