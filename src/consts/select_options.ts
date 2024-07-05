import { _MID_2, _MID_3, _PALETTE_1, _PALETTE_2 } from "~/key_colors";
import { ColGroupAsStrings } from "@timroberton/panther";
import { getLabelMapFromKeyText } from "../util_funcs/get_label_map";

export const _INDICATORS = [
  // 1
  {
    value: "tim1_1",
    label:
      "Percentage of HWCs with at least 80% of essential medicines available",
    domain: "Capacity",
    color: _PALETTE_1,
  },
  {
    value: "tim1_2",
    label:
      "Percentage of HWCs with at least 80% of essential diagnostics available",
    domain: "Capacity",
    color: _PALETTE_1,
  },
  {
    value: "tim1_3",
    label:
      "Percentage of HWCs with CHO/MO training completed for new 6 packages",
    domain: "Capacity",
    color: _PALETTE_1,
  },
  // 2
  {
    value: "tim2_1",
    label: "Percentage of HWCs with all 12 service packages rolled out",
    domain: "Service delivery",
    color: _MID_2,
  },
  {
    value: "tim2_3",
    label: "Proportion of HWCs providing all six existing service packages",
    domain: "Service delivery",
    color: _MID_2,
  },
  {
    value: "tim2_4",
    label: "Proportion of HWCs providing all six new service packages",
    domain: "Service delivery",
    color: _MID_2,
  },
  {
    value: "tim2_5",
    label: "Proportion of HWCs providing ANC services",
    domain: "Service delivery",
    color: _MID_2,
  },
  {
    value: "tim2_6",
    label: "Proportion of HWCs providing immunization services",
    domain: "Service delivery",
    color: _MID_2,
  },
  // 3
  {
    value: "tim3_1",
    label: "Percentage of HWCs certified with national NQAS",
    domain: "Quality",
    color: _PALETTE_2,
  },
  {
    value: "tim3_2",
    label: "Percentage of HWCs certified with state NQAS",
    domain: "Quality",
    color: _PALETTE_2,
  },
  {
    value: "tim3_3",
    label: "Percentage of HWCs awarded district Kayakalp award ",
    domain: "Quality",
    color: _PALETTE_2,
  },
  // 4
  {
    value: "tim4_1",
    label:
      "Cumulative percentage of 30 and above population whose CBAC form was filled",
    domain: "Service coverage",
    color: _MID_3,
  },
  {
    value: "tim4_2",
    label:
      "Cumulative percentage of 30 and above population screened for hypertension",
    domain: "Service coverage",
    color: _MID_3,
  },
  {
    value: "tim4_3",
    label:
      "Cumulative percentage of 30 and above population screened for diabetes mellitus",
    domain: "Service coverage",
    color: _MID_3,
  },
  {
    value: "prop_onschedule_ANC",
    label:
      "Proportion of registered pregnant women who received ANC as per schedule in the quarter",
    domain: "Service coverage",
    color: _MID_3,
  },
  {
    value: "prop_immun_childunder2",
    label:
      "Proportion of children under two years of age who received immunization as per schedule in the quarter",
    domain: "Service coverage",
    color: _MID_3,
  },
];

export const _DEFAULT_INDICATOR_ID = "tim1_1";

export const _INDICATOR_IDS = _INDICATORS.map((ind) => ind.value);

export const _INDICATOR_COLORS = _INDICATORS.map((ind) => ind.color);

export const _INDICATORS_LABEL_MAP = getLabelMapFromKeyText(_INDICATORS);

export const _INDICATORS_COL_GROUPS = _INDICATORS.reduce<ColGroupAsStrings[]>(
  (arr, val) => {
    let colGroup = arr.find((a) => a.label === val.domain);
    if (!colGroup) {
      colGroup = { label: val.domain, colHeaders: [] };
      arr.push(colGroup);
    }
    colGroup.colHeaders.push(val.value);
    return arr;
  },
  []
);

export const _INDICATORS_COL_GROUPS_MINUS_2 = _INDICATORS.reduce<
  ColGroupAsStrings[]
>((arr, val) => {
  if (val.value === "tim2_5" || val.value === "tim2_6") {
    return arr;
  }
  let colGroup = arr.find((a) => a.label === val.domain);
  if (!colGroup) {
    colGroup = { label: val.domain, colHeaders: [] };
    arr.push(colGroup);
  }
  colGroup.colHeaders.push(val.value);
  return arr;
}, []);

export const _INDICATORS_COL_GROUPS_MINUS_3 = _INDICATORS.reduce<
  ColGroupAsStrings[]
>((arr, val) => {
  if (
    val.value === "tim2_5" ||
    val.value === "tim2_6" ||
    val.value === "prop_immun_childunder2"
  ) {
    return arr;
  }
  let colGroup = arr.find((a) => a.label === val.domain);
  if (!colGroup) {
    colGroup = { label: val.domain, colHeaders: [] };
    arr.push(colGroup);
  }
  colGroup.colHeaders.push(val.value);
  return arr;
}, []);

export const _INDICATORS_COL_GROUPS_MINUS_4 = _INDICATORS.reduce<
  ColGroupAsStrings[]
