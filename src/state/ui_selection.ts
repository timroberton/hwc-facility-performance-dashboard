import { createSignal } from "solid-js";
import {
  _ALL_FACILITY_TYPES,
  _DEFAULT_FACILITY_TYPE_ID,
  _DEFAULT_INDICATOR_ID,
  _DEFAULT_INDICATOR_ID_FACILITY_ONLY,
  _DEFAULT_QUARTER_ID,
  _QUARTERS_LABEL_MAP,
} from "~/consts/mod";
import { DistrictBlockFacility } from "~/types/mod";
import { getSelectOptionsFacilities } from "~/util_funcs/get_select_options";
import { data } from "./data";

export const [selectedTab, setSelectedTab] = createSignal<string>("about");
export const [sortBy, setSortBy] = createSignal<boolean>(true);

export const [selectedDistrictId, setSelectedDistrictId] = createSignal<
  string | undefined
>(undefined);
export const [selectedBlockId, setSelectedBlockId] = createSignal<
  string | undefined
>(undefined);
export const [selectedFacilityId, setSelectedFacilityId] = createSignal<
  string | undefined
>(undefined);

export const districtFull = () => {
  const districtId = selectedDistrictId();
  if (!districtId) return undefined;
  return data()?.dbf.districtMap[districtId];
};
export const blockFull = () => {
  const districtId = selectedDistrictId();
  if (!districtId) return undefined;
  const blockId = selectedBlockId();
  if (!blockId) return undefined;
  return data()?.dbf.districtMap[districtId]?.blockMap[blockId];
};
export const facilityFull = () => {
  const districtId = selectedDistrictId();
  if (!districtId) return undefined;
  const blockId = selectedBlockId();
  if (!blockId) return undefined;
  const facilityId = selectedFacilityId();
  if (!facilityId) return undefined;
  return data()?.dbf.districtMap[districtId]?.blockMap[blockId]?.facilityMap[
    facilityId
  ];
};

export function updateDistrict(districtId: string, dbf: DistrictBlockFacility) {
  setSelectedDistrictId(districtId);
  const blockId = dbf.districtMap[districtId].blocks.at(0)!;
  setSelectedBlockId(blockId);
  setSelectedFacilityTypeId(_ALL_FACILITY_TYPES);
  const facilityId =
    dbf.districtMap[districtId].blockMap[blockId].facilities.at(0)!;
  setSelectedFacilityId(facilityId);
  setSelectedFacilityTypeId(_DEFAULT_FACILITY_TYPE_ID);
}

export function updateBlock(
  districtId: string,
  blockId: string,
  dbf: DistrictBlockFacility
) {
  setSelectedBlockId(blockId);
  setSelectedFacilityTypeId(_ALL_FACILITY_TYPES);
  const facilityId =
    dbf.districtMap[districtId].blockMap[blockId].facilities.at(0)!;
  setSelectedFacilityId(facilityId);
  setSelectedFacilityTypeId(_DEFAULT_FACILITY_TYPE_ID);
}

export function updateFacilityType(
  districtId: string,
  blockId: string,
  facilityTypeId: string,
  dbf: DistrictBlockFacility
) {
  setSelectedFacilityTypeId(facilityTypeId);
  const facilities = getSelectOptionsFacilities(
    dbf,
    districtId,
    blockId,
    facilityTypeId
  );
  setSelectedFacilityId(facilities.at(0)?.value ?? "Unknown");
}

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

export const [selectedQuarterId, setSelectedQuarterId] =
  createSignal<string>(_DEFAULT_QUARTER_ID);

export const [selectedFacilityTypeId, setSelectedFacilityTypeId] =
  createSignal<string>(_DEFAULT_FACILITY_TYPE_ID);

export const [selectedIndicatorId, setSelectedIndicatorId] =
  createSignal<string>(_DEFAULT_INDICATOR_ID);

export const [selectedIndFacId, setSelectedIndFacId] = createSignal<string>(
  _DEFAULT_INDICATOR_ID_FACILITY_ONLY
);

export const selectedQuarterLabel = () =>
  _QUARTERS_LABEL_MAP[selectedQuarterId()];
