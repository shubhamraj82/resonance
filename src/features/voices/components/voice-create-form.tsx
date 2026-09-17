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

function FileDropzone({
    file,
    onFileChange,
    isInvalid,
}:{
    file:File | null;
    onFileChange:(file:File | null)=>void;
    isInvalid?:boolean;
}){
    const {isPlaying,togglePlay}=useAudioPlayback(file);
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject,
    }=useDropzone({
        accept:{"audio/*":[]},
        maxSize:20*1024*1024,
        multiple:false,
        onDrop:(acceptedFiles)=>{
            if(acceptedFiles.length>0){
                onFileChange(acceptedFiles[0]);
            }
        }
    })

    
}

function LanguageCombobox({
  value,
  onChange,
  isInvalid,
}: {
  value: string;
  onChange: (value: string) => void;
  isInvalid?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const selectedLabel =
    LANGUAGE_OPTION.find((l) => l.value === value)?.label ?? "";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={isInvalid}
          className={cn(
            "h-9 w-full justify-between font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <div className="flex items-center gap-2 truncate">
            <Globe className="size-4 shrink-0 text-muted-foreground" />

            {value
              ? selectedLabel
              : "Select a language..."}
          </div>

          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[300px] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search language..." />

          <CommandList className="max-h-[300px]">
            <CommandEmpty>
              No language found.
            </CommandEmpty>

            <CommandGroup>
              {LANGUAGE_OPTION.map((lang) => (
                <CommandItem
                  key={lang.value}
                  value={lang.label}
                  onSelect={() => {
                    onChange(lang.value);
                    setOpen(false);
                  }}
                >
                  {lang.label}

                  <Check
                    className={cn(
                      "ml-auto size-4",
                      value === lang.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
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

                <form.Field name="name">
                    {(field)=>{
                        const IsInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                        return (
                            <Field data-invalid={IsInvalid}>
                                <div className="relative flex items-center">
                                    <div className="pointer-events-none absolute left-0 flex h-full w-11 items-center justify-center">
                                        <Tag className="size-4 text-muted-foreground"/>
                                    </div>
                                    <Input
                                    id={field.name}
                                    placeholder="Voice Label"
                                    arial-invalid={IsInvalid}
                                    value={field.state.value}
                                    onChange={(e)=>field.handleChange(e.target.value)}
                                    onBlur={field.handleBlur}
                                    className="pl-10"
                                    />
                                </div>
                                {IsInvalid && <FieldError errors={field.state.meta.errors} />}
                            </Field>
                        )
                    }}
                </form.Field>

              <form.Field name="category">
  {(field) => {
    const isInvalid =
      field.state.meta.isTouched &&
      !field.state.meta.isValid;

    return (
      <Field data-invalid={isInvalid}>
        <div className="relative flex items-center">
          
          {/* Icon */}
          <div className="pointer-events-none absolute left-0 flex h-full w-11 items-center justify-center z-10">
            <Layers className="size-4 text-muted-foreground" />
          </div>

          {/* Category Combobox */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={false}
                aria-invalid={isInvalid}
                className="h-9 w-full justify-between pl-10 font-normal"
              >
                <div className="flex items-center gap-2 truncate">
                  {field.state.value
                    ? VOICE_CATEGORY_LABELS[
                        field.state.value as keyof typeof VOICE_CATEGORY_LABELS
                      ]
                    : "Select a category..."}
                </div>

                <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              className="w-[300px] p-0"
              align="start"
            >
              <Command>
                <CommandInput placeholder="Search category..." />

                <CommandList className="max-h-[300px]">
                  <CommandEmpty>
                    No category found.
                  </CommandEmpty>

                  <CommandGroup>
                    {VOICE_CATEGORIES.map((cat) => (
                      <CommandItem
                        key={cat}
                        value={VOICE_CATEGORY_LABELS[cat]}
                        onSelect={() => {
                          field.handleChange(cat);
                        }}
                      >
                        {VOICE_CATEGORY_LABELS[cat]}

                        <Check
                          className={cn(
                            "ml-auto size-4",
                            field.state.value === cat
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {isInvalid && (
          <FieldError errors={field.state.meta.errors} />
        )}
      </Field>
    );
  }}
</form.Field> 

                    <form.Field name="language">
                        {(field)=>{
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                            return (
                                <Field data-invalid={isInvalid}>
                                    <LanguageCombobox
                                    value={field.state.value}
                                    onChange={field.handleChange}
                                    isInvalid={isInvalid}
                                    />
                                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                </Field>
                            )
                        }}
                    </form.Field>

                       <form.Field name="description">
                    {(field)=>{
                        const IsInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                        return (
                            <Field data-invalid={IsInvalid}>
                                <div className="relative flex items-center">
                                    <div className="pointer-events-none absolute left-0 flex h-full w-11 items-center justify-center">
                                        <AlignLeft className="size-4 text-muted-foreground"/>
                                    </div>
                                    <Textarea
                                    id={field.name}
                                    placeholder="Describe this voice...."
                                    arial-invalid={IsInvalid}
                                    value={field.state.value}
                                    onChange={(e)=>field.handleChange(e.target.value)}
                                    onBlur={field.handleBlur}
                                    className="min-h-20 pl-10"
                                    rows={3}
                                    />
                                </div>
                                {IsInvalid && <FieldError errors={field.state.meta.errors} />}
                            </Field>

                        )
                    }}
                </form.Field>   

                <form.Subscribe
                selector={(s)=>({
                    isSubmitting:s.isSubmitting,
                })}
                >
                    {({isSubmitting}) => {
                        const submitButton= (
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Creating..." : "Create Voice"}
                            </Button>
                        );
                        return footer ? footer(submitButton) : submitButton;
                    }}
                    
                    </form.Subscribe>          
            </div>
        </form>
    )
}


