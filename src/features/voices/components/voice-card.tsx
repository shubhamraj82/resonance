import Link from "next/link";
import {Mic,MoreHorizontal,Pause,Play} from "lucide-react";
import {Button} from "@/components/ui/button";
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Spinner} from "@/components/ui/spinner";
import { VoiceAvatar } from "@/components/voice-avatar/voice-avatar";
import type {inferRouterOutputs} from "@trpc/server";
import type {AppRouter} from "@/trpc/routers/_app";
import { VOICE_CATEGORY_LABELS } from "../data/voice-categories";

export type VoiceItem = inferRouterOutputs<AppRouter>["voices"]["getAll"]["custom"][number];

interface VoiceCardsProps{
    voice:VoiceItem;
}
const regionNames=new Intl.DisplayNames(["en"],{type:"region"});

function parseLanguage(locale:string){
    const [,country]=locale.split("-");
    if(!country) return {flag:"",region:locale};

    const flag=[...country.toUpperCase()]
    .map((c)=> String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");

    const region = regionNames.of(country) ?? country;
    return {flag,region};
};

export function VoiceCard({voice}:VoiceCardsProps){
    const isLoading=false;
    const isPlaying=false;
    const {flag,region}=parseLanguage(voice.language);
    const audioSrc=`/api/voices/${encodeURIComponent(voice.id)}`;

return (
    <div className="flex items-center gap-1 overflow-hidden rounded-xl border pr-3 lg:pr-6">
        <div className="relative h-24 w-20 shrink-0 lg:h-30 lg:w-24">
            <div className="absolute left-0 top-0 h-24 w-10 border-r bg-muted/50 lg:h-30 lg:w-12"/>

            <div className="absolute inset-0 flex items-center justify-center">
                <VoiceAvatar
                seed={voice.id}
                name={voice.name}
                className="size-14 border-[1.5px] border-white shadow-xs lg:size-18"
                />
            </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5 lg:gap-3">
            <div className="flex items-center gap-1.5 line-clamp-1 text-sm font-medium tracking-tight">
                {voice.name}
                <span className="size-1 shrink-0 rounded-full bg-muted-foreground/50"/>
                <span className="text-[#327c88]">
                    {VOICE_CATEGORY_LABELS[voice.category]}
                </span>
            </div>
            <p className="line-clamp-1 text-xs text-muted-foreground">
                {voice.description}
            </p>

            <p className="flex items-center gap-1 text-xs">
                <span className="shrink-0">{flag}</span>
                <span className="truncate font-medium">{region}</span>
            </p>
        </div>
        <div className="ml-1 flex shrink-0 items-center gap-1 lg:ml-3 lg:gap-2">
            <Button
            variant="outline"
            size="icon-sm"
            className="rounded-full"
            onClick={()=>{}}
            disabled={isLoading}
            >
                {isLoading ? (
                    <Spinner className="size-4"/>
                ): isPlaying ? (
                        <Pause className="size-4"/>
                    ):(
                        <Play className="size-4"/>
                    )}
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button 
                    variant="outline"
                    size="icon-sm"
                    className="rounded-full"
                    >
                        <MoreHorizontal className="size-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-auto min-w-[140px]">
    <DropdownMenuItem asChild className="p-0">
        <Link
            href={`/text-to-speech?voiceId=${voice.id}`}
            className="flex w-full flex-row items-center gap-2 px-3 py-2 whitespace-nowrap"
        >
            <Mic className="size-3.5 shrink-0" />
            <span className="text-xs font-medium">
                Use this voice
            </span>
        </Link>
    </DropdownMenuItem>
</DropdownMenuContent>
            </DropdownMenu>
        </div>
    </div>
)}