>((arr, val) => {
  if (
    val.value === "tim2_5" ||
    val.value === "tim2_6" ||
    val.value === "prop_onschedule_ANC" ||
    val.value === "prop_immun_childunder2"
  ) {
    return arr;
  }
  let colGroup = arr.find((a) => a.label === val.domain);
  if (!colGroup) {
    colGroup = { label: val.domain, colHeaders: [] };
    arr.push(colGroup);
  }
  colGroup.colHeaders.push(val.value);
  return arr;
}, []);

/////////////////////////////////////////////////////////////////////////
//  ________                         __                  __            //
// /        |                       /  |                /  |           //
// $$$$$$$$/______    _______       $$/  _______    ____$$ |  _______  //
// $$ |__  /      \  /       |      /  |/       \  /    $$ | /       | //
// $$    | $$$$$$  |/$$$$$$$/       $$ |$$$$$$$  |/$$$$$$$ |/$$$$$$$/  //
// $$$$$/  /    $$ |$$ |            $$ |$$ |  $$ |$$ |  $$ |$$      \  //
// $$ |   /$$$$$$$ |$$ \_____       $$ |$$ |  $$ |$$ \__$$ | $$$$$$  | //
// $$ |   $$    $$ |$$       |      $$ |$$ |  $$ |$$    $$ |/     $$/  //
// $$/     $$$$$$$/  $$$$$$$/       $$/ $$/   $$/  $$$$$$$/ $$$$$$$/   //
//                                                                     //
/////////////////////////////////////////////////////////////////////////

export const _INDICATORS_FACILITY_ONLY = [
  // 1
  {
    value: "essential_drugs_pct",
    label: "Percentage of essential medicines available",
    domain: "Capacity",
    color: _PALETTE_1,
  },
  {
    value: "essential_diagnostics_pct",
    label: "Percentage of essential diagnostics available",
    domain: "Capacity",
    color: _PALETTE_1,
  },
  {
    value: "tim1_3",
    label: "Percentage of packages for which MO/CHO is trained",
    domain: "Capacity",
    color: _MID_2,
  },
  // 2
  {
    value: "tim2_3_pct",
    label: "Percentage of existing service packages available",
    domain: "Service delivery",
    color: _MID_2,
  },
  {
    value: "tim2_4_pct",
    label: "Percentage of new service packages available",
    domain: "Service delivery",
    color: _MID_2,
  },
  // 3
  {
    value: "tim3_1",
    label: "Facility is certified with national NQAS",
    domain: "Quality",
    color: _PALETTE_2,
  },
  {
    value: "tim3_2",
    label: "Facility is certified with state NQAS",
    domain: "Quality",
    color: _PALETTE_2,
  },
  {
    value: "tim3_3",
    label: "Facility was awarded district Kayakalp award ",
    domain: "Quality",
    color: _PALETTE_2,
  },
  // 4
  {
    value: "tim4_1",
    label:
      "Cumulative percentage of 30 and above population whose CBAC form was filled",
    domain: "Service coverage",
    color: _MID_3,
  },
  {
    value: "tim4_2",
    label:
      "Cumulative percentage of 30 and above population screened for hypertension",
    domain: "Service coverage",
    color: _MID_3,
  },
  {
    value: "tim4_3",
    label:
      "Cumulative percentage of 30 and above population screened for diabetes mellitus",
    domain: "Service coverage",
    color: _MID_3,
  },
];

export const _INDICATORS_FACILITY_ONLY_LABLE_MAP = getLabelMapFromKeyText(
  _INDICATORS_FACILITY_ONLY
);

export const _DEFAULT_INDICATOR_ID_FACILITY_ONLY = "essential_drugs_pct";

export const _QUARTERS = [
  { value: "1", label: "Q1, FY 2023-24" },
  { value: "2", label: "Q2, FY 2023-24" },
  { value: "3", label: "Q3, FY 2023-24" },
];

export const _DEFAULT_QUARTER_ID = "1";

export const _QUARTERS_LABEL_MAP = getLabelMapFromKeyText(_QUARTERS);

export const _ALL_FACILITY_TYPES = "ALL";

export const _FACILITY_TYPES = [
  { value: _ALL_FACILITY_TYPES, label: "All facility types" },
  { value: "SHC", label: "SHC" },
  { value: "PHC", label: "PHC" },
  { value: "UPHC", label: "UPHC" },
  { value: "UHC", label: "UHC" },
];

export const _DEFAULT_FACILITY_TYPE_ID = _ALL_FACILITY_TYPES;

export const _FACILITY_TYPES_LABEL_MAP =
  getLabelMapFromKeyText(_FACILITY_TYPES);

export const _FULL_LABEL_MAP: Record<string, string> = {
  ..._INDICATORS_LABEL_MAP,
  ..._QUARTERS_LABEL_MAP,
  ..._FACILITY_TYPES_LABEL_MAP,
  essential_drugs_pct: "Percentage of essential drugs available",
  essential_diagnostics_pct: "Percentage of essential diagnostics available",
  // timServicesAvailable: "Percentage of service packages available",
  // timServicesTrained: "Percentage of packages for which MO/CHO is trained",
};
