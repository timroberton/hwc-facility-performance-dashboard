import {
  CheckboxRootProps,
  Checkbox as KCheckbox,
} from "@kobalte/core/checkbox";

type Props = {
  checked: CheckboxRootProps["checked"];
  onChange?: CheckboxRootProps["onChange"];
  label: string;
};

export function Checkbox(p: Props) {
  return (
    <KCheckbox
      class="flex select-none items-center"
      checked={p.checked}
      onChange={p.onChange}
    >
      <KCheckbox.Control
        class="ui-focusable flex h-5 w-5 flex-none cursor-pointer items-center justify-center rounded border border-base-300 bg-base-100 text-base-content"
        tabIndex={0}
      >
        <KCheckbox.Indicator class="">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M5 12l5 5l10 -10" />
          </svg>
        </KCheckbox.Indicator>
      </KCheckbox.Control>
      <KCheckbox.Label class="flex-1 pl-2 text-base-content">
        {p.label}
      </KCheckbox.Label>
    </KCheckbox>
  );
}
