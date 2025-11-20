import z from "zod";

export const Region = z.enum(['ASIA', 'EEU', 'ME', 'NA', 'OCE', 'SA', 'WEU']);
export type Region = z.infer<typeof Region>;