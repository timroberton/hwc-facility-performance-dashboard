import { Show, createMemo } from "solid-js";
import {
  _COL_HEADER_ID_FACILITY_ID,
  _COL_HEADER_ID_FACILITY_NAME,
  _COL_HEADER_ID_FACILITY_TYPE,
  _COL_HEADER_ID_QUARTER,
  _FACILITY_TYPES,
  _FULL_LABEL_MAP,
} from "~/consts/mod";
import { _MID_2, _MID_3, _PALETTE_1 } from "~/key_colors";
import {
  districtFull,
  facilityFull,
  selectedQuarterId,
} from "~/state/ui_selection";
import {
  Csv,
  TimChartInputs,
  getAdjustedColor,
  getValidNumberOrZero,
  toNum0,
  toNum1,
  toPct1,
} from "@timroberton/panther";
import { FacilityFull } from "~/types/mod";
import { ChartItem } from "./ChartItem";
import { OtherItem } from "./OtherItem";

type Props = {
  csv: Csv<string>;
  facilityFull: FacilityFull;
};

export function IndividualFacility(p: Props) {
  const csvForFacility = createMemo(() => {
    const facilityId = p.facilityFull.id;
    const iFacility = p.csv.getColHeaderIndex(_COL_HEADER_ID_FACILITY_ID);
    return p.csv
      .getSelectedRows((row) => {
        return row[iFacility] === facilityId;
      })
      .withColAsRowHeaders(_COL_HEADER_ID_QUARTER);
  });

  const obj = createMemo(() => {
    const quarterId = selectedQuarterId();
    return csvForFacility().getSingleRowAsObjectWithColHeadersAsProps(
      quarterId
    );
  });

  const val = (id: string) => {
    return [
      csvForFacility().getCellVal(id, "1"),
      csvForFacility().getCellVal(id, "2"),
      csvForFacility().getCellVal(id, "3"),
    ];
  };

  const chart1 = createMemo<TimChartInputs | undefined>(() => {
    const csv = csvForFacility()
      .getSelectedCols(["essential_drugs_pct", "essential_diagnostics_pct"])
      .getNumbers()
      .getMappedCells((c) => (c > 1 ? 1 : c));

    return {
      chartType: "bar",
      chartData: {
        csv,
        labelReplacements: _FULL_LABEL_MAP,
      },
      chartStyle: {
        yTextAxis: {
          showGrid: false,
          colGroupGap: 20,
        },
        paletteColors: {
          logic: "specific-by-row",
          specific: [
            getAdjustedColor(_PALETTE_1, { brighten: 0.3 }),
            _PALETTE_1,
            getAdjustedColor(_PALETTE_1, { darken: 0.3 }),
          ],
        },
      },
    };
  });

  const chart2 = createMemo<TimChartInputs | undefined>(() => {
    const csv = csvForFacility()
      .getSelectedCols(["tim2_3_pct", "tim2_4_pct"])
      .getNumbers()
      .getMappedCells((c) => (c > 1 ? 1 : c));

    return {
      chartType: "bar",
      chartData: {
        csv,
        labelReplacements: {
          ..._FULL_LABEL_MAP,
          tim2_3_pct: "Percentage of existing service packages available",
          tim2_4_pct: "Percentage of new service packages available",
        },
      },
      chartStyle: {
        yTextAxis: {
          showGrid: false,
          colGroupGap: 20,
        },
        paletteColors: {
          logic: "specific-by-row",
          specific: [
            getAdjustedColor(_MID_2, { brighten: 0.3 }),
            _MID_2,
            getAdjustedColor(_MID_2, { darken: 0.3 }),
          ],
        },
      },
    };
  });

  const chart3 = createMemo(() => {
    return csvForFacility()
      .getSelectedCols(["tim3_1", "tim3_2", "tim3_3"])
      .getNumbers()
      .getMappedCells((c) => (c > 1 ? 1 : c));
  });

  const chart4 = createMemo<TimChartInputs | undefined>(() => {
    const csv = csvForFacility()
      .getSelectedCols(["tim4_1", "tim4_2", "tim4_3"])
      .getNumbers()
      .getMappedCells((c) => (c > 1 ? 1 : c));

    return {
      chartType: "bar",
      chartData: {
        csv,
        labelReplacements: _FULL_LABEL_MAP,
      },
      chartStyle: {
        yTextAxis: {
          showGrid: false,
          colGroupGap: 20,
        },
        paletteColors: {
          logic: "specific-by-row",
          specific: [
            getAdjustedColor(_MID_3, { brighten: 0.3 }),
            _MID_3,
            getAdjustedColor(_MID_3, { darken: 0.3 }),
          ],
        },
      },
    };
  });

  return (
    <div class="px-7 py-6 w-full h-full overflow-auto space-y-12 @container">
      <OtherItem
        caption={`Facility profile for ${p.facilityFull.facilityName}`}
      >
        <div class="flex gap-y-4 flex-col lg:flex-row lg:gap-x-6 lg:gap-y-0">
          <div class="bg-base-200 px-6 py-4 rounded-[7px] flex-1">
            <div class="font-700 pb-1">Catchment population</div>
            <div class="text-lg">{toNum0(obj().catchment_pop)}</div>
          </div>
          <div class="bg-base-200 px-6 py-4 rounded-[7px] flex-1">
            <div class="font-700 pb-1">Catchment villages</div>
            <div class="text-lg">
              {toNum0(obj().catchment_villages) === "0"
                ? "--"
                : toNum0(obj().catchment_villages)}
            </div>
          </div>
          <div class="bg-base-200 px-6 py-4 rounded-[7px] flex-1">
            <div class="font-700 pb-1">Facility type</div>
            <div class="text-lg">{obj()[_COL_HEADER_ID_FACILITY_TYPE]}</div>
          </div>
        </div>
      </OtherItem>
      <div class="@[1000px]:flex space-y-12 @[1000px]:space-y-0 @[1000px]:space-x-12">
        <ChartItem
          caption={`Capacity`}
          chartInputs={chart1()}
          chartHeight="sm"
          facilityTypeOptions={_FACILITY_TYPES}
        />
        <ChartItem
          caption={`Service delivery`}
          chartInputs={chart2()}
          chartHeight="sm"
          facilityTypeOptions={_FACILITY_TYPES}
        />
      </div>
      <div class="@[1000px]:flex space-y-12 @[1000px]:space-y-0 @[1000px]:space-x-12">
        <OtherItem caption={`Quality`}>
          <table class="w-full border-base-content">
            <thead class="">
              <tr class="border-b">
                <th class="border-r pb-2"></th>
                <th class="text-center pb-2 w-[100px] border-r font-400 border-base-content">
                  Q1
                  <br />
                  FY 2023-24
                </th>
                <th class="text-center pb-2 w-[100px] border-r font-400 border-base-content">
                  Q2
                  <br />
                  FY 2023-24
                </th>
                <th class="text-center pb-2 w-[100px] border-r font-400 border-base-content">
                  Q3
                  <br />
                  FY 2023-24
                </th>
              </tr>
            </thead>
            <tbody class="">
              {/* <tr class="border-b">
                <th class="text-left border-r py-3 font-400 pr-4">
                  Facility is certified with national NQAS
                </th>
                <td
                  class={`text-center text-white py-3 border-r border-base-content ${chart3().getCellVal(1, 1) ? "bg-success" : "bg-danger"}`}
                >
                  {chart3().getCellVal(1, 1) ? "Yes" : "No"}
                </td>
                <td
                  class={`text-center text-white py-3 border-r border-base-content ${chart3().getCellVal(1, 2) ? "bg-success" : "bg-danger"}`}
                >
                  {chart3().getCellVal(1, 2) ? "Yes" : "No"}
                </td>
                <td
                  class={`text-center text-white py-3 border-r border-base-content ${chart3().getCellVal(1, 3) ? "bg-success" : "bg-danger"}`}
                >
                  {chart3().getCellVal(1, 3) ? "Yes" : "No"}
                </td>
              </tr>
              <tr class="border-b">
                <th class="text-left border-r py-3 font-400 pr-4">
                  Facility is certified with state NQAS
                </th>
                <td
                  class={`text-center text-white py-3 border-r border-base-content ${chart3().getCellVal(2, 1) ? "bg-success" : "bg-danger"}`}
                >
                  {chart3().getCellVal(2, 1) ? "Yes" : "No"}
                </td>
                <td
                  class={`text-center text-white py-3 border-r border-base-content ${chart3().getCellVal(2, 2) ? "bg-success" : "bg-danger"}`}
                >
                  {chart3().getCellVal(2, 2) ? "Yes" : "No"}
                </td>
                <td
                  class={`text-center text-white py-3 border-r border-base-content ${chart3().getCellVal(2, 3) ? "bg-success" : "bg-danger"}`}
                >
                  {chart3().getCellVal(2, 3) ? "Yes" : "No"}
                </td>
              </tr> */}
              <tr class="border-b">
                <th class="text-left border-r py-3 font-400 pr-4">
                  Facility was awarded district Kayakalp award
                </th>
                <td
                  class={`text-center text-white py-3 border-r border-base-content ${chart3().getCellVal(3, 1) ? "bg-success" : "bg-danger"}`}
                >
                  {chart3().getCellVal(3, 1) ? "Yes" : "No"}
                </td>
                <td
                  class={`text-center text-white py-3 border-r border-base-content ${chart3().getCellVal(3, 2) ? "bg-success" : "bg-danger"}`}
                >
                  {chart3().getCellVal(3, 2) ? "Yes" : "No"}
                </td>
                <td
                  class={`text-center text-white py-3 border-r border-base-content ${chart3().getCellVal(3, 3) ? "bg-success" : "bg-danger"}`}
                >
                  {chart3().getCellVal(3, 3) ? "Yes" : "No"}
                </td>
              </tr>
            </tbody>
          </table>
        </OtherItem>
        <ChartItem
          caption="Service coverage"
          chartInputs={chart4()}
          chartHeight="sm"
          facilityTypeOptions={_FACILITY_TYPES}
        />
      </div>
      <OtherItem caption={`Full scorecard`}>
        <div class="w-full space-y-3 @container/sc">
          <div class="@4xl/sc:flex @4xl/sc:space-x-3 space-y-3 @4xl/sc:space-y-0">
            <div class="flex-1 @4xl/sc:w-1/3 p-3 space-y-1 rounded bg-[#ebf1fe]">
              <HeaderItem label="Capacity" />
              <Item
                label="Infrastructure branding"
                val={val("infra_branding")}
              />
              <Item
                label="BP machine present"
                val={
                  districtFull()?.id === "Kalahandi"
                    ? ["--", "--", "--"]
                    : val("BP_machine")
                }
              />
              <Item
                label="Glucometer present"
                val={
                  districtFull()?.id === "Kalahandi"
                    ? ["--", "--", "--"]
                    : val("glucometer")
                }
              />
              <Item
                label="% essential medicines available"
                val={val("essential_drugs_pct")}
                pct={true}
              />
              <Item
                label="% essential diagnostics available"
                val={val("essential_diagnostics_pct")}
                pct={true}
              />
              <Item
                label="Monthly JAS meeting conducted"
                val={val("JAS_meetings")}
              />
              <Show when={p.facilityFull.facilityType === "SHC"}>
                <Item
                  label="Community health officer in position"
                  val={val("CHO_present")}
                />
                <Item
                  label="% of expanded packages in which CHO is trained"
                  val={val("tim1_3")}
                  pct={true}
                />
                <Item
                  label="Minimum of 2 MPWs in position"
                  val={val("MPW_present")}
                />
              </Show>
              <Show when={p.facilityFull.facilityType !== "SHC"}>
                <Item
                  label="Medical Officer in position"
                  val={val("MO_present")}
                />
                <Item
                  label="% of expanded packages in which MO is trained"
                  val={val("tim1_3")}
                  pct={true}
                />
                <Item
                  label="Staff nurse in position"
                  val={val("staff_nurse_present")}
                />
                <Item
                  label="Lab technician in position"
                  val={val("labtech_present")}
                />
              </Show>
              <Item
                label="% required ASHA available"
                val={val("ASHA_pct")}
                pct={true}
                dashIfZero={true}
              />
            </div>
            <div class="flex-1 @4xl/sc:w-1/3 p-3 space-y-1 rounded bg-[#ffeff1]">
              <HeaderItem label="Service delivery" />
              <Item
                label="% of existing package services available"
                val={val("tim2_3_pct")}
                pct={true}
              />
              <Item
                label="% of new package services available"
                val={val("tim2_4_pct")}
                pct={true}
              />
            </div>
          </div>
          <div class="@4xl/sc:flex @4xl/sc:space-x-3 space-y-3 @4xl/sc:space-y-0">
            <div class="flex-1 @4xl/sc:w-1/3 p-3 space-y-1 rounded bg-[#fef4eb]">
              <HeaderItem label="Quality" />
              {/* <Item
                label="National NQAS certification received"
                val={val("national_NQAS")}
              />
              <Item
                label="State NQAS certification received"
                val={val("state_NQAS")}
              /> */}
              <Item
                label="NQAS baseline assessment done"
                val={val("NQAS_baseline_conducted")}
              />
              <Show when={val("NQAS_baseline_conducted").includes("Yes")}>
                <Item
                  label="NQAS baseline score"
                  val={val("NQAS_baseline_score")}
                  pct={true}
                />
              </Show>
              <Item
                label="Kayakalp award received"
                val={val("kayakalp_award")}
              />
              <Show when={districtFull()?.id !== "Bhavnagar"}>
                <Item
                  label="Pentavalent drop-out rate"
                  val={val("penta_dropout_scaled")}
                  pct={true}
                  onlyQ3={true}
                />
                <Item
                  label="HTN treatment drop-out rate"
                  val={val("HTN_dropout")}
                  pct={true}
                  onlyQ3={true}
                />
                <Item
                  label="DM treatment drop-out rate"
                  val={val("DM_dropout")}
                  pct={true}
                  onlyQ3={true}
                />
                <Item
                  label="Proportion of diagnosed HTN patients under control"
                  val={val("prop_controlled_HTN")}
                  pct={true}
                  onlyQ3={true}
                />
                <Item
                  label="Proportion of diagnosed DM patients under control"
                  val={val("prop_controlled_DM")}
                  pct={true}
                  onlyQ3={true}
                />
              </Show>
            </div>
            <div class="flex-1 @4xl/sc:w-1/3 p-3 space-y-1 rounded bg-[#fceef9]">
              <HeaderItem label="Service coverage" />
              <Item
                label="Cumulative prop >30y screened with CBAC"
                val={val("tim4_1")}
                pct={true}
              />
              <Item
                label="Cumulative prop >30y screened for HTN"
                val={val("tim4_2")}
                pct={true}
              />
              <Item
                label="Cumulative prop >30y screened for DM"
                val={val("tim4_3")}
                pct={true}
              />
              <Item
                label="ANC coverage"
                val={
                  districtFull()?.id === "Kalahandi" &&
                  (p.facilityFull.facilityType === "PHC" ||
                    p.facilityFull.facilityType === "UPHC")
                    ? ["--", "--", "--"]
                    : val("prop_onschedule_ANC").map(toPct1)
                }
                onlyQ3={true}
              />
              <Item
                label="Immunization coverage"
                val={
                  districtFull()?.id === "Kalahandi"
                    ? ["--", "--", "--"]
                    : districtFull()?.id === "West Garo Hills" &&
                        p.facilityFull.facilityType === "SHC"
                      ? ["--", "--", "--"]
                      : val("prop_immun_childunder2").map(toPct1)
                }
                onlyQ3={true}
              />
              <Item
                label="Average monthly OPD per 1000 population"
                val={val("avg_OPD_per1000").map((val) => {
                  const n = Number(val.replaceAll(",", ""));
                  if (isNaN(n)) {
                    return val;
                  }
                  return toNum1(n);
                })}
                onlyQ3={true}
              />
            </div>
          </div>
        </div>
      </OtherItem>
      <div class="py-2"></div>
    </div>
  );
}

