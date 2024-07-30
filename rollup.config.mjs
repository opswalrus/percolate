// rollup.config.js
import typescript from "@rollup/plugin-typescript";

// export default [
//   {
//     input: "src/index.ts",
//     output: {
//       dir: "dist",
//       format: "esm",
//     },
//     plugins: [typescript()],
//   },
//   {
//     input: "src/path.ts",
//     output: {
//       dir: "dist",
//       format: "esm",
//     },
//     plugins: [typescript()],
//   },
// ];

export default {
  input: {
    index: "src/index.ts",
    array: "src/array.ts",
    compactable: "src/compactable.ts",
    dir: "src/dir.ts",
    enumerable: "src/enumerable.ts",
    enumerator: "src/enumerator.ts",
    equal: "src/equal.ts",
    file: "src/file.ts",
    function: "src/function.ts",
    map: "src/map.ts",
    mappable: "src/mappable.ts",
    object: "src/object.ts",
    path: "src/path.ts",
    pipe: "src/pipe.ts",
    platform: "src/platform.ts",
    protocol: "src/protocol.ts",
    selectable: "src/selectable.ts",
    set: "src/set.ts",
    string: "src/string.ts",
    type: "src/type.ts",
  },
  output: {
    entryFileNames: "[name].mjs",
    dir: "dist",
    format: "esm",
  },
  plugins: [typescript()],
};
