import { TextToSpeechView } from "@/features/text-to-speech/views/text-to-speech-view";
import type {Metadata} from "next";
import {trpc , HydrateClient, getQueryClient} from "@/trpc/server"

export const metadata:Metadata = { title : "Text to speech" }

export default async function TextToSpeechPage({searchParams,}:{
    searchParams: Promise<{text?:string; voiceId?: string}>;
}){
    const {text,voiceId}=await searchParams;
    await getQueryClient().prefetchQuery(trpc.voices.getAll.queryOptions());

    return (
        <HydrateClient>
        <TextToSpeechView initialValues={{text, voiceId}}/>
        </HydrateClient>
    )
}
