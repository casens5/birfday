import type { Temporal as TemporalType } from "temporal-polyfill";

declare global {
  const Temporal: typeof TemporalType;
}
