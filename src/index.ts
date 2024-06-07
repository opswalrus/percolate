import { A } from "./array";
import { F } from "./function";
import { M } from "./map";
import { P } from "./pipe";
import { S } from "./set";
import { is, isA, isClass } from "./type";

// class Walrus {
//   constructor(private methods: Map<string, Function> = new Map()) {
//     this.defineDefaults();
//   }

//   defineDefaults() {
//     this.define("a", A);
//     this.define("f", F);
//     this.define("is", is);
//     this.define("isClass", isClass);
//     this.define("m", M);
//     this.define("pipe", P);
//     this.define("s", S);
//   }

//   define(name, fn) {
//     this.methods.set(name, fn);
//     Object.defineProperty(this, name, {
//       get: () => {
//         return this.methods.get(name);
//       },
//     });
//   }

//   redefine(name, fn) {
//     this.methods.set(name, fn);
//   }
// }

// export const T = new Tusk();

export const Perc = {
  a: A,
  f: F,
  is,
  isA,
  isClass,
  m: M,
  pipe: P,
  s: S,
};
