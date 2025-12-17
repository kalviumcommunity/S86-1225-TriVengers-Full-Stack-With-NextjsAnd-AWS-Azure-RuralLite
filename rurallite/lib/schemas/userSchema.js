import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  role: z.string().optional(),
});

export const userUpdateSchema = userSchema.partial();

export default userSchema;
