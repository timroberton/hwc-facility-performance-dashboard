import { Match, Show, Switch } from "solid-js";
import { About } from "~/components/About";
import { IndividualBlock } from "~/components/IndividualBlock";
import { IndividualDistrict } from "~/components/IndividualDistrict";
import { IndividualFacility } from "~/components/IndividualFacility";
import { Data, data } from "~/state/data";
import {
  blockFull,
  districtFull,
  facilityFull,
  selectedFacilityTypeId,
  selectedTab,
  setSelectedFacilityId,
  setSelectedTab,
  updateBlock,
  updateDistrict,
  updateFacilityType,
} from "~/state/ui_selection";
import { FrameSideOrTop_Md, FrameSideOrTop_Xl, FrameTop, Select } from "~/ui";
import {
  getSelectOptions,
  getSelectOptionsFacilities,
  getSelectOptionsFacilityType,
} from "~/util_funcs/get_select_options";

export default function Home() {
  return (
    <Show when={data()} keyed fallback={<div>Loading data...</div>}>
      {(data) => {
        return <HomeWithData data={data} />;
      }}
    </Show>
  );
}

type HomeWithDataProps = {
  data: Data;
};

function HomeWithData(p: HomeWithDataProps) {
  return (
    <main class="w-full h-full flex flex-col text-base-content bg-base-100">
      <FrameTop
        panelChildren={
          <div class="w-full flex-none px-6 py-4 bg-white text-base-content font-700 text-xl flex items-center border-b gap-4">
            <div class="flex-1 text-3xl">
              HWC Facility Performance Dashboard
            </div>
            <div class="flex flex-none gap-4 items-center">
              <img src="/images/logo_text.jpeg" alt="IPSI logo" class="h-8" />
              <img src="/images/logo_full.jpeg" alt="IPSI logo" class="h-10" />
            </div>
          </div>
        }
      >
        <FrameSideOrTop_Md
          panelChildren={
            <div class="h-auto md:h-full w-full md:w-32 bg-base-200 px-4 py-4 border-b md:border-b-0 md:border-r md:space-y-2 flex md:block space-x-4 md:space-x-0 overflow-auto">
              <div
                onClick={() => setSelectedTab("about")}
                class={` ${selectedTab() === "about" ? "text-base-content bg-base-300 font-700" : ""} text-center md:text-left flex-1 text-lg px-5 py-2 rounded-full cursor-pointer hover:bg-base-300 select-none`}
              >
                About
              </div>
              <div
                onClick={() => setSelectedTab("district")}
                class={` ${selectedTab() === "district" ? "text-base-content bg-base-300 font-700" : ""} text-center md:text-left flex-1 text-lg px-5 py-2 rounded-full cursor-pointer hover:bg-base-300 select-none`}
              >
                District
              </div>
              <div
                onClick={() => setSelectedTab("block")}
                class={` ${selectedTab() === "block" ? "text-base-content bg-base-300 font-700" : ""} text-center md:text-left flex-1 text-lg px-5 py-2 rounded-full cursor-pointer hover:bg-base-300 select-none`}
              >
                Block
              </div>
              <div
                onClick={() => setSelectedTab("facility")}
                class={` ${selectedTab() === "facility" ? "text-base-content bg-base-300 font-700" : ""} text-center md:text-left flex-1 text-lg px-5 py-2 rounded-full cursor-pointer hover:bg-base-300 select-none`}
              >
                Facility
              </div>
            </div>
          }
        >
          <FrameSideOrTop_Xl
            panelChildren={
              selectedTab() === "about" ? undefined : (
                <>
                  <Show when={districtFull()} keyed>
                    {(districtFull) => {
                      return (
                        <div class="px-6 py-4 border-b xl:border-r xl:border-b-0 xl:space-y-6 gap-x-6 gap-y-4 xl:space-x-0 h-auto xl:h-full flex xl:block overflow-auto flex-wrap">
                          <div class="w-48">
                            <Select
                              label={"District"}
                              value={districtFull.id}
                              options={getSelectOptions(p.data.dbf.districts)}
                              onChange={(v) => updateDistrict(v, p.data.dbf)}
                            />
                          </div>
                          <Show
                            when={selectedTab() !== "district" && blockFull()}
                            keyed
                          >
                            {(blockFull) => {
                              return (
                                <>
                                  <div class="w-48">
                                    <Select
                                      label={"Block"}
                                      value={blockFull.id}
                                      options={getSelectOptions(
                                        districtFull.blocks
                                      )}
                                      onChange={(v) =>
                                        updateBlock(
                                          districtFull.id,
                                          v,
                                          p.data.dbf
                                        )
                                      }
                                    />
                                  </div>
                                  <Show when={selectedTab() === "facility"}>
                                    <div class="w-48">
                                      <Select
                                        label={"Facility type"}
                                        value={selectedFacilityTypeId()}
                                        options={getSelectOptionsFacilityType(
                                          p.data.dbf,
                                          districtFull.id,
                                          blockFull.id
                                        )}
                                        onChange={(v) =>
                                          updateFacilityType(
                                            districtFull.id,
                                            blockFull.id,
                                            v,
                                            p.data.dbf
                                          )
                                        }
                                      />
                                    </div>
                                  </Show>
                                  <Show
                                    when={
                                      selectedTab() === "facility" &&
                                      facilityFull()
                                    }
                                    keyed
                                  >
                                    {(facilityFull) => {
                                      return (
                                        <>
                                          <div class="w-48">
                                            <Select
                                              label={"Facility"}
                                              value={facilityFull.id}
                                              options={getSelectOptionsFacilities(
                                                p.data.dbf,
                                                districtFull.id,
                                                blockFull.id,
                                                selectedFacilityTypeId()
                                              )}
                                              onChange={setSelectedFacilityId}
                                            />
                                          </div>
                                        </>
                                      );
                                    }}
                                  </Show>
                                </>
                              );
                            }}
                          </Show>
                        </div>
                      );
                    }}
                  </Show>
                </>
              )
            }
          >
            <Switch
              fallback={
                <div class="px-6 py-4">
                  No facilities for this facility type
                </div>
              }
            >
              <Match when={selectedTab() === "about"} keyed>
                <About />
              </Match>
              <Match
                when={selectedTab() === "district" && districtFull()}
                keyed
              >
                {(districtFull) => {
                  return (
                    <IndividualDistrict
                      districtFull={districtFull}
                      csv={p.data.csv}
                      dbf={p.data.dbf}
                    />
                  );
                }}
              </Match>
              <Match
                when={
                  selectedTab() === "block" && districtFull() && blockFull()
                }
                keyed
              >
                {(blockFull) => {
                  return (
                    <IndividualBlock
                      blockFull={blockFull}
                      districtFull={districtFull()!}
                      csv={p.data.csv}
                      dbf={p.data.dbf}
                    />
                  );
                }}
              </Match>
              <Match
                when={selectedTab() === "facility" && facilityFull()}
                keyed
              >
                {(facilityFull) => {
                  return (
                    <IndividualFacility
                      csv={p.data.csv}
                      facilityFull={facilityFull}
                    />
                  );
                }}
              </Match>
            </Switch>
          </FrameSideOrTop_Xl>
        </FrameSideOrTop_Md>
      </FrameTop>
    </main>
  );
}
