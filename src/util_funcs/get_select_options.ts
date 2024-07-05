import { _ALL_FACILITY_TYPES } from "~/consts/select_options";
import { SelectOption } from "~/ui";
import { DistrictBlockFacility } from "~/types/mod";

export function getSelectOptions(
  ids: string[],
  additional?: { value: string; label: string }
) {
  if (!additional) {
    return ids.map((id) => {
      return { value: id, label: id };
    });
  }
  return [
    additional,
    ...ids.map((id) => {
      return { value: id, label: id };
    }),
  ];
}

export function getSelectOptionsFacilityType(
  dbf: DistrictBlockFacility,
  districtId: string,
  blockId: string
): SelectOption<string>[] {
  const opts = [{ value: _ALL_FACILITY_TYPES, label: "All facility types" }];
  if (
    dbf.districtMap[districtId].blockMap[blockId].facilitiesByFT["SHC"].length >
    0
  ) {
    opts.push({ value: "SHC", label: "SHC" });
  }
  if (
    dbf.districtMap[districtId].blockMap[blockId].facilitiesByFT["PHC"].length >
    0
  ) {
    opts.push({ value: "PHC", label: "PHC" });
  }
  if (
    dbf.districtMap[districtId].blockMap[blockId].facilitiesByFT["UPHC"]
      .length > 0
  ) {
    opts.push({ value: "UPHC", label: "UPHC" });
  }
  if (
    dbf.districtMap[districtId].blockMap[blockId].facilitiesByFT["UHC"].length >
    0
  ) {
    opts.push({ value: "UHC", label: "UHC" });
  }
  return opts;
}

export function getSelectOptionsFacilityType_FOR_DISTRICT(
  districtId: string
): SelectOption<string>[] {
  if (districtId === "Bhavnagar") {
    return [
      { value: _ALL_FACILITY_TYPES, label: "All facility types" },
      { value: "SHC", label: "SHC" },
      { value: "PHC", label: "PHC" },
      { value: "UPHC", label: "UPHC" },
      { value: "UHC", label: "UHC" },
    ];
  }
  return [
    { value: _ALL_FACILITY_TYPES, label: "All facility types" },
    { value: "SHC", label: "SHC" },
    { value: "PHC", label: "PHC" },
    { value: "UPHC", label: "UPHC" },
  ];
}

export function getSelectOptionsFacilities(
  dbf: DistrictBlockFacility,
  districtId: string,
  blockId: string,
  facilityTypeId: string
): SelectOption<string>[] {
  const blockFull = dbf.districtMap[districtId].blockMap[blockId];
  if (facilityTypeId === _ALL_FACILITY_TYPES) {
    const facilityIds = blockFull.facilities;
    return facilityIds.map((id) => {
      return { value: id, label: blockFull.facilityMap[id].facilityName };
    });
  }
  const facilityIds =
    dbf.districtMap[districtId].blockMap[blockId].facilitiesByFT[
      facilityTypeId
    ];
  return facilityIds.map((id) => {
    return { value: id, label: blockFull.facilityMap[id].facilityName };
  });
}
