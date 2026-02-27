import { DateTime } from "luxon";
import z from "zod";

export const DateTimeRange = z
  .array(z.iso.datetime())
  .min(2)
  .max(2)
  .refine(
    (array) => DateTime.fromISO(array[0]!) < DateTime.fromISO(array[1]!),
    "First date must be less than the second",
  );

export type DateTimeRange = z.infer<typeof DateTimeRange>;
