import { Show } from "solid-js";
import {
  _INDICATORS,
  _INDICATORS_FACILITY_ONLY,
  _QUARTERS,
} from "~/consts/select_options";
import {
  selectedFacilityTypeId,
  selectedIndFacId,
  selectedIndicatorId,
  selectedQuarterId,
  setSelectedFacilityTypeId,
  setSelectedIndFacId,
  setSelectedIndicatorId,
  setSelectedQuarterId,
  setSortBy,
  sortBy,
} from "~/state/ui_selection";
import { Checkbox, Select, SelectOption } from "~/ui";

type Props = {
  selectQuarter?: boolean;
  selectIndicator?: boolean;
  selectIndFacOnly?: boolean;
  selectFacilityType?: boolean;
  sortBy?: string;
  facilityTypeOptions: SelectOption<string>[];
};

export function ChartSelectOptions(p: Props) {
  return (
    <>
      <Show when={p.selectIndicator}>
        <div class="w-[550px]">
          <Select
            label={"Indicator"}
            value={selectedIndicatorId()}
            options={_INDICATORS}
            onChange={setSelectedIndicatorId}
            fullWidth
          />
        </div>
      </Show>
      <Show when={p.selectIndFacOnly}>
        <div class="w-[550px]">
          <Select
            label={"Indicator"}
            value={selectedIndFacId()}
            options={_INDICATORS_FACILITY_ONLY}
            onChange={setSelectedIndFacId}
            fullWidth
          />
        </div>
      </Show>
      <Show when={p.selectQuarter}>
        <div class="w-56">
          <Select
            label={"Quarter"}
            value={selectedQuarterId()}
            options={_QUARTERS}
            onChange={setSelectedQuarterId}
            fullWidth
          />
        </div>
      </Show>
      <Show when={p.selectFacilityType}>
        <div class="w-56">
          <Select
            label={"Facility type"}
            value={selectedFacilityTypeId()}
            options={p.facilityTypeOptions}
            onChange={setSelectedFacilityTypeId}
            fullWidth
          />
        </div>
      </Show>
      <Show when={p.sortBy}>
        <Checkbox
          label={`Sort by ${p.sortBy}`}
          checked={sortBy()}
          onChange={setSortBy}
        />
      </Show>
    </>
  );
}
