import { ButtonRootProps, Button as KButton } from "@kobalte/core/button";
import { JSX } from "solid-js";
import { Intent } from "./types";

type Props = {
  children: JSX.Element;
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
  type?: ButtonRootProps["type"];
  form?: string;
  disabled?: ButtonRootProps["disabled"];
  autofocus?: boolean;
  intent?: Intent;
};

export function Button(p: Props) {
  return (
    <KButton
      class="ui-button"
      onClick={p.onClick}
      type={p.type}
      disabled={p.disabled}
      data-intent={p.intent}
      autofocus={p.autofocus}
      form={p.form}
    >
      {p.children}
    </KButton>
  );
}
