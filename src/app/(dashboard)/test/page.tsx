import { Suspense } from "react";
import {HealthCheck} from "./health-check";
import {HydrateClient, prefetch,trpc} from "@/trpc/server";
import {ErrorBoundary} from "react-error-boundary";

export default function TestPage() {
    prefetch(trpc.healthCheck.queryOptions())
   return (
    <HydrateClient>
        <div className="flex flex-col items-center justify-center gap-4 p-8">
            <h1 className="text-2xl font-bold">tRPC TEst Page</h1>
            <ErrorBoundary fallback={<p>Error occurred</p>}>
            <Suspense fallback={<p>Loading...</p>}>
                <HealthCheck />
                </Suspense>
                </ErrorBoundary>
        </div>
    </HydrateClient>
   )
}
