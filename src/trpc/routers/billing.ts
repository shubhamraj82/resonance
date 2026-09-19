import { TRPCError } from "@trpc/server";
import {polar} from "@/lib/polar";
import {env} from "@/lib/env";
import {createTRPCRouter,orgProcedure} from "../init";

export const billingRouter = createTRPCRouter({
    createCheckout: orgProcedure.mutation(async ({ ctx }) => {
    const result = await polar.checkouts.create({
      products: [env.POLAR_PRODUCT_ID],
      externalCustomerId: ctx.orgId,
      successUrl: process.env.APP_URL,
    });

    if (!result.url) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create checkout session",
      });
    }

    return { checkoutUrl: result.url };
  }),

  createPortalSession: orgProcedure.mutation(async ({ ctx }) => {
    const result = await polar.customerPortalSessions.create({
      externalCustomerId: ctx.orgId,
    });

    if (!result.customerPortalUrl) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create customer portal session",
      });
    }

    return { portalUrl: result.customerPortalUrl };
  }),

  getStatus:
})