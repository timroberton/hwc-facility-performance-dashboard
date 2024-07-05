import { Show, createMemo } from "solid-js";
import {
  _ALL_FACILITY_TYPES,
  _COL_HEADER_ID_BLOCK,
  _COL_HEADER_ID_FACILITY_NAME,
  _COL_HEADER_ID_FACILITY_TYPE,
  _COL_HEADER_ID_QUARTER,
  _FULL_LABEL_MAP,
  _INDICATORS_COL_GROUPS,
  _INDICATORS_COL_GROUPS_MINUS_2,
  _INDICATORS_COL_GROUPS_MINUS_3,
  _INDICATORS_COL_GROUPS_MINUS_4,
  _INDICATORS_FACILITY_ONLY_LABLE_MAP,
  _INDICATOR_COLORS,
  _INDICATOR_IDS,
} from "~/consts/mod";
import { _INDICATOR_COLOR_MAP } from "~/key_colors";
import {
  selectedFacilityTypeId,
  selectedIndFacId,
  selectedQuarterId,
  sortBy,
} from "~/state/ui_selection";
import {
  Csv,
  TimChartInputs,
  avgStringsIntoString,
  toNum0,
  toPct1,
} from "@timroberton/panther";
import { BlockFull, DistrictBlockFacility, DistrictFull } from "~/types/mod";
import { ChartItem } from "./ChartItem";
import { OtherItem } from "./OtherItem";
import { getSelectOptionsFacilityType } from "~/util_funcs/get_select_options";

type Props = {
  csv: Csv<string>;
  dbf: DistrictBlockFacility;
  blockFull: BlockFull;
  districtFull: DistrictFull;
};

