import { Protocol } from "./protocol";

export class Compactable<S> extends Protocol {
  constructor(public self: S) {
    super();
  }

  compact(omit?: any[]): any {
    throw new Error("not implemented");
  }
}

export function compact(omit?: any[]) {
  return function (compactableVal) {
    return Compactable.for(compactableVal).compact(omit);
  };
}
