import { Equal } from "./equal";
import { Path } from "./path";

class EqualPath extends Equal<Path> {
  equal(other: Path): boolean {
    return this.self.equals(other);
  }
}
await Equal.register(Path, EqualPath, true);
