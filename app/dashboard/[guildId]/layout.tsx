"use client";

import { Button, Skeleton } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { redirect, useParams, usePathname } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { Suspense, useEffect, useMemo, useState } from "react";
import { BiLogoYoutube } from "react-icons/bi";
import { HiArrowNarrowLeft, HiChartBar, HiCode, HiCursorClick, HiEye, HiHome, HiPaperAirplane, HiShare, HiStar, HiUserAdd, HiUsers, HiViewGridAdd } from "react-icons/hi";
import { useQuery } from "react-query";

import { guildStore } from "@/common/guilds";
import { ClientButton } from "@/components/client";
import { CopyToClipboardButton } from "@/components/copy-to-clipboard";
import ImageReduceMotion from "@/components/image-reduce-motion";
import { ListTab } from "@/components/list";
import { ScreenMessage, SupportButton } from "@/components/screen-message";
import { cacheOptions, getData } from "@/lib/api";
import SadWumpusPic from "@/public/sad-wumpus.gif";
import { ApiV1GuildsChannelsGetResponse, ApiV1GuildsEmojisGetResponse, ApiV1GuildsGetResponse, ApiV1GuildsRolesGetResponse } from "@/typings";
import { intl } from "@/utils/numbers";
import { getCanonicalUrl } from "@/utils/urls";

function useGuildData<T extends unknown[]>(
    url: string,
    onLoad: (data: T, error: boolean) => void
) {
    return useQuery(
        url,
        () => getData<T>(url),
        {
            enabled: !!guildStore((g) => g)?.id,
            onSettled: (data) => {
                const isError = !data || "message" in data;
                onLoad(isError ? [] as unknown as T : data, isError);
            },
            ...cacheOptions
        }
    );
}

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    const cookies = useCookies();
    const params = useParams();
    const path = usePathname();

    const [error, setError] = useState<string>();
    const [loaded, setLoaded] = useState<string[]>([]);

    const guild = guildStore((g) => g);

    const session = useMemo(() => cookies.get("session"), [cookies]);
    const isDevMode = useMemo(() => cookies.get("devTools") === "true", [cookies]);

    if (!session) redirect(`/login?callback=/dashboard/${params.guildId}`);

    const url = `/guilds/${params.guildId}` as const;

    const { data, isLoading } = useQuery(
        url,
        () => getData<ApiV1GuildsGetResponse>(url),
        {
            enabled: !!params.guildId,
            ...cacheOptions,
            refetchOnMount: true
        }
    );

    useGuildData<ApiV1GuildsChannelsGetResponse[]>(
        `${url}/channels`,
        (data) => {
            guildStore.setState({ ...guild, channels: data });
            setLoaded((loaded) => [...loaded, "channels"]);
        }
    );

    useGuildData<ApiV1GuildsRolesGetResponse[]>(
        `${url}/roles`,
        (data) => {
            guildStore.setState({ ...guild, roles: data });
            setLoaded((loaded) => [...loaded, "roles"]);
        }
    );

    useGuildData<ApiV1GuildsEmojisGetResponse[]>(
        `${url}/emojis`,
        (data) => {
            guildStore.setState({ ...guild, emojis: data });
            setLoaded((loaded) => [...loaded, "emojis"]);
        }
    );

    useEffect(() => {
        if (data && "message" in data) {
            setError(data?.message);
            return;
        }

        guildStore.setState(data);
    }, [data]);

    return (
        <div className="flex flex-col w-full">
            <title>{`${guild?.name}'s Dashboard`}</title>

            <div className="flex flex-col gap-5 mb-3">
                <div className="flex gap-2">
                    <Button
                        as={Link}
                        className="w-fit"
                        href="/profile"
                        startContent={<HiArrowNarrowLeft />}
                    >
                        Serverlist
                    </Button>
                    {isDevMode &&
                        <CopyToClipboardButton
                            text={getCanonicalUrl("leaderboard", params.guildId?.toString() as string)}
                            items={[
                                { icon: <HiShare />, name: "Copy page url", description: "Creates a link to this specific page", text: getCanonicalUrl(...path.split("/").slice(1)) },
                                { icon: <HiCursorClick />, name: "Copy dash-to url", description: "Creates a dash-to link to the current tab", text: getCanonicalUrl(`dashboard?to=${path.split("/dashboard/")[1].split("/")[1] || "/"}`) }
                            ]}
                            icon={<HiShare />}
                        />
                    }
                </div>

                <div className="text-lg flex gap-5">
                    <Skeleton isLoaded={!isLoading} className="rounded-full h-14 w-14 ring-offset-[var(--background-rgb)] ring-2 ring-offset-2 ring-violet-400/40 shrink-0">
                        <ImageReduceMotion
                            alt="this server"
                            className="rounded-full"
                            url={`https://cdn.discordapp.com/icons/${guild?.id}/${guild?.icon}`}
                            size={128}
                        />
                    </Skeleton>

                    {isLoading ?
                        <div className="mt-1.5">
                            <Skeleton className="rounded-xl w-32 h-6 mb-2" />
                            <Skeleton className="rounded-xl w-10 h-3.5" />
                        </div>
                        :
                        <div className="flex flex-col gap-1">
                            <div className="text-2xl dark:text-neutral-200 text-neutral-800 font-medium">{guild?.name || "Unknown Server"}</div>
                            <div className="text-sm font-semibold flex items-center gap-1"> <HiUsers /> {intl.format(guild?.memberCount || 0)}</div>
                        </div>
                    }

                </div>

            </div>

            <Suspense>
                <ListTab
                    tabs={[
                        {
                            name: "Overview",
                            value: "/",
                            icon: <HiHome />
                        },
                        {
                            name: "Leaderboards",
                            value: "/leaderboards",
                            icon: <HiChartBar />
                        },
                        {
                            name: "Greetings",
                            value: "/greeting",
                            icon: <HiUserAdd />
                        },
                        {
                            name: "Starboard",
                            value: "/starboard",
                            icon: <HiStar />
                        },
                        {
                            name: "Notifications",
                            value: "/notifications",
                            icon: <BiLogoYoutube />
                        },
                        {
                            name: "Dailyposts",
                            value: "/dailyposts",
                            icon: <HiPaperAirplane className="rotate-45" />
                        },
                        {
                            name: "NSFW Moderation",
                            value: "/nsfw-image-scanning",
                            icon: <HiEye />
                        },
                        {
                            name: "Custom Commands",
                            value: "/custom-commands",
                            icon: <HiCode />
                        }
                    ]}
                    url={`/dashboard/${params.guildId}`}
                    disabled={!guild || !!error}
                />
            </Suspense>

            {error ?
                <ScreenMessage
                    title={error.includes("permssions")
                        ? "You cannot access this page.."
                        : "Something went wrong on this page.."
                    }
                    description={error}
                    buttons={<>
                        <ClientButton
                            as={Link}
                            href="/profile"
                            startContent={<HiViewGridAdd />}
                        >
                            Go back to Dashboard
                        </ClientButton>
                        <SupportButton />
                    </>}
                >
                    <Image src={SadWumpusPic} alt="" height={141} width={124} />
                </ScreenMessage>
                :
                (guild && loaded.length === 3) ? children : <></>
            }

        </div >
    );
}