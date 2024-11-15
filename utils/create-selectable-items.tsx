import { ApiV1GuildsChannelsGetResponse, ApiV1GuildsEmojisGetResponse, ApiV1GuildsRolesGetResponse, PermissionFlagsBits } from "@/typings";
import Image from "next/image";

type Item = ApiV1GuildsChannelsGetResponse | ApiV1GuildsRolesGetResponse;

export function createSelectableItems<T extends Item>(
    items: T[] | undefined,
    requiredPermissions: (keyof typeof PermissionFlagsBits)[] = ["ViewChannel", "SendMessages", "EmbedLinks"],
    allowNSFW: boolean = false
) {
    if (!items?.length) return [];

    return items
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter((item) => !allowNSFW && !("nsfw" in item ? item.nsfw : false))
        .map((item) => ({
            name: `${"type" in item ? "#" : "@"}${item.name}`,
            value: item.id,
            error: "permissions" in item
                ? requiredPermissions.map((perm) => (item.permissions & PermissionFlagsBits[perm]) === 0 ? perm : false).filter(Boolean).join(", ")
                : undefined,
            color: "color" in item ? item.color : undefined
        }));
}

export function createSelectableEmojiItems(emojis: ApiV1GuildsEmojisGetResponse[] = []) {
    return [
        { icon: "👋", name: "Wave", value: "👋" },
        { icon: "☕", name: "Coffee", value: "☕" },
        ...emojis
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((c) => ({
                icon: <Image
                    src={`https://cdn.discordapp.com/emojis/${c.id}.webp?size=64&quality=lossless`}
                    className="rounded-md h-6 w-6"
                    alt={c.name}
                    height={64}
                    width={64}
                />,
                name: c.name.replace(/-|_/g, " "),
                value: c.id
            }))
    ]
}