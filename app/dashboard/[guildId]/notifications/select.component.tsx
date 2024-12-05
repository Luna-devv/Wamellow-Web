import { PopoverClose } from "@radix-ui/react-popover";
import React, { useEffect, useState } from "react";
import { BsTwitch, BsYoutube } from "react-icons/bs";
import { FaBluesky } from "react-icons/fa6";

import { badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { type ApiV1GuildsModulesNotificationsGetResponse, NotificationType } from "@/typings";
import { cn } from "@/utils/cn";

import { BlueskyNotificationModal } from "./create-bluesky.component";
import { TwitchNotificationModal } from "./create-twitch.component";
import { YoutubeNotificationModal } from "./create-youtube.component";

export const Style = {
    Compact: 1,
    Big: 2
} as const;

const Platform = {
    YouTube: 0,
    Twitch: 1,
    Bluesky: 2
} as const;

interface Props {
    style: typeof Style[keyof typeof Style];
    add: (notification: ApiV1GuildsModulesNotificationsGetResponse) => void;
    set: (id: string) => void;
}

export function CreateNotificationSelect({
    style,
    add,
    set
}: Props) {
    const [isMobile, setIsMobile] = useState(false);
    const [platform, setPlatform] = useState<typeof Platform[keyof typeof Platform] | null>(null);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 768px)"); // Adjust breakpoint as needed
        const handleMediaChange = () => setIsMobile(mediaQuery.matches);

        handleMediaChange(); // Check initial value
        mediaQuery.addEventListener("change", handleMediaChange);

        return () => mediaQuery.removeEventListener("change", handleMediaChange);
    }, []);

    const Wrapper = isMobile ? DrawerWrapper : PopoverWrapper;

    return (<>
        <Wrapper
            button={
                <Button
                    className={style === Style.Compact ? cn(badgeVariants(), "h-6") : ""}
                    variant="secondary"
                >
                    Create new Notification
                </Button>
            }
            style={style}
        >
            {(platform) => (
                <Button
                    className="w-full"
                    onClick={() => setPlatform(platform)}
                >
                    <Icon type={platform} className="text-white" />
                    {Object.keys(Platform)[platform]}
                </Button>
            )}
        </Wrapper>

        <YoutubeNotificationModal add={add} set={set} isOpen={platform === Platform.YouTube} onClose={() => setPlatform(null)} />
        <TwitchNotificationModal add={add} set={set} isOpen={platform === Platform.Twitch} onClose={() => setPlatform(null)} />
        <BlueskyNotificationModal add={add} set={set} isOpen={platform === Platform.Bluesky} onClose={() => setPlatform(null)} />
    </>);
}

function PopoverWrapper({
    children,
    button,
    style
}: {
    children: (platform: typeof Platform[keyof typeof Platform]) => React.ReactNode;
    button: React.ReactNode;
    style: typeof Style[keyof typeof Style];
}) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                {button}
            </PopoverTrigger>
            <PopoverContent
                className="space-y-2 wamellow-modal"
                align={style === Style.Compact ? "start" : "center"}
            >
                <div className="space-y-2 mb-2">
                    <h4 className="font-medium leading-none">Platform</h4>
                    <p className="text-sm text-muted-foreground">
                        Select a social to create a notify for.
                    </p>
                </div>

                {Object.values(Platform).map((platform) => (
                    <PopoverClose key={platform} asChild>
                        {children(platform)}
                    </PopoverClose>
                ))}
            </PopoverContent>
        </Popover>
    );
}

function DrawerWrapper({
    children,
    button
}: {
    children: (platform: typeof Platform[keyof typeof Platform]) => React.ReactNode;
    button: React.ReactNode;
    style: typeof Style[keyof typeof Style];
}) {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                {button}
            </DrawerTrigger>
            <DrawerContent className="space-y-2 wamellow-modal">
                <DrawerHeader>
                    <DrawerTitle>Platform</DrawerTitle>
                    <DrawerDescription>Select a platform to create notifications for.</DrawerDescription>
                </DrawerHeader>

                {Object.values(Platform).map((platform) => (
                    <DrawerClose key={platform} asChild>
                        {children(platform)}
                    </DrawerClose>
                ))}
            </DrawerContent>
        </Drawer>
    );
}

export function Icon({
    type,
    className
}: {
    type: NotificationType;
    className?: string;
}) {
    switch (type) {
        case NotificationType.YouTube: return <BsYoutube className={cn("text-red-500", className)} />;
        case NotificationType.Twitch: return <BsTwitch className={cn("text-violet-500", className)} />;
        case NotificationType.Bluesky: return <FaBluesky className={cn("text-blue-500", className)} />;
    }
}