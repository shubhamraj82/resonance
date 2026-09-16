import { Skeleton } from "@/components/ui/skeleton";

function PromptSuggestionSkeleton() {
    return (
        <div className="flex items-center gap-3">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-3 w-full rounded-md" />
            </div>
        </div>
    );
}

function SliderSkeleton() {
    return (
        <div className="space-y-3">
            <Skeleton className="h-4 w-24 rounded-md" />
            <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-14 rounded-md" />
                <Skeleton className="h-3 w-16 rounded-md" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
        </div>
    );
}

export default function Loading() {
    return (
        <div className="flex min-h-0 flex-1 overflow-hidden">
            <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex h-full min-h-0 flex-1 flex-col">
                    <div className="relative min-h-0 flex-1 p-4 lg:p-8">
                        <div className="space-y-3">
                            <Skeleton className="h-5 w-72 max-w-full rounded-md" />
                            <Skeleton className="h-5 w-full rounded-md" />
                            <Skeleton className="h-5 w-11/12 rounded-md" />
                            <Skeleton className="h-5 w-4/5 rounded-md" />
                        </div>
                    </div>

                    <div className="shrink-0 p-4 lg:p-6">
                        <div className="flex flex-col gap-3 lg:hidden">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-10 flex-1 rounded-md" />
                                <Skeleton className="size-10 rounded-md" />
                            </div>
                            <Skeleton className="h-10 w-full rounded-md" />
                        </div>

                        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-4">
                            <PromptSuggestionSkeleton />
                            <PromptSuggestionSkeleton />
                            <PromptSuggestionSkeleton />
                        </div>
                    </div>
                </div>

                <div className="hidden h-full flex-1 flex-col items-center justify-center gap-6 border-t lg:flex">
                    <div className="flex flex-col items-center gap-3">
                        <div className="relative flex w-32 items-center justify-center">
                            <Skeleton className="absolute left-0 size-13 -rotate-30 rounded-full" />
                            <Skeleton className="relative z-10 size-13 rounded-full" />
                            <Skeleton className="absolute right-0 size-13 rotate-30 rounded-full" />
                        </div>
                        <Skeleton className="h-6 w-48 rounded-md" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-64 rounded-md" />
                            <Skeleton className="mx-auto h-4 w-52 rounded-md" />
                        </div>
                    </div>
                    <Skeleton className="h-9 w-36 rounded-md" />
                </div>
            </div>

            <div className="hidden min-h-0 w-105 flex-col border-l lg:flex">
                <div className="grid h-12 grid-cols-2 border-b">
                    <div className="flex items-center justify-center gap-2 border-b border-foreground">
                        <Skeleton className="size-4 rounded-md" />
                        <Skeleton className="h-4 w-16 rounded-md" />
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <Skeleton className="size-4 rounded-md" />
                        <Skeleton className="h-4 w-14 rounded-md" />
                    </div>
                </div>

                <div className="border-b border-dashed p-4">
                    <div className="flex items-center gap-3 rounded-lg border p-3">
                        <Skeleton className="size-10 rounded-full" />
                        <div className="min-w-0 flex-1 space-y-2">
                            <Skeleton className="h-4 w-28 rounded-md" />
                            <Skeleton className="h-3 w-36 rounded-md" />
                        </div>
                        <Skeleton className="size-4 rounded-md" />
                    </div>
                </div>

                <div className="flex-1 space-y-8 p-4">
                    <SliderSkeleton />
                    <SliderSkeleton />
                    <SliderSkeleton />
                    <SliderSkeleton />
                </div>
            </div>
        </div>
    );
}
