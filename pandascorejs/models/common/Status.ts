import z from "zod";

export const Status = z.enum(['canceled', 'finished', 'not_started', 'postponed', 'running']);