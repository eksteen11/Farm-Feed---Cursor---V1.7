import { z } from "zod";
export const ListingSchema = z.object({
  id: z.string(),
  title: z.string().min(3),
  price: z.number().nonnegative(),
  commodity: z.enum(["maize","wheat","barley","sunflower","soya","feed"]),
  fav: z.boolean().default(false)
});
export type Listing = z.infer<typeof ListingSchema>;