function getData(csv: Csv<string>, facilityId: string, quarterId: string) {
  const iFacilityName = csv.getColHeaderIndex(_COL_HEADER_ID_FACILITY_NAME);
  const iQuarter = csv.getColHeaderIndex(_COL_HEADER_ID_QUARTER);
  return csv.getSingleRowAsObjectWithColHeadersAsProps((row) => {
    return row[iFacilityName] === facilityId && row[iQuarter] === quarterId;
  });
}

type ItemProps = {
  val: string[];
  label: string;
  pct?: boolean;
  onlyQ3?: boolean;
  dashIfZero?: boolean;
};

function Item(p: ItemProps) {
  return (
    <div class="flex space-x-3">
      <div class="flex-1">{p.label}</div>
      <div class="flex-none w-20 truncate text-center">
        {p.onlyQ3 || (p.dashIfZero && p.val[0] === "0")
          ? "--"
          : p.pct
            ? fmtPct(p.val[0])
            : p.val[0]}
      </div>
      <div class="flex-none w-20 truncate text-center">
        {p.onlyQ3 || (p.dashIfZero && p.val[0] === "0")
          ? "--"
          : p.pct
            ? fmtPct(p.val[1])
            : p.val[1]}
      </div>
      <div class="flex-none w-20 truncate text-center">
        {p.dashIfZero && p.val[0] === "0"
          ? "--"
          : p.pct
            ? fmtPct(p.val[2])
            : p.val[2]}
      </div>
    </div>
  );
}

type HeaderProps = {
  label: string;
};

function HeaderItem(p: HeaderProps) {
  return (
    <div class="flex space-x-3 font-700">
      <div class="flex-1">{p.label}</div>
      <div class="flex-none w-20 truncate text-center">Q1</div>
      <div class="flex-none w-20 truncate text-center">Q2</div>
      <div class="flex-none w-20 truncate text-center">Q3</div>
    </div>
  );
}

function fmtPct(v: string): string {
  if (v.trim() === "NA") {
    return "NA";
  }
  return toPct1(getValidNumberOrZero(v));
}

function fmtNum(v: string): string {
  if (v.trim() === "NA") {
    return "NA";
  }
  return toNum0(getValidNumberOrZero(v));
}
