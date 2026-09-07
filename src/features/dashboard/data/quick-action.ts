export interface QuickAction {
    title: string;
    description: string;
    gradient: string;
    href: string;
};

export const quickActions:QuickAction[] = [
    {
        title:"Narrate a Story",
        description:"Bring characters to life with our text-to-speech feature. Perfect for storytelling, audiobooks, and more.",
        gradient:"from-cyan-400 to-cyan-50",
        href:"/text-to-speech?=In a world where technology meets imagination, our text-to-speech feature brings stories to life. Perfect for storytellers, educators, and anyone who loves to listen."
    },
    {
        title:"Record an Ad",
        description:"Create compelling audio ads with our text-to-speech feature. Ideal for marketers, advertisers, and content creators.",
        gradient:"from-purple-500 to-purple-100",
        href:"/text-to-speech?=Step into the future of advertising with our text-to-speech feature. Create compelling audio ads that captivate your audience. Perfect for marketers, advertisers, and content creators."
    },
    {
        title:"Direct a Movie Scene",
        description:"Transform your scripts into cinematic audio experiences. Ideal for filmmakers, screenwriters, and voice actors.",
        gradient:"from-pink-500 to-pink-100",
        href:"/text-to-speech?=Lights, camera, action! Our text-to-speech feature allows you to transform your scripts into cinematic audio experiences. Perfect for filmmakers, screenwriters, and voice actors."
    },
    {
        title:"Voice a Game Character",
        description:"Give your game characters a unique voice. Ideal for game developers, modders, and interactive storytellers.",
        gradient:"from-orange-500 to-orange-100",
        href:"/text-to-speech?=Step into the world of gaming with our text-to-speech feature. Give your characters a unique voice and bring your game to life. Perfect for game developers, modders, and interactive storytellers."
    },
    {
        title:"Create a Podcast",
        description:"Transform your scripts into engaging audio content. Ideal for podcasters, content creators, and audio enthusiasts.",
        gradient:"from-blue-500 to-blue-100",
        href:"/text-to-speech?=Welcome to the future of podcasting! Our text-to-speech feature allows you to effortlessly convert your scripts into captivating audio content. Perfect for podcasters, content creators, and anyone looking to share their voice with the world."
    },
    {
        title:"Guide a Meditation",
        description:"Create a serene experience with our text-to-speech feature. Ideal for meditation guides, relaxation scripts, and mindfulness exercises.",
        gradient:"from-lime-400 to-lime-100",
        href:"/text-to-speech?=Close your eyes, take a deep breath, and let the soothing sounds of our text-to-speech feature guide you into a state of relaxation. Perfect for meditation, mindfulness, and stress relief."
    },

]