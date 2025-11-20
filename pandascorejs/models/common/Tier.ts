import z from "zod";

export const Tier = z.enum(['a', 'b', 'c', 'd', 's', 'unranked']);