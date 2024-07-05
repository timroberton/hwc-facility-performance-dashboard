import { createResource } from "solid-js";
import { Csv } from "@timroberton/panther";
import { DistrictBlockFacility } from "~/types/mod";
import { updateDistrict } from "./ui_selection";

export type Data = {
  csv: Csv<string>;
  dbf: DistrictBlockFacility;
};

export const [data] = createResource<Data>(fetchData);

async function fetchData(): Promise<Data> {
  const str = await fetchCsvStr("data/district_data.csv");
  const csv = Csv.fromString(str, { rowHeaders: "none" });
  const dbfRes = await fetch("data/facilities.json");
  const dbf = await dbfRes.json();

  const defaultDistrictId = dbf.districts.at(0)!;
  updateDistrict(defaultDistrictId, dbf);

  return {
    csv,
    dbf,
  };
}

async function fetchCsvStr(url: string): Promise<string> {
  const res = await fetch(url, {
    method: "get",
    headers: {
      "content-type": "text/csv;charset=UTF-8",
    },
  });
  return res.text();
}
