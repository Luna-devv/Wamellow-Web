"use client";

import { Skeleton } from "@nextui-org/react";
import Head from "next/head";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HiArrowNarrowLeft, HiCursorClick, HiShare, HiUsers, HiViewGridAdd } from "react-icons/hi";

import { guildStore } from "@/common/guilds";
import { webStore } from "@/common/webstore";
import { CopyToClipboardButton } from "@/components/copyToClipboard";
import ImageReduceMotion from "@/components/image-reduce-motion";
import { ListTab } from "@/components/list";
import { ScreenMessage } from "@/components/screen-message";
import { ApiV1GuildsChannelsGetResponse, ApiV1GuildsEmojisGetResponse, ApiV1GuildsGetResponse, ApiV1GuildsRolesGetResponse, RouteErrorResponse } from "@/typings";
import { getCanonicalUrl } from "@/utils/urls";

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    const guild = guildStore((g) => g);
    const web = webStore((w) => w);

    const [error, setError] = useState<string>();

    const params = useParams();
    const path = usePathname();
    const intl = new Intl.NumberFormat("en", { notation: "standard" });

    useEffect(() => {

        fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${params.guildId}`, {
            headers: {
                authorization: localStorage.getItem("token") as string
            }
        })
            .then(async (res) => {
                const response = await res.json() as ApiV1GuildsGetResponse;
                if (!response) return;

                switch (res.status) {
                    case 200: {
                        setError(undefined);
                        guildStore.setState(response);
                        break;
                    }
                    default: {
                        guildStore.setState(undefined);
                        setError((response as unknown as RouteErrorResponse).message);
                        break;
                    }
                }

            })
            .catch(() => {
                setError("Error while fetching guilds");
            });



        fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${params.guildId}/channels`, {
            headers: {
                authorization: localStorage.getItem("token") as string
            }
        })
            .then(async (res) => {
                const response = await res.json() as ApiV1GuildsChannelsGetResponse[];
                if (!response) return;

                switch (res.status) {
                    case 200: {
                        guildStore.setState({
                            ...guild,
                            channels: response
                        });
                        break;
                    }
                    default: {
                        guildStore.setState({
                            ...guild,
                            channels: []
                        });
                        setError((response as unknown as RouteErrorResponse).message);
                        break;
                    }
                }

            })
            .catch(() => {
                setError("Error while fetching channels");
            });

        fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${params.guildId}/roles`, {
            headers: {
                authorization: localStorage.getItem("token") as string
            }
        })
            .then(async (res) => {
                const response = await res.json() as ApiV1GuildsRolesGetResponse[];
                if (!response) return;

                switch (res.status) {
                    case 200: {
                        guildStore.setState({
                            ...guild,
                            roles: response
                        });
                        break;
                    }
                    default: {
                        guildStore.setState({
                            ...guild,
                            roles: response
                        });
                        setError((response as unknown as RouteErrorResponse).message);
                        break;
                    }
                }

            })
            .catch(() => {
                setError("Error while fetching roles");
            });

        fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${params.guildId}/emojis`, {
            headers: {
                authorization: localStorage.getItem("token") as string
            }
        })
            .then(async (res) => {
                const response = await res.json() as ApiV1GuildsEmojisGetResponse[];
                if (!response) return;

                switch (res.status) {
                    case 200: {

                        guildStore.setState({
                            ...guild,
                            emojis: response
                        });
                        break;
                    }
                    default: {

                        guildStore.setState({
                            ...guild,
                            emojis: response
                        });
                        setError((response as unknown as RouteErrorResponse).message);
                        break;
                    }
                }

            })
            .catch(() => {
                setError("Error while fetching roles");
            });

    }, []);

    return (
        <div className="flex flex-col w-full">
            <Head>
                {guild?.name && <title>{`${guild?.name}'s Dashboard`}</title>}
            </Head>

            <div className="flex flex-col gap-5 mb-3">
                <Link href="/dashboard" className="button-underline">
                    <HiArrowNarrowLeft /> Serverlist
                </Link>

                <div className="text-lg flex gap-5 items-center">
                    <Skeleton isLoaded={!!guild?.id} className="rounded-full h-14 w-14 ring-offset-[var(--background-rgb)] ring-2 ring-offset-2 ring-violet-400/40">
                        <ImageReduceMotion url={`https://cdn.discordapp.com/icons/${guild?.id}/${guild?.icon}`} size={128} alt="Server" />
                    </Skeleton>

                    {!guild?.id ?
                        <div>
                            <Skeleton className="rounded-xl w-32 h-5 mb-2" />
                            <Skeleton className="rounded-xl w-10 h-3.5" />
                        </div>
                        :
                        <div className="flex flex-col gap-1">
                            <div className="text-2xl dark:text-neutral-200 text-neutral-800 font-medium">{guild?.name || "Unknown Server"}</div>
                            <div className="text-sm font-semibold flex items-center gap-1"> <HiUsers /> {intl.format(guild?.memberCount || 0)}</div>
                        </div>
                    }

                    <div className="ml-auto">
                        {web.devToolsEnabled &&
                            <CopyToClipboardButton
                                text={getCanonicalUrl("leaderboard", params.guildId.toString())}
                                items={[
                                    { icon: <HiShare />, name: "Copy page url", description: "Creates a link to this specific page", text: getCanonicalUrl(...path.split("/").slice(1)) },
                                    { icon: <HiCursorClick />, name: "Copy dash-to url", description: "Creates a dash-to link to the current tab", text: getCanonicalUrl(`dashboard?to=${path.split("/dashboard/")[1].split("/")[1] || "/"}`) }
                                ]}
                                icon={<HiShare />}
                            />
                        }
                    </div>
                </div>
            </div>

            <ListTab
                tabs={[
                    {
                        name: "Overview",
                        value: "/"
                    },
                    {
                        name: "Leaderboards",
                        value: "/leaderboards"
                    },
                    {
                        name: "Greetings",
                        value: "/greeting"
                    },
                    {
                        name: "Starboard",
                        value: "/starboard"
                    },
                    {
                        name: "Custom Commands",
                        value: "/custom-commands"
                    }
                ]}
                url={`/dashboard/${params.guildId}`}
                disabled={!guild?.id || !!error}
            />

            {error ?
                <ScreenMessage
                    title="Something went wrong.."
                    description={error}
                    href="/dashboard"
                    button="Go back to server list"
                    icon={<HiViewGridAdd />}
                />
                :
                guild?.id ? children : <></>
            }

        </div >
    );
}