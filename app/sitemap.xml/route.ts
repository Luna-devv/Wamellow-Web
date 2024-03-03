import { getCanonicalUrl } from "@/utils/urls";

type Sitemap = {
    url: string
    priority: number
}[]

// Update sitemap only one a day
export const revalidate = 1000 * 60 * 60 * 24;

const fetchOptions = { headers: { Authorization: process.env.API_SECRET as string }, next: { revalidate: 60 * 12 } };

export async function GET() {
    const uploadIds = await fetch(`${process.env.NEXT_PUBLIC_API}/ai/sitemap`, fetchOptions).then((res) => res.json()) as string[];
    const guildIds = await fetch(`${process.env.NEXT_PUBLIC_API}/guilds`, fetchOptions).then((res) => res.json()) as string[];

    const sitemap = [
        {
            url: getCanonicalUrl(),
            priority: 1
        },
        {
            url: getCanonicalUrl("bot", "pronouns"),
            priority: 0.9
        },
        {
            url: getCanonicalUrl("bot", "pronouns", "pronouns"),
            priority: 0.9
        },
        {
            url: getCanonicalUrl("bot", "pronouns", "sexualities"),
            priority: 0.9
        },
        {
            url: getCanonicalUrl("bot", "pronouns", "genders"),
            priority: 0.9
        },
        {
            url: getCanonicalUrl("ai"),
            priority: 0.9
        },
        {
            url: getCanonicalUrl("dashboard"),
            priority: 0.8
        },
        {
            url: getCanonicalUrl("profile"),
            priority: 0.8
        },
        {
            url: getCanonicalUrl("support"),
            priority: 0.7
        },
        {
            url: getCanonicalUrl("login"),
            priority: 0.5
        },
        {
            url: getCanonicalUrl("terms"),
            priority: 0.2
        },
        {
            url: getCanonicalUrl("privacy"),
            priority: 0.2
        }
    ] as Sitemap;

    for (const uploadId of uploadIds) sitemap.push({ url: getCanonicalUrl("ai-gallery", uploadId), priority: 0.6 });
    for (const guildId of guildIds) sitemap.push({ url: getCanonicalUrl("leaderboard", guildId), priority: 0.5 });

    return new Response(`
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${sitemap.map((site) => `
            <url>
                <loc>${site.url}</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                <changefreq>daily</changefreq>
                <priority>${site.priority}</priority>
            </url>
            `)}
        </urlset>`
        .replaceAll(",", ""), {
        headers: {
            "Content-Type": "text/xml"
        }
    });
}