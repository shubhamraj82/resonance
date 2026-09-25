import { TRPCError } from "@trpc/server";
import {polar} from "@/lib/polar";
import {env} from "@/lib/env";
import {getPublicAppUrl} from "@/lib/app-url";
import {createTRPCRouter,orgProcedure} from "../init";

export const billingRouter = createTRPCRouter({
    createCheckout: orgProcedure.mutation(async ({ ctx }) => {
    const appUrl = await getPublicAppUrl();
    const result = await polar.checkouts.create({
      products: [env.POLAR_PRODUCT_ID],
      externalCustomerId: ctx.orgId,
      successUrl: `${appUrl}/?checkout_id={CHECKOUT_ID}`,
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
    const result = await polar.customerSessions.create({
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

  getStatus:orgProcedure.query(async({ctx})=> {
    try{
        const customerState=await polar.customers.getStateExternal({
            externalId:ctx.orgId,
        });
        const hasActiveSubscription=(customerState.activeSubscriptions ?? []).length>0;


        let estimatedCostCents=0;
        for(const sub of customerState.activeSubscriptions ?? []){
            for(const meter of sub.meters ?? []){
                estimatedCostCents+=meter.amount ?? 0;
            }
        }
        return {
            hasActiveSubscription,
            customerId:customerState.id,
            estimatedCostCents,
        }
    }catch{
        return {
            hasActiveSubscription:false,
            customerId:null,
            estimatedCostCents:0,
        }
    }
  })
})