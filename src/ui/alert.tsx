import { Dialog as KDialog } from "@kobalte/core/dialog";
import { createSignal, JSX, Match, Show, Switch } from "solid-js";
import { Dynamic } from "solid-js/web";
import { Button } from "./button";
import { Input } from "./input";
import { Intent } from "./types";

///////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// Inputs ////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

type OpenAlertInput = {
  title?: string;
  text: string;
  intent?: Intent;
  closeButtonLabel?: string;
};

type OpenConfirmInput = {
  title?: string;
  text: string | JSX.Element;
  intent?: Intent;
  confirmButtonLabel?: string;
};

type OpenPromptInput = {
  initialInputText: string;
  title?: string;
  text?: string;
  inputLabel?: string;
  inputType?: JSX.InputHTMLAttributes<HTMLInputElement>["type"];
  intent?: Intent;
  saveButtonLabel?: string;
};

export type AlertComponentProps<TProps, TReturn> = TProps & {
  close: (p: TReturn | undefined) => void;
};

type OpenComponentInput<TProps, TReturn> = {
  elementProps: TProps;
  element: (p: AlertComponentProps<TProps, TReturn>) => JSX.Element;
};

///////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// States ////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

type AlertStateType = OpenAlertInput & {
  stateType: "alert";
  alertResolver(): void;
};

type ConfirmStateType = OpenConfirmInput & {
  stateType: "confirm";
  confirmResolver(v: boolean): void;
};

type PromptStateType = OpenPromptInput & {
  stateType: "prompt";
  promptResolver(v: string | undefined): void;
};

type ACPStateType = AlertStateType | ConfirmStateType | PromptStateType;

function isACPState(
  alertState:
    | AlertStateType
    | ConfirmStateType
    | PromptStateType
    | ComponentStateType<any, any>
    | undefined
): alertState is ACPStateType {
  return alertState?.stateType !== "component";
}

function isAlertState(
  alertState:
    | AlertStateType
    | ConfirmStateType
    | PromptStateType
    | ComponentStateType<any, any>
    | undefined
): alertState is AlertStateType {
  return alertState?.stateType === "alert";
}

function isConfirmState(
  alertState:
    | AlertStateType
    | ConfirmStateType
    | PromptStateType
    | ComponentStateType<any, any>
    | undefined
): alertState is ConfirmStateType {
  return alertState?.stateType === "confirm";
}

function isPromptState(
  alertState:
    | AlertStateType
    | ConfirmStateType
    | PromptStateType
    | ComponentStateType<any, any>
    | undefined
): alertState is PromptStateType {
  return alertState?.stateType === "prompt";
}

function isComponentState(
  alertState:
    | AlertStateType
    | ConfirmStateType
    | PromptStateType
    | ComponentStateType<any, any>
    | undefined
): alertState is ComponentStateType<any, any> {
  return alertState?.stateType === "component";
}

type ComponentStateType<TProps, TReturn> = OpenComponentInput<
  TProps,
  TReturn
> & {
  stateType: "component";
  componentResolver(v: TReturn | undefined): void;
};

const [alertState, setAlertState] = createSignal<
  | AlertStateType
  | ConfirmStateType
  | PromptStateType
  | ComponentStateType<any, any>
  | undefined
>(undefined);

export async function openAlert(v: OpenAlertInput): Promise<void> {
  return new Promise((resolve: () => void, reject) => {
    setAlertState({
      ...v,
      stateType: "alert",
      alertResolver: resolve,
    });
  });
}

export async function openConfirm(v: OpenConfirmInput): Promise<boolean> {
  return new Promise<boolean>((resolve: (p: boolean) => void, reject) => {
    setAlertState({
      ...v,
      stateType: "confirm",
      confirmResolver: resolve,
    });
  });
}

export async function openPrompt(
  v: OpenPromptInput
): Promise<string | undefined> {
  return new Promise<string | undefined>(
    (resolve: (p: string | undefined) => void, reject) => {
      setAlertState({
        ...v,
        stateType: "prompt",
        promptResolver: resolve,
      });
    }
  );
}

export async function openComponent<TProps, TReturn>(
  v: OpenComponentInput<TProps, TReturn>
): Promise<TReturn | undefined> {
  return new Promise<TReturn | undefined>(
    (resolve: (p: TReturn | undefined) => void, reject) => {
      setAlertState({
        ...v,
        stateType: "component",
        componentResolver: resolve,
      });
    }
  );
}

