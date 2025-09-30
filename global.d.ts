import type { Temporal as TemporalType } from "temporal-polyfill";

declare global {
  const Temporal: typeof TemporalType;

  namespace Temporal {
    export type Duration = TemporalType.Duration;
    export type Instant = TemporalType.Instant;
    export type ZonedDateTime = TemporalType.ZonedDateTime;
  }
}