export function IndividualBlock(p: Props) {
  const csvOneBlockOneFacilityType = createMemo(() => {
    const blockId = p.blockFull.id;
    const facilityTypeId = selectedFacilityTypeId();
    const iBlock = p.csv.getColHeaderIndex(_COL_HEADER_ID_BLOCK);
    const iFacilityType = p.csv.getColHeaderIndex(_COL_HEADER_ID_FACILITY_TYPE);
    return p.csv.getSelectedRows((row) => {
      return (
        row[iBlock] === blockId &&
        (facilityTypeId === _ALL_FACILITY_TYPES ||
          row[iFacilityType] === facilityTypeId)
      );
    });
  });

  const facilityTypeOptions = createMemo(() => {
    return getSelectOptionsFacilityType(
      p.dbf,
      p.districtFull.id,
      p.blockFull.id
    );
  });

  const chart1 = createMemo<TimChartInputs | undefined>(() => {
    const quarterId = selectedQuarterId();
    const iQuarter = p.csv.getColHeaderIndex(_COL_HEADER_ID_QUARTER);
    if (csvOneBlockOneFacilityType().nRows() === 0) {
      return undefined;
    }
    const csv = csvOneBlockOneFacilityType()
      .getSelectedRows((row) => {
        return row[iQuarter] === quarterId;
      })
      .collapse(
        [],
        [
          {
            colNumbersOrHeaders: _INDICATOR_IDS,
            reducerFunc: avgStringsIntoString,
          },
        ]
      )
      .getNumbers()
      .getMappedCells((c) => (c > 1 ? 1 : c));

    return {
      chartType: "bar",
      chartData: {
        csv,
        colGroups:
          quarterId === "3"
            ? p.districtFull.id === "Kalahandi"
              ? _INDICATORS_COL_GROUPS_MINUS_3
              : _INDICATORS_COL_GROUPS_MINUS_2
            : _INDICATORS_COL_GROUPS_MINUS_4,
        labelReplacements: _FULL_LABEL_MAP,
      },
      chartStyle: {
        paletteColors: {
          logic: "specific-by-col",
          specific: _INDICATOR_COLORS,
        },
        horizontal: true,
        yTextAxis: {
          showGrid: false,
          colGroupGap: 20,
        },
      },
    };
  });

  const chart3 = createMemo<TimChartInputs | undefined>(() => {
    if (csvOneBlockOneFacilityType().nRows() === 0) {
      return undefined;
    }
    const csvRaw = csvOneBlockOneFacilityType()
      .collapse(
        [_COL_HEADER_ID_QUARTER],
        [
          {
            colNumbersOrHeaders: _INDICATOR_IDS,
            reducerFunc: avgStringsIntoString,
          },
        ]
      )
      .withColAsRowHeaders(_COL_HEADER_ID_QUARTER)
      .getNumbers()
      .getMappedCells((c) => (c > 1 ? 1 : c));

    const iColHeader1 = csvRaw
      .colHeadersOrThrowIfNone()
      .indexOf("prop_onschedule_ANC");

    const iColHeader2 = csvRaw
      .colHeadersOrThrowIfNone()
      .indexOf("prop_immun_childunder2");

    const csv = csvRaw.getMappedCells((c, i_row, i_cell) => {
      if (i_row < 2 && (i_cell === iColHeader1 || i_cell === iColHeader2)) {
        return 0.05;
      }
      return c;
    });

    return {
      chartType: "point",
      chartData: {
        csv,
        colGroups:
          p.districtFull.id === "Kalahandi"
            ? _INDICATORS_COL_GROUPS_MINUS_3
            : _INDICATORS_COL_GROUPS_MINUS_2,
        labelReplacements: _FULL_LABEL_MAP,
      },
      chartStyle: {
        horizontal: true,
        // withArrows: true,
        withDataLabels: false,
        palettePointStyles: {
          logic: "specific-by-row",
          specific: ["rect", "rectRot", "circle"],
        },
        paletteColors: {
          logic: "func",
          func: (i_row, i_col) => {
            if (i_row < 2 && (i_col === iColHeader1 || i_col === iColHeader2)) {
              return "transparent";
            }
            return _INDICATOR_COLORS[i_col] ?? { key: "baseContent" };
          },
        },
        legend: {
          maxLegendItemsInOneColumn: 1,
        },

        yTextAxis: {
          showGrid: false,
          paddingTop: 15,
          paddingBottom: 10,
          colGroupGap: 30,
        },
      },
    };
  });

  const chart4 = createMemo<TimChartInputs | undefined>(() => {
    const indicatorId = selectedIndFacId();
    const quarterId = selectedQuarterId();
    const iQuarter = p.csv.getColHeaderIndex(_COL_HEADER_ID_QUARTER);
    if (csvOneBlockOneFacilityType().nRows() === 0) {
      return undefined;
    }
    const csv = csvOneBlockOneFacilityType()
      .getSelectedRows((row) => {
        return row[iQuarter] === quarterId;
      })
      .collapse(
        [_COL_HEADER_ID_FACILITY_NAME],
        [
          {
            colNumbersOrHeaders: [indicatorId],
            reducerFunc: avgStringsIntoString,
          },
        ]
      )
      .withColAsRowHeaders(_COL_HEADER_ID_FACILITY_NAME)
      .getNumbers()
      .getMappedCells((c) => (c > 1 ? 1 : c))
      .getSortedRowsByCol(sortBy() ? 1 : undefined);

    return {
      chartType: "bar",
      chartData: {
        csv,
        labelReplacements: _INDICATORS_FACILITY_ONLY_LABLE_MAP,
        textAxisLabel: "Facilities",
        transpose: true,
      },
      chartStyle: {
        xTextAxis: {
          showGrid: false,
        },
        paletteColors: {
          logic: "single",
          single: _INDICATOR_COLOR_MAP[indicatorId],
        },
      },
    };
  });

  const chart5 = createMemo<TimChartInputs | undefined>(() => {
    const quarterId = "3";
    const iQuarter = p.csv.getColHeaderIndex(_COL_HEADER_ID_QUARTER);
    if (csvOneBlockOneFacilityType().nRows() === 0) {
      return undefined;
    }
    const csv = csvOneBlockOneFacilityType()
      .getSelectedRows((row) => {
        return row[iQuarter] === quarterId;
      })
      .withAddedCol("1", "total_pop")
      .collapse(
        [],
        [
          {
            colNumbersOrHeaders: [
              "total_pop",
              "tim4_1",
              "tim4_2",
              "tim4_3",
              "prop_HTN_over30_pct",
              "prop_DM_over30_pct",
            ],
            reducerFunc: avgStringsIntoString,
          },
        ]
      )
      .getNumbers()
      .getMappedCells((c) => (c > 1 ? 1 : c));
    return {
      chartType: "bar",
      chartData: {
        csv,
        labelReplacements: {
          total_pop: "Total population 30 and above",
          tim4_1:
            "Average proportion of target individuals whose CBAC form is filled till Q3",
          tim4_2:
            "Average proportion of target individuals screened for HTN till Q3",
          tim4_3:
            "Average proportion of target individuals screened for DM till Q3",
          prop_HTN_over30_pct:
            "Average proportion of target individuals diagnosed with HTN till Q3",
          prop_DM_over30_pct:
            "Average proportion of target individuals diagnosed with DM till Q3",
        },
      },
      chartStyle: {
        dataLabelFormatter: toPct1,
        xTextAxis: {
          showGrid: false,
        },
        paletteColors: {
          logic: "single",
          single: { key: "baseContent" },
        },
      },
    };
  });

  const chart6 = createMemo<TimChartInputs | undefined>(() => {
    const quarterId = "3";
    const iQuarter = p.csv.getColHeaderIndex(_COL_HEADER_ID_QUARTER);
    if (csvOneBlockOneFacilityType().nRows() === 0) {
      return undefined;
    }
    const csv = csvOneBlockOneFacilityType()
      .getSelectedRows((row) => {
        return row[iQuarter] === quarterId;
      })
      .withAddedCol("1", "total_pop")
      .collapse(
        [],
        [
          {
            colNumbersOrHeaders: [
              "total_pop",
              "prop_initatied_HTN",
              "prop_initiated_DM",
              "prop_adhered_HTN",
              "prop_adhered_DM",
              "prop_controlled_HTN",
              "prop_controlled_DM",
            ],
            reducerFunc: avgStringsIntoString,
          },
        ]
      )
      .getNumbers()
      .getMappedCells((c) => (c > 1 ? 1 : c));
    return {
      chartType: "bar",
      chartData: {
        csv,
        labelReplacements: {
          total_pop: "Individuals diagnosed with HTN/DM",
          prop_initatied_HTN:
            "Average proportion of individuals initiated on HTN treatment",
          prop_initiated_DM:
            "Average proportion of individuals initiated on DM treatment",
          prop_adhered_HTN:
            "Average proportion of individuals who adhered to HTN treatment",
          prop_adhered_DM:
            "Average proportion of individuals who adhered to DM treatmen",
          prop_controlled_HTN:
            "Average proportion of individuals with controlled HTN",
          prop_controlled_DM:
            "Average proportion of individuals with controlled DM",
        },
      },
      chartStyle: {
        dataLabelFormatter: toPct1,
        xTextAxis: {
          showGrid: false,
        },
        paletteColors: {
          logic: "single",
          single: { key: "baseContent" },
        },
      },
    };
  });

  return (
    <div class="px-7 py-6 w-full h-full overflow-auto space-y-12">
      <OtherItem caption={`Block profile for ${p.blockFull.id}`}>
        <div class="flex gap-y-4 flex-col lg:flex-row lg:gap-x-6 lg:gap-y-0">
          <div class="bg-base-200 px-6 py-4 rounded-[7px] flex-1">
            <div class="font-700 pb-1">Block population</div>
            <div class="text-lg">{toNum0(p.blockFull.blockPopulation)}</div>
          </div>
          <div class="bg-base-200 px-6 py-4 rounded-[7px] flex-1">
            <div class="font-700 pb-1">Number of facilities</div>
            <div class="text-lg">
              <span class="">{toNum0(p.blockFull.facilities.length)} </span>
              <span class="">
                ({toNum0(p.blockFull.facilitiesByFT["SHC"].length)}&nbsp;SHCs,{" "}
                {toNum0(p.blockFull.facilitiesByFT["PHC"].length)}&nbsp;PHCs,{" "}
                {toNum0(p.blockFull.facilitiesByFT["UPHC"].length)}&nbsp;UPHCs)
              </span>
            </div>
          </div>
        </div>
      </OtherItem>
      <ChartItem
        caption={`All indicators`}
        chartInputs={chart1()}
        selectQuarter={true}
        selectFacilityType={true}
        chartHeight="lg"
        facilityTypeOptions={facilityTypeOptions()}
        showFootnote
      />
      <ChartItem
        caption={`All indicators by quarter`}
        chartInputs={chart3()}
        selectFacilityType={true}
        chartHeight="xl"
        facilityTypeOptions={facilityTypeOptions()}
        showFootnote
      />
      <ChartItem
        caption="Single indicator by facility"
        chartInputs={chart4()}
        selectIndFacOnly={true}
        selectFacilityType={true}
        selectQuarter={true}
        chartHeight="md"
        facilityTypeOptions={facilityTypeOptions()}
        sortBy="indicator"
      />
      <Show when={p.districtFull.id !== "Bhavnagar"}>
        <ChartItem
          caption="Average HWC performance in the provision of hypertension and diabetes screening and diagnosis services"
          subCaption="Out of the target population aged 30 years and above"
          chartInputs={chart5()}
          selectFacilityType={true}
          chartHeight="md"
          facilityTypeOptions={facilityTypeOptions()}
        />
        <ChartItem
          caption="Average HWC performance in the provision of hypertension and diabetes management services"
          subCaption="Out of the total registered (diagnosed) patients at the facility"
          chartInputs={chart6()}
          selectFacilityType={true}
          chartHeight="md"
          facilityTypeOptions={facilityTypeOptions()}
        />
      </Show>
      <div class="py-2"></div>
    </div>
  );
}
