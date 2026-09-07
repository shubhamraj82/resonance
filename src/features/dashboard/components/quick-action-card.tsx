import Link from 'next/link';
import {ArrowRight} from "lucide-react"
import {Button} from "@/components/ui/button"
import type {QuickAction} from "@/features/dashboard/data/quick-action"
import { cn } from '@/lib/utils';

type QuickActionCardProps = QuickAction;

export function QuickActionCard({
    title,
    description,
    gradient,
    href,
}:QuickActionCardProps){
    return (
        <div className="flex gap-4 rounded-xl border bg-card p-3">
            <div
            className={cn("relative h-31 w-41 shrink-0 overflow-hidden rounded-xl bg-linear-to-br", gradient)}
            >
                <div className="absolute inset-0 flex items-center justify-center">

                </div>
            </div>
        </div>
     )
}