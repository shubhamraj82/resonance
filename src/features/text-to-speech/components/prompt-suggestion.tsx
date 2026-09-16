"use client"

import {
    BookOpen,
    Smile,
    Mic,
    Languages,
    Clapperboard,
    Gamepad2,
    Podcast,
    Brain
} from "lucide-react";
import type {LucideIcon} from "lucide-react";
import {Badge} from "@/components/ui/badge"; 

const PROMPT_SUGGESTIONS:{
    label:string;
    prompt:string;
    icon:LucideIcon;
}[]=[
    {
        label:"Narrate a story",
        prompt:"In a village tucked between mist-covered mountains, there lived an old storyteller named Elara. She had a magical ability to bring her tales to life, captivating the hearts of all who listened. One evening, as the sun dipped below the horizon, Elara began to weave a story about a brave young girl who embarked on a quest to find a hidden treasure that could save her village from an impending drought. The villagers gathered around, their eyes wide with anticipation, as Elara's voice painted vivid images of enchanted forests, talking animals, and ancient riddles. As the story unfolded, the listeners felt as if they were part of the adventure, their imaginations ignited by Elara's enchanting narration.",
        icon:BookOpen
    },
    {
        label:"Add a warm greeting",
        prompt:"Hello and welcome. I am so glad you are here today. Take a deep breath, settle in, and get ready for a calm, clear, and uplifting listening experience designed to help you feel focused and inspired.",
        icon:Smile
    },
    {
        label:"Record a voiceover",
        prompt:"Introducing a smarter way to bring your ideas to life. With natural pacing, expressive delivery, and polished narration, your message can sound clear, confident, and ready for any audience.",
        icon:Mic
    },
    {
        label:"Translate an announcement",
        prompt:"Attention everyone. The session will begin shortly. Please find your seat, silence your phone, and keep your materials ready. Thank you for your patience and cooperation.",
        icon:Languages
    },
    {
        label:"Create a trailer intro",
        prompt:"In a world where every choice echoes through time, one unlikely hero must uncover the truth before the final secret disappears forever. This summer, courage has a new voice.",
        icon:Clapperboard
    },
    {
        label:"Guide a game quest",
        prompt:"Your journey begins at the edge of the forgotten ruins. Collect the glowing crystal, avoid the shadow guards, and unlock the ancient gate before the countdown reaches zero.",
        icon:Gamepad2
    },
    {
        label:"Start a podcast",
        prompt:"Welcome back to the show. Today we are exploring the small decisions that shape creative work, why momentum matters more than motivation, and how to build habits that actually last.",
        icon:Podcast
    },
    {
        label:"Explain a big idea",
        prompt:"Artificial intelligence can feel complex at first, but the core idea is simple. A model learns patterns from examples, then uses those patterns to make predictions, generate text, or help solve problems.",
        icon:Brain
    }
];

export function PromptSuggestions({
    onSelect,
}:{
    onSelect:(prompt:string)=>void;
}){
    return (
        <div className="space-y-2.5">
            <p className="text-sm text-muted-foreground">Get started with</p>
            <div className="flex flex-wrap gap-2">
                {PROMPT_SUGGESTIONS.map((suggestion)=>(
                    <Badge
                    key={suggestion.label}
                    variant="outline"
                    className="cursor-pointer gap-1.5 py-1 px-2.5 text-xs hover:bg-accent rounded-md"
                    onClick={()=>onSelect(suggestion.prompt)}
                    >
                        <suggestion.icon className="size-3.5 shrink-0"/>
                        {suggestion.label}
                    </Badge>
                ))}
            </div>
        </div>
    )
}
