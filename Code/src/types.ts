import { Hypothesis, SpeechStateExternalEvent } from "speechstate";
import { AnyActorRef } from "xstate";

export interface DMContext {
  spstRef: AnyActorRef;

  person: Hypothesis[] | null;
  time: Hypothesis[] | null;
  space: Hypothesis[] | null;
  answer: Hypothesis[] | null;
  reply: Hypothesis[] | null;
  archetype: Hypothesis[] | null;
  message: Hypothesis[] | null;
  interpretation: Hypothesis[] | null;

  // name: Hypothesis[] | null;
  // telephone: Hypothesis[] | null;
  
}

export type DMEvents = SpeechStateExternalEvent | { type: "CLICK" };