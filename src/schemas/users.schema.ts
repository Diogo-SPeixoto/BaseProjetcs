import z from "zod";

export const createUserSchema = z.object({
    name: z.string().max(100, "Name must be at most 255 characters long"),
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters long").max(30),
})
