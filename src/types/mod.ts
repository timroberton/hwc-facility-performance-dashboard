export type DistrictBlockFacility = {
  districts: string[];
  districtMap: Record<string, DistrictFull>;
};

export type DistrictFull = {
  id: string;
  districtPopulation: number;
  nFacilities: number;
  nFacilitiesByFT: Record<string, number>;
  blocks: string[];
  blockMap: Record<string, BlockFull>;
};

export type BlockFull = {
  id: string;
  blockPopulation: number;
  facilities: string[];
  facilitiesByFT: Record<string, string[]>;
  facilityMap: Record<string, FacilityFull>;
};

export type FacilityFull = {
  id: string;
  facilityName: string;
  facilityType: string;
};
