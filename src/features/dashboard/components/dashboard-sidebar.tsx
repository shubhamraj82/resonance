"use client"

import Image from "next/image";
import {usePathname} from "next/navigation";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarRail,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import {Skeleton} from "@/components/ui/skeleton";
import {
    OrganizationSwitcher,
    UserButton,
    useClerk
} from "@clerk/nextjs";
import {
    type LucideIcon,
    Home,
    LayoutGrid,
    AudioLines,
    Settings,
    Headphones,
    Volume2,
} from "lucide-react";
import Link from "next/link";

interface MenuItem {
    title:string;
    url?:string;
    icon:LucideIcon;
    onClick?:()=>void;
}

interface NavSectionProps{
    label?:string;
    items:MenuItem[];
    pathname:string;
}

function NavSection({label,items,pathname}:NavSectionProps){
return (
    <SidebarGroup className="p-2">
        {label && (
            <SidebarGroupLabel className="text-[13px] uppercase text-muted-foreground">
                {label}
            </SidebarGroupLabel>
        )}
        <SidebarGroupContent>
            <SidebarMenu>
                {items.map((item)=>(
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                        className="h-9 rounded-md border border-transparent px-3 py-2 text-[13px] font-medium tracking-tight transition-[background-color,border-color,box-shadow,transform] data-active:border-zinc-400 data-active:bg-zinc-50 data-active:shadow-[inset_1px_1px_0_rgba(255,255,255,1),inset_-1px_-1px_0_rgba(0,0,0,0.14),0_2px_5px_rgba(15,23,42,0.16)] data-active:[transform:translateY(-1px)] [&_svg]:size-3"
                        
                        render={item.url ? <Link href={item.url} /> : undefined}
                        isActive={
                            item.url
                            ? item.url === "/"
                            ? pathname === "/"
                            : pathname.startsWith(item.url)
                            : false
                        }
                        onClick={item.onClick}
                        tooltip={item.title}
                        >
                            <item.icon />
                            <span>{item.title}</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroupContent>
    </SidebarGroup>
)
}

export function DashboardSidebar(){
    const pathname = usePathname();
    const clerk = useClerk();

    const mainMennuItems:MenuItem[]=[
        {
            title:"Dashboard",
            url:"/",
            icon:Home,
        },
        {
            title:"Explore voices",
            url:"/voices",
            icon:LayoutGrid,
        },
        {
            title:"Text to speech",
            url:"/text-to-speech",
            icon:AudioLines,
        },
        {
            title:"Voice cloning",
            icon:Volume2,
        }
    ];

    const otherMenuItems:MenuItem[]=[
        {
            title:"Settings",
            icon:Settings,
            onClick:()=>clerk.openOrganizationProfile(),
        },
        {
            title:"Help and support",
            url:"mailto:raj.shubh8216@gmail.com",
            icon:Headphones,
        }
    ];

    return (
        <Sidebar collapsible="icon" className="border-r border-sidebar-border">
            <SidebarHeader className="flex flex-col gap-2 px-2 py-2">
                <div
                className="flex items-center gap-2 pl-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:pl-0">
                    <Image
                    src="/logo.svg"
                    alt="Resonance logo"
                    width={14}
                    height={14}
                    className="rounded-sm"
                    />
                    <span className="font-semibold text-[10px] tracking-tight text-foreground group-data-[collapsible=icon]:hidden">
                        Resonance
                    </span>
                    <SidebarTrigger className="ml-auto size-6 lg:hidden"/>
                </div>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <OrganizationSwitcher
                        hidePersonal
                        fallback={
                            <Skeleton
                            className="h-8.5 w-full group-data-[collapsible=icon]:size-8 rounded-md border  bg-white"
                            />
                        }
                        appearance={{
                            elements:{
                                rootBox:
                                "!w-full group-data-[collapsible=icon]:!w-auto group-data-[collapsible=icon]:!flex group-data-[collapsible=icon]:!justify-center",
                                organizationSwitcherTrigger:
                                "!w-full !justify-between !bg-white !border !border-border !rounded-md !pl-1 !pr-2 !py-1 !gap-3 group-data-[collapsible=icon]:!w-auto group-data-[collapsible=icon]:!p-1",
                                organizationPreview:"!gap-2",
                                organizationPreviewAvatarBox:"!size-6 !rounded-sm",
                                organizationPreviewTextContainer:"!text-xs !tracking-tight !font-medium !text-foreground group-data-[collapsible=icon]:!hidden",
                                organizationPreviewIdentifier:"!text-[13px]",
                                organizationSwitcherTriggerIcon:"!size-4 !text-sidebar-foreground group-data-[collapsible=icon]:!hidden",
                            }
                        }}
                        />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <div className="border-b border-dashed border-border"/>
            <SidebarContent className="p-0">
                <NavSection items={mainMennuItems} pathname={pathname}/>
                <NavSection 
                label="Others"
                items={otherMenuItems}
                pathname={pathname}
                />
            </SidebarContent>
            <div className="border-b border-dashed border-border"/>
            <SidebarFooter className="gap-3 py-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <UserButton
                        showName
                        fallback={
                            <Skeleton
                            className="h-8.5 w-full group-data-[collapsible=icon]:size-8 rounded-md border border-border bg-white"
                            />
                        }
                        appearance={{
                            elements:{
                                rootBox:
                                "w-ful! group-data-[collapsible=icon]:w-auto! group-data-[collapsible=icon]:flex! group-data-[collapsible=icon]:justify-center!",
                                userButtonTrigger:
                                "w-full! justify-between! bg-white! border! border-border! rounded-md! pl-1! pr-2! py-1! shadow-[0px_1px_1.5px_0px_rgba(44,54,53,0.03)]! group-data-[collapsible=icon]:w-auto! group-data-[collapsible=icon]:p-1! group-data-[collapsible=icon]:after:hidden!",
                                userButtonBox:"flex-row-reverse! gap-2!",
                                userButtonOuterIdentifier:
                                "text-[13px]! tracking-tight! font-medium! text-foreground! pl-0!  group-data-[collapsible=icon]:hidden!",
                                userButtonOuterAvatarBox:"size-6!"
                                
                            }
                        }}
                        />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