export default function AlertProvider() {
  function cancelAny() {
    const ass = alertState();
    if (isAlertState(ass)) {
      ass.alertResolver();
    }
    if (isConfirmState(ass)) {
      ass.confirmResolver(false);
    }
    if (isPromptState(ass)) {
      ass.promptResolver(undefined);
    }
    if (isComponentState(ass)) {
      ass.componentResolver(undefined);
    }
    setAlertState(undefined);
  }

  return (
    <Show when={alertState()} keyed>
      {(keyedAlertState) => {
        return (
          <KDialog open={true} modal={true} onOpenChange={cancelAny}>
            <KDialog.Portal>
              <KDialog.Overlay class="fixed inset-0 z-50 bg-black bg-opacity-30" />
              <div class="fixed inset-0 z-50 flex items-center justify-center">
                <Switch>
                  <Match
                    when={isComponentState(keyedAlertState) && keyedAlertState}
                    keyed
                  >
                    {(keyedComponentState) => {
                      return (
                        <KDialog.Content class="ui-never-focusable z-50 rounded bg-base-100 shadow-lg outline-none">
                          <Dynamic
                            component={keyedComponentState.element}
                            close={(p: unknown) => {
                              keyedComponentState.componentResolver(p);
                              setAlertState(undefined);
                            }}
                            {...keyedComponentState.elementProps}
                          />
                        </KDialog.Content>
                      );
                    }}
                  </Match>
                  <Match
                    when={isACPState(keyedAlertState) && keyedAlertState}
                    keyed
                  >
                    {(keyedACPState) => {
                      return (
                        <KDialog.Content class="ui-pad ui-alert-w ui-never-focusable z-50 rounded bg-base-100 shadow-lg">
                          <div class="ui-space-y">
                            <Show
                              when={keyedACPState.title || keyedACPState.text}
                            >
                              <div class="space-y-3">
                                <Show when={keyedACPState.title} keyed>
                                  {(keyedTitle) => {
                                    return (
                                      <h2
                                        class="text-lg font-700 leading-6 data-primary:text-primary data-neutral:text-neutral data-success:text-success data-danger:text-danger"
                                        data-intent={keyedACPState.intent}
                                      >
                                        {keyedTitle}
                                      </h2>
                                    );
                                  }}
                                </Show>
                                <Show when={keyedACPState.text} keyed>
                                  {(keyedText) => {
                                    return <p class="">{keyedText}</p>;
                                  }}
                                </Show>
                              </div>
                            </Show>
                            <Switch>
                              <Match
                                when={
                                  isAlertState(keyedACPState) && keyedACPState
                                }
                                keyed
                              >
                                {(keyedAlertState) => {
                                  return (
                                    <div class="">
                                      <Button
                                        onClick={() => {
                                          keyedAlertState.alertResolver();
                                          setAlertState(undefined);
                                        }}
                                        intent={keyedAlertState.intent}
                                      >
                                        {keyedAlertState.closeButtonLabel ??
                                          "Close"}
                                      </Button>
                                    </div>
                                  );
                                }}
                              </Match>
                              <Match
                                when={
                                  isConfirmState(keyedACPState) && keyedACPState
                                }
                                keyed
                              >
                                {(keyedConfirmState) => {
                                  return (
                                    <div class="ui-space-x-sm">
                                      <Button
                                        onClick={() => {
                                          keyedConfirmState.confirmResolver(
                                            true
                                          );
                                          setAlertState(undefined);
                                        }}
                                        intent={keyedConfirmState.intent}
                                      >
                                        {keyedConfirmState.confirmButtonLabel ??
                                          "Confirm"}
                                      </Button>
                                      <Button
                                        onClick={() => {
                                          keyedConfirmState.confirmResolver(
                                            false
                                          );
                                          setAlertState(undefined);
                                        }}
                                        intent="neutral"
                                        autofocus
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  );
                                }}
                              </Match>
                              <Match
                                when={
                                  isPromptState(keyedACPState) && keyedACPState
                                }
                                keyed
                              >
                                {(keyedPromptState) => {
                                  return (
                                    <InnerForPrompt
                                      pst={alertState() as PromptStateType}
                                      close={(v: string | undefined) => {
                                        keyedPromptState.promptResolver(v);
                                        setAlertState(undefined);
                                      }}
                                    />
                                  );
                                }}
                              </Match>
                            </Switch>
                          </div>
                        </KDialog.Content>
                      );
                    }}
                  </Match>
                </Switch>
              </div>
            </KDialog.Portal>
          </KDialog>
        );
      }}
    </Show>
  );
}

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

type InnerForPromptProps = {
  pst: PromptStateType;
  close: (p: string | undefined) => void;
};

function InnerForPrompt(props: InnerForPromptProps) {
  const [promptInput, setPromptInput] = createSignal<string>(
    props.pst.initialInputText
  );
  return (
    <form id="promptForm" class="ui-space-y w-full">
      <Input
        label={props.pst.inputLabel}
        value={promptInput()}
        onChange={(v) => setPromptInput(v)}
        autofocus
        fullWidth
      />
      <div class="ui-space-x-sm">
        <Button
          type="submit"
          form="promptForm"
          onClick={(evt: MouseEvent) => {
            evt.preventDefault();
            props.close(promptInput());
          }}
          intent={props.pst.intent}
        >
          {props.pst.saveButtonLabel ?? "Confirm"}
        </Button>
        <Button
          type="button"
          onClick={(evt: MouseEvent) => {
            evt.preventDefault();
            props.close(undefined);
          }}
          intent="neutral"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
