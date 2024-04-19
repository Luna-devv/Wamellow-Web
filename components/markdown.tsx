/* eslint-disable @typescript-eslint/no-unused-vars */
import { getBaseUrl } from "@/utils/urls";
import { Code } from "@nextui-org/react";
import Link from "next/link";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import rehypeRaw from "rehype-raw";
import Notice, { NoticeType } from "./notice";
import cn from "@/utils/cn";

const AllowedIframes = [
    "https://www.youtube.com/embed/",
    "https://e.widgetbot.io/channels/",
    getBaseUrl()
]

export default function BeautifyMarkdown({
    markdown
}: {
    markdown: string
}) {

    function parseDiscordMarkdown(content: string) {
        return content
            .replace(/__(.*?)__/g, "<u>$1</u>")
            // .replace(/<a?:\w{2,32}:(.*?)>/g, "<img className='rounded-md' style='height: 1.375em; position: relative' src=\"https://cdn.discordapp.com/emojis/$1.webp?size=40&quality=lossless\" />")
            .replace(/<a?:\w{2,32}:(.*?)>/g, "")
            .replace(/<(@|@!)\d{15,21}>/g, "<span className='bg-blurple/25 hover:bg-blurple/50 p-1 rounded-md dark:text-neutral-100 text-neutral-900 font-light text-sx duration-200 cursor-pointer'>@User</span>")
            .replace(/<(#)\d{15,21}>/g, "<span className='bg-blurple/25 hover:bg-blurple/50 p-1 rounded-md dark:text-neutral-100 text-neutral-900 font-light text-sx duration-200 cursor-pointer'>@Channel</span>");
    }

    return (
        <ReactMarkdown
            /* @ts-expect-error they broke types */
            rehypePlugins={[rehypeRaw]}
            components={{
                h1: (props) => <Link
                    href={`#${props.children.toString().toLowerCase().replace(/ +/g, "-")}`}
                    className="flex mt-10 mb-3 cursor-pointer dark:text-neutral-100 text-neutral-900 hover:underline"
                >
                    <h2 id={props.children.toString().toLowerCase().replace(/ +/g, "-")} className="text-3xl font-semibold" {...props} />
                </Link>,

                h2: (props) => <Link
                    href={`#${props.children.toString().toLowerCase().replace(/ +/g, "-")}`}
                    className="flex mt-6 mb-2 cursor-pointer dark:text-neutral-100 text-neutral-900 hover:underline"
                >
                    <h1 id={props.children.toString().toLowerCase().replace(/ +/g, "-")} className="text-2xl font-semibold" {...props} />
                </Link>,

                h3: (props) => <Link
                    href={`#${props.children.toString().toLowerCase().replace(/ +/g, "-")}`}
                    className="flex mt-6 mb-2 cursor-pointer dark:text-neutral-100 text-neutral-900 hover:underline"
                >
                    <h3 id={props.children.toString().toLowerCase().replace(/ +/g, "-")} className="text-xl font-semibold" {...props} />
                </Link>,

                strong: (props) => <span className="font-semibold dark:text-neutral-200 text-neutral-800" {...props} />,
                i: (props) => <span className="italic" {...props} />,
                a: (props) => <a className="text-blue-500 hover:underline underline-blue-500" {...props} />,
                del: (props) => <span className="line-through" {...props} />,
                ins: (props) => <span className="underline" {...props} />,
                li: (props) => <div className="flex gap-1 my-1">
                    <span className="mr-1">•</span>
                    <span {...props} />
                </div>,
                // @ts-expect-error Warning: Received `true` for a non-boolean attribute `inline`.
                code: (props: { children: React.ReactNode }) => <Code color="secondary" {...props} inline="false" />,

                table: (props) => <table className="mt-4 table-auto w-full divide-y-1 divide-wamellow overflow-scroll" {...props} />,
                th: ({ isHeader, ...props }) => <th className=" px-2 pb-2 font-medium text-neutral-800 dark:text-neutral-200 text-left" {...props} />,
                tr: ({ isHeader, ...props }) => <tr className="divide-x-1 divide-wamellow" {...props} />,
                td: ({ isHeader, ...props }) => <td className="px-2 py-1 divide-x-8 divide-wamellow break-all" {...props} />,

                iframe: ({ className, ...props }) => {
                    if (AllowedIframes.some((url) => props.src?.startsWith(url))) {
                        return (
                            <iframe
                                allow="clipboard-write; fullscreen"
                                className={cn(
                                    "w-full rounded-lg mt-4",
                                    className
                                )}
                                {...props}
                            />
                        )
                    }

                    return (
                        <div className="mt-4">
                            <Notice
                                type={NoticeType.Error}
                                message={`Iframe from "${props.src?.split("/")[2]}" is not allowed`}
                            />
                        </div>
                    )
                }
            }}
        >
            {parseDiscordMarkdown(markdown)}
        </ReactMarkdown>
    );

}