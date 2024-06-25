import { O } from "./object";
import { Selectable } from "./selectable";

class SelectableObject<V> extends Selectable<object, [string, V]> {
  select(predFn: (v: [string, V]) => boolean): object {
    return O(this.self).select(predFn);
  }
}
await Selectable.register(Object, SelectableObject, true);
