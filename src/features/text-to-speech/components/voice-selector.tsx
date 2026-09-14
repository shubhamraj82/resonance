"use client"

import {useStore} from "@tanstack/react-form"
import {VOICE_CATEGORY_LABELS} from "@/features/voices/data/voice-categories"
import {Field,FieldLabel} from "@/components/ui/field"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useTypedAppFormContext } from "@/hooks/use-app-form"
import {VoiceAvatar} from "@/components/voice-avatar/voice-avatar"
import {useTTSVoices} from "../context/tts-voices-context"
import { ttsFormOptions} from "./text-to-speech-form"

export function VoiceSelector(){
    const {
        customVoices,
        systemVoices,
        allVoices:voices,
    } = useTTSVoices();

    const form = useTypedAppFormContext(ttsFormOptions);
    const voiceId=useStore(form.store,(s)=> s.values.voiceId);
    const isSubmitting=useStore(form.store,(s)=> s.isSubmitting);

    const selectedVoice=voices.find((v)=> v.id===voiceId);
    const hasMissingSelectedVoice=Boolean(voiceId && !selectedVoice);
    const currentVoice=selectedVoice ? selectedVoice : hasMissingSelectedVoice ? {
        id:voiceId,
        name:"unavailable voice",
        category:null as null, 
    }
    : voices[0];

    return (
        <Field>
            <FieldLabel>Voice style</FieldLabel>
            <Select
            value={voiceId}
            onValueChange={(v)=> form.setFieldValue("voiceId", v ?? "")}
            disabled={isSubmitting}
            >
                <SelectTrigger
                className="h-auto w-full gap-2 rounded-lg border-border/70 bg-muted/30 px-3 py-2 shadow-xs hover:bg-muted/50"
                >
                    <SelectValue>
                        {currentVoice.name && (
                            <>
                            <VoiceAvatar 
                            seed={currentVoice.id}
                            name={currentVoice.name}
                            className="size-5"
                            />
                            <span className="truncate text-sm font-semibold tracking-tight">
                                {currentVoice.name}{" "}
                                {currentVoice.category && 
                                    ` - ${VOICE_CATEGORY_LABELS[currentVoice.category]}`
                            }
                            </span>
                            </>
                        )}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {hasMissingSelectedVoice && currentVoice &&  (
                        <>
                        <SelectGroup>
                            <SelectLabel>Selected Voice</SelectLabel>
                            <SelectItem value={currentVoice.id}>
                                <VoiceAvatar
                                seed={currentVoice.id}
                                name={currentVoice.name}
                                />
                                <span className="truncate text-sm font-medium tracking-tight">
                                {currentVoice.name}{" "}
                                {currentVoice.category && 
                                    ` - ${VOICE_CATEGORY_LABELS[currentVoice.category]}`
                            }
                            </span>
                            </SelectItem>
                        </SelectGroup>
                        {(customVoices.length>0 || systemVoices.length>0) && (<SelectSeparator />)}
                        </>
                    )}
                    {customVoices.length>0 && (
                        <SelectGroup>
                            <SelectLabel>Team Voices</SelectLabel>
                            {customVoices.map((v)=>(
                                <SelectItem key={v.id} value={v.id}>
                                    <VoiceAvatar
                                    seed={v.id}
                                    name={v.name}
                                    />
                                    <span className="truncate text-sm font-medium tracking-tight">
                                {currentVoice.name}
                                {v.name} - {VOICE_CATEGORY_LABELS[v.category]}
                            </span>
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    )}
                    {systemVoices.length>0 && systemVoices.length>0 && (<SelectSeparator />)}
                     {systemVoices.length>0 && (
                        <SelectGroup>
                            <SelectLabel>Built-in Voices</SelectLabel>
                            {systemVoices.map((v)=>(
                                <SelectItem key={v.id} value={v.id}>
                                    <VoiceAvatar
                                    seed={v.id}
                                    name={v.name}
                                    />
                                    <span className="truncate text-sm font-medium tracking-tight">
                                {currentVoice.name}
                                {v.name} - {VOICE_CATEGORY_LABELS[v.category]}
                            </span>
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    )}
                </SelectContent>
            </Select>
        </Field>
    )
}
