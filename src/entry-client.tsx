// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";
import { setGlobalFigureStyle, setKeyColors } from "@timroberton/panther";
import { _KEY_COLORS, _PALETTE_1, _PALETTE_2 } from "~/key_colors";

setKeyColors(_KEY_COLORS);

setGlobalFigureStyle({
  scale: 0.8,
  gridStrokeWidth: 1,
  axisStrokeWidth: 2,
  dataLabelFormatter: (v) => Math.round(v * 100).toFixed(),
  paletteColors: {
    auto: {
      first: _PALETTE_1,
      last: _PALETTE_2,
    },
  },
  yScaleAxis: {
    max: 1,
  },
  yTextAxis: {
    tickLabelGap: 18,
    tickWidth: 0,
    colGroupBracketPaddingY: 0,
    maxTickLabelWidthAsPctOfChart: 0.65,
  },
  xTextAxis: {
    tickHeight: 0,
    maxVerticalTickLabelHeightAsPctOfChart: 0.6,
  },
});

mount(() => <StartClient />, document.getElementById("app")!);
