import z from "zod";

export const Page = z.object({
  number: z.number().min(1),
  size: z.number().min(1).max(100),
});

export type Page = z.infer<typeof Page>;
