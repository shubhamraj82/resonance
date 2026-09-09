import { TextToSpeechView } from "@/features/text-to-speech/views/text-to-speech-view";
import type {Metadata} from "next";

export const metadata:Metadata = { title : "Text to speech" }

export default function TextToSpeechPage(){
    return (
        <TextToSpeechView/>
    )
}