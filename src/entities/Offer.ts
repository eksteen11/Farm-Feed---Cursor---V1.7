import { z } from "zod";
export const OfferSchema = z.object({
  id: z.string(),
  listingId: z.string(),
  buyerId: z.string(),
  price: z.number().nonnegative(),
  quantity: z.number().positive(),
  status: z.enum(["pending","accepted","rejected","withdrawn"])
});
export type Offer = z.infer<typeof OfferSchema>;
