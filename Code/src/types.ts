import { Hypothesis, SpeechStateExternalEvent } from "speechstate";
import { AnyActorRef } from "xstate";

export interface DMContext {
  spstRef: AnyActorRef;
  lastResult: Hypothesis[] | null;

  person: Hypothesis[] | null;
  day: Hypothesis[] | null;
  wholeDay: Hypothesis[] | null;
  confirmation: Hypothesis[] | null;
  negation: Hypothesis[] | null;
  time: Hypothesis[] | null;
  phrase: Hypothesis[] | null;
  interpretation: Hypothesis[] | null;
  yes: Hypothesis[] | null;
  no: Hypothesis[] | null;

  
}

export type DMEvents = SpeechStateExternalEvent | { type: "CLICK" };