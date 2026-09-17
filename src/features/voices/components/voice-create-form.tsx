"use client"

import {useState} from "react";
import {z} from "zod";
import {toast} from "@/components/ui/toast";
import {useForm} from "@tanstack/react-form";
import {useDropzone} from "react-dropzone";
import {useMutation,useQueryClient} from "@tanstack/react-query";
import {
    AudioLines,
    FolderOpen,
    X,
    FileAudio,
    Upload,
    Mic,
    Tag,
    Play,
    Pause,
    Check,
    ChevronsUpDown,
    Globe,
    Layers,
    AlignLeft,
} from "lucide-react"
import locales from "locale-codes"
import { cn,formatFileSize } from "@/lib/utils";
import {useAudioPlayback} from "@/hooks/use-audio-playback";
import { useTRPC } from "@/trpc/client";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Field,FieldError} from "@/components/ui/field";
import {Tabs,TabsList,TabsTrigger,TabsContent} from "@/components/ui/tabs";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    VOICE_CATEGORIES,
    VOICE_CATEGORY_LABELS,
} from "@/features/voices/data/voice-categories"

const LANGUAGE_OPTION=locales.all
.filter((l)=> l.tag && l.tag.includes("-") && l.name)
.map((l)=> ({
    value:l.tag,
    label:l.location ? `${l.name} (${l.location})` : l.name,
}));

const voiceCreateFormSchema=z.object({
    name:z.string().min(1,"Voice name is required"),
    file:z
    .instanceof(File,{message:"An audio file is required"})
    .nullable()
    .refine((f)=> f!==null, "An audio file is required"),
    category:z.string().min(1,"Category is required"),
    language:z.string().min(1,"Language is required"),
    description:z.string(),
});

interface VoiceCreateFormProps{
    scrollable?:boolean;
    footer?:(submit:React.ReactNode) => React.ReactNode;
    onError?:(message:string)=>void;
};

export function VoiceCreateForm({
    scrollable,
    footer,
    onError,
}:VoiceCreateFormProps){
    const trpc=useTRPC();
    const queryClient=useQueryClient();
    const createMutation = useMutation({
        mutationFn: async({
            name,
            file,
            category,
            language,
            description,
        }:{
            name:string;
            file:File;
            category:string;
            language:string;
            description?:string;
        })=>{
            const params = new URLSearchParams({
                name,
                category,
                language,
            });
            if(description){
                params.set("description",description);
            }

            const response = await fetch(`/api/voices/create?${params.toString()}`,{
                method:"POST",
                headers:{"Content-Type":file.type},
                body:file,
            });
            if(!response.ok){
                const body=await response.json();
                throw new Error(body.error ?? "Failed to create voice");
            }

            return response.json();
        },
    });

    const form = useForm({
        defaultValues:{
            name:"",
            file:null as File | null,
            category:"GENERAL" as string,
            language:"en-US",
            description:"",
        },
        validators:{
            onSubmit: voiceCreateFormSchema,
        },
        onSubmit: async ({value}) => {
            try{
                await createMutation.mutateAsync({
                    name:value.name,
                    file:value.file!,
                    category:value.category,
                    language:value.language,
                    description:value.description || undefined,
                });
                toast.add({
                    title:"Voice created",
                    description:"Your custom voice has been created successfully",
                });
                queryClient.invalidateQueries({
                    queryKey:trpc.voices.getAll.queryKey(),
                });
                form.reset();
            }catch(error){
                const message=error instanceof Error ? error.message : "Failed to create voice";
                if(onError){
                    onError(message);
                }else{
                    toast.add({
                        title:"Error",
                        description:message,
                    });
                }
            }
        }
    })

    return (
        <form
        onSubmit={(e)=>{
            e.preventDefault();
            form.handleSubmit();
        }}
        className={cn("flex flex-col", scrollable ? "min-h-0 flex-1": "gap-6")}
        >
            <div className={cn(scrollable ? "no-scrollbar flex flex-col gap-6 overflow-y-auto px-4":"flex flex-col gap-6",)}>
                <form.Field name="file">
                    {(field)=>{
                        const IsInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                        return (
                            <Field data-invalid={IsInvalid} >
                                <Tabs defaultValue="upload">
                                    <TabsList className="h-11! w-full">
                                        <TabsTrigger value="upload">
                                            <Upload className="size-3.5"/>
                                            Upload
                                        </TabsTrigger>
                                        <TabsTrigger value="record" disabled>
                                            <Mic className="size-3.5"/>
                                            Record
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="upload">
                                        <p>TODO:File upload</p>
                                    </TabsContent>
                                </Tabs>
                                {IsInvalid && <FieldError errors={field.state.meta.errors} />}
                            </Field>
                        )
                    }}
                </form.Field>

                
            </div>
        </form>
    )
}


