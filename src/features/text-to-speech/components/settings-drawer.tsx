import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/components/ui/drawer";

interface SettingsDrawerProps{
    open?:boolean;
    onOpenChange?:(open:boolean)=>void;
    children?:React.ReactNode;
}

import { SettingsPanelSettings
 } from "./settings-panel-settings";

 export function SettingsDrawer({open, onOpenChange, children}:SettingsDrawerProps){
    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            {children ?? (
                <DrawerTrigger render={<Button variant="outline" size="sm" />}>
                <Settings className="size-4"/>
                <span className="sr-only">Open history</span>
            </DrawerTrigger>
            )}
            
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Settings</DrawerTitle>
                </DrawerHeader>
                <div className="overflow-y-auto">
                    <SettingsPanelSettings />
                </div>
            </DrawerContent>
        </Drawer>
    )
 }
