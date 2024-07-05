import { JSX } from "solid-js";

type Props = {
  caption: string;
  children: JSX.Element;
};

export function OtherItem(p: Props) {
  return (
    <div class="w-full space-y-3">
      <div class="font-700 text-xl leading-none pb-3">{p.caption}</div>
      <div class="">{p.children}</div>
    </div>
  );
}
