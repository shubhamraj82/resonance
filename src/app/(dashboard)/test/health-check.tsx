"use client"

import {useSuspenseQuery} from "@tanstack/react-query";
import {useTRPC} from "@/trpc/client";

export function HealthCheck() {
    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.healthCheck.queryOptions())
    return (
        <div className="rounded-lg border p-6 text-center">
            <p className="text-muted-foreground">tRPC Status</p>
            <p className="mt-2 text-lg font-semibold">{data.satus}</p>
        </div>
    )
}