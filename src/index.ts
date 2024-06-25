import { A } from "./array";
import { F } from "./function";
import { M } from "./map";
import { O } from "./object";
import { VP } from "./pipe";
import { S } from "./set";
import { V, isA, isClass } from "./type";
import "./all-protocols";

export const Perc = {
  a: A,
  f: F,
  isA,
  isClass,
  m: M,
  o: O,
  pipe: VP,
  s: S,
  v: V,
};
