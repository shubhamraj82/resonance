import {History,Settings} from "lucide-react";
import {
Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs";
import {SettingsPanelHistory} from "@/features/text-to-speech/components/settings-panel-history";
import {SettingsPanelSettings} from "@/features/text-to-speech/components/settings-panel-settings";

const tabsTriggerClassName="m-1 h-10 flex-1 gap-2 rounded-md border! border-transparent! bg-transparent shadow-none transition-[background-color,border-color,box-shadow,transform] data-active:border-zinc-400! data-active:bg-zinc-50 data-active:shadow-[inset_1px_1px_0_rgba(255,255,255,1),inset_-1px_-1px_0_rgba(0,0,0,0.14),0_2px_5px_rgba(15,23,42,0.16)] data-active:[transform:translateY(-1px)] group data-[variant=default]/tabs-list:data-active:shadow-[inset_1px_1px_0_rgba(255,255,255,1),inset_-1px_-1px_0_rgba(0,0,0,0.14),0_2px_5px_rgba(15,23,42,0.16)]"

export function SettingsPanel(){
    return (
        <div className="hidden w-105 min-h-0 flex-col border-l lg:flex">
           <Tabs
           defaultValue="settings"
           className="flex h-full min-h-0 flex-col gap-y-0"
           >
            <TabsList className="w-full bg-transparent rounded-none border-b h-12 group-data-[orientation=horizontal]/tabs:h-12 p-0">
                <TabsTrigger value="settings" className={tabsTriggerClassName}>
                    <Settings className="size-4"/>
                    Settings
                </TabsTrigger>
                <TabsTrigger value="History" className={tabsTriggerClassName}>
                    <History className="size-4"/>
                    History
                </TabsTrigger>
            </TabsList>
            <TabsContent 
            value="settings"
            className="mt-0 flex min-h-0 flex-1 flex-col overflow-y-auto"
            >
                <SettingsPanelSettings/>
            </TabsContent>
            <TabsContent
            value="History"
            className="mt-0 flex min-h-0 flex-1 flex-col overflow-y-auto"
            >
                <SettingsPanelHistory/>
            </TabsContent>
           </Tabs>
        </div>
    )
}
