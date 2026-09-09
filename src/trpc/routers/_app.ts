import { baseProcedure, createTRPCRouter } from '../init';
 
export const appRouter = createTRPCRouter({
    healthCheck: baseProcedure.query(async() => {

        await new Promise((resolve) => setTimeout(resolve, 5000));

        // throw new Error('Health check failed');
        return {satus : 'ok',code:123};
    }),
});
 
// export type definition of API
export type AppRouter = typeof appRouter;