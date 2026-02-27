import z from "zod";
import { camelCase } from "change-case/keys";

export const BasePlayerSchema = z.looseObject({
  active: z.boolean(),
  age: z.number().gte(0).nullable(),
  birthday: z.string().nullable(),
  firstName: z.string().nullable(),
  id: z.int().gte(1),
  imageUrl: z.string().nullable(),
  lastName: z.string().nullable(),
  modifiedAt: z.iso.datetime(),
  name: z.string(),
  nationality: z.string().nullable(),
  role: z.string().nullable(),
  slug: z.string().nullable(),
});

export const BasePlayer = z.preprocess(
  (data: object) => camelCase(data),
  BasePlayerSchema,
);
export type BasePlayer = z.infer<typeof BasePlayerSchema>;
