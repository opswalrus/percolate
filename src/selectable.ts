import { Protocol } from "./protocol";

export class Selectable<S, T> extends Protocol {
  constructor(public self: S) {
    super();
  }

  select(predFn: (e: T) => boolean): any {
    throw new Error("not implemented");
  }
}

export function select<T>(predFn: (e: T) => boolean) {
  return function (selectableVal, implClass?) {
    return Selectable.for(selectableVal, implClass).select(predFn);
  };
}
