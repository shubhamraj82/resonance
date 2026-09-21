import { createTRPCRouter } from '../init';
import { billingRouter } from './billing';
import { generationsRouter } from './generation';
import { voicesRouter } from './voices';
 
export const appRouter = createTRPCRouter({
    voices:voicesRouter,
    generations:generationsRouter,
    billing:billingRouter
});
 
// export type definition of API
export type AppRouter = typeof appRouter;