import { Protocol } from "./protocol";

export class Selectable<S, T> extends Protocol {
  constructor(public self: S) {
    super();
  }

  select(predFn: (e: T) => boolean): any {
    throw "not implemented";
  }
}

export function select<T>(predFn: (e: T) => boolean) {
  return function (selectableObj, implClass?) {
    return Selectable.for(selectableObj, implClass).select(predFn);
  };
}
