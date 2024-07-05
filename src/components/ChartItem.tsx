import { Show, createEffect, onMount } from "solid-js";
import {
  RectCoordsDims,
  TimChartInputs,
  renderChart,
} from "@timroberton/panther";
import { SelectOption } from "~/ui";
import { ChartSelectOptions } from "./ChartSelectOptions";

type Props = {
  caption: string;
  subCaption?: string;
  chartInputs: TimChartInputs | undefined;
  selectQuarter?: boolean;
  selectIndicator?: boolean;
  selectIndFacOnly?: boolean;
  selectFacilityType?: boolean;
  chartHeight: "sm" | "md" | "lg" | "xl";
  facilityTypeOptions: SelectOption<string>[];
  sortBy?: string;
  showFootnote?: boolean;
};

export function ChartItem(p: Props) {
  let div: HTMLDivElement;
  let canvas: HTMLCanvasElement;
  let pastW = 0;
  const h =
    p.chartHeight === "xl"
      ? 2000
      : p.chartHeight === "lg"
        ? 1800
        : p.chartHeight === "md"
          ? 1500
          : 1200;

  createEffect(() => {
    if (p.chartInputs) {
      const w = div.getBoundingClientRect().width;
      updateChart(canvas, p.chartInputs, w, h, 4000 / w);
    }
  });

  onMount(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentBoxSize && p.chartInputs) {
          const w = entry.contentBoxSize[0].inlineSize;
          if (Math.floor(w) === Math.floor(pastW)) {
            return;
          }
          pastW = w;
          updateChart(canvas, p.chartInputs, w, h, 4000 / w);
        }
      }
    });
    observer.observe(div);
  });

  return (
    <div ref={div!} class="w-full">
      <div class="font-700 text-xl pb-4 leading-7">
        {p.caption}
        <Show when={p.subCaption}>
          <div class="mt-1 font-700 text-base">{p.subCaption}</div>
        </Show>
      </div>

      <div class="flex flex-wrap gap-x-6 gap-y-3 pb-4 items-end">
        <ChartSelectOptions
          selectQuarter={p.selectQuarter}
          selectIndicator={p.selectIndicator}
          selectIndFacOnly={p.selectIndFacOnly}
          selectFacilityType={p.selectFacilityType}
          facilityTypeOptions={p.facilityTypeOptions}
          sortBy={p.sortBy}
        />
      </div>
      <Show
        when={p.chartInputs}
        fallback={
          <div class="text-success text-sm">No data for this facility type</div>
        }
      >
        <canvas ref={canvas!} class="w-full" width={4000} height={h} />
      </Show>
      <Show when={p.showFootnote}>
        <div class="mt-1 italic text-sm">
          All service coverage indicators are ‘average proportions across HWCs’
        </div>
      </Show>
    </div>
  );
}

function updateChart(
  canvas: HTMLCanvasElement,
  chartInputs: TimChartInputs,
  w: number,
  h: number,
  responsiveScale: number
) {
  requestAnimationFrame(() => {
    if (w > 0) {
      canvas.height = (1000 * h) / w;
    }
    const ctx1 = canvas.getContext("2d")!;
    renderChart(
      ctx1,
      chartInputs,
      new RectCoordsDims([0, 0, canvas.width, canvas.height]),
      responsiveScale
    );
  });
}
