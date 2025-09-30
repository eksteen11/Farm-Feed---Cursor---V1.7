import { z } from "zod";
export const UserSchema = z.object({
  id: z.string(),
  role: z.enum(["buyer","seller","admin"]).default("buyer"),
  email: z.string().email(),
  displayName: z.string().min(2).optional()
});
export type User = z.infer<typeof UserSchema>;
