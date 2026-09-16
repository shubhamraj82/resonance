import { createTRPCRouter } from '../init';
import { generationsRouter } from './generation';
import { voicesRouter } from './voices';
 
export const appRouter = createTRPCRouter({
    voices:voicesRouter,
    generations:generationsRouter,
});
 
// export type definition of API
export type AppRouter = typeof appRouter;