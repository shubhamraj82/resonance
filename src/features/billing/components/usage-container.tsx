import { useCallback, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/client";
import { useCheckout } from "../hooks/use-checkout";

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function UpgradeCard() {
  const { checkout, isPending: isCheckoutPending } = useCheckout();

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-sm font-semibold tracking-tight text-foreground">
          Pay as you go
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Generate speech starting at $0.30 per 1000 characters.
        </p>
      </div>
      <Button
        variant="outline"
        className="w-full text-xs"
        size="sm"
        disabled={isCheckoutPending}
        onClick={checkout}
      >
        {isCheckoutPending ? (
          <>
            <Spinner className="size-3" />
            Redirecting to checkout...
          </>
        ) : (
          "Upgrade Now"
        )}
      </Button>
    </div>
  );
}

function UsageCard({ estimatedCostCents }: { estimatedCostCents: number }) {
  const trpc = useTRPC();
  const portalMutation = useMutation(
    trpc.billing.createPortalSession.mutationOptions({}),
  );

  const openPortal = useCallback(() => {
    portalMutation.mutate(undefined, {
      onSuccess: (data) => {
        window.open(data.portalUrl, "_blank");
      },
    });
  }, [portalMutation]);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-sm font-semibold tracking-tight text-foreground">
          Current Usage
        </p>
        <p className="text-sl font-bold tracking-tight text-foreground mt-1">
          {formatCurrency(estimatedCostCents)}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Estimated this period
        </p>
      </div>
      <Button
        variant="outline"
        className="w-full text-xs"
        size="sm"
        disabled={portalMutation.isPending}
        onClick={openPortal}
      >
        {portalMutation.isPending ? (
          <>
            <Spinner className="size-3" />
            Redirecting to billing portal...
          </>
        ) : (
          "Manage Subscription"
        )}
      </Button>
    </div>
  );
}

export function UsageContainer(){
    const trpc = useTRPC();
    const router = useRouter();
    const searchParams = useSearchParams();
    const fromCheckout = Boolean(searchParams.get("checkout_id"));

    const {data} = useQuery({
        ...trpc.billing.getStatus.queryOptions(),
        staleTime: fromCheckout ? 0 : 30_000,
        refetchInterval: (query) => {
            if (fromCheckout && !query.state.data?.hasActiveSubscription) {
                return 2000;
            }
            return false;
        },
    });

    useEffect(() => {
        if (fromCheckout && data?.hasActiveSubscription) {
            router.replace("/");
        }
    }, [fromCheckout, data?.hasActiveSubscription, router]);

    return (
        <div className="group-data-[collapsible=icon]:hidden bg-background border border-border rounded-lg p-3">
            {data?.hasActiveSubscription ? (
                <UsageCard estimatedCostCents={data.estimatedCostCents} />
            ) : (
                <UpgradeCard />
            )}
        </div>
    )
}
