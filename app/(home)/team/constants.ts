export const repos = ["Luna-devv/mellow-web", "Luna-devv/nekostic", "Luna-devv/lunify.js", "Luna-devv/dlist.js", "Luna-devv/githook"] as const;

export enum TeamType {
    Developer = "developer",
    AdditionalProgramming = "additional-programming",
    Blahaj = "blahaj",
    Donator = "donator"
}

export const members = [
    {
        id: "821472922140803112",
        team: TeamType.Developer,
        social: "https://lunish.nl/kofi"
    },

    {
        name: "Lea",
        avatarUrl: "/lea.webp",
        team: TeamType.Blahaj
    },
    {
        name: "Lucy",
        avatarUrl: "/lucy.webp",
        team: TeamType.Blahaj
    },
    {
        name: "Lauren",
        avatarUrl: "/lauren.webp",
        team: TeamType.Blahaj
    },

    {
        id: "845287163712372756",
        team: TeamType.AdditionalProgramming,
        social: "https://ko-fi.com/aurora_loves_women"
    },
    {
        id: "903534295652663326",
        team: TeamType.AdditionalProgramming,
        social: "https://ismcserver.online"
    },

    {
        id: "301482272497074189",
        team: TeamType.Donator
    },
    {
        id: "797012765352001557",
        team: TeamType.Donator,
        social: "https://crni.xyz/"
    },
    {
        id: "1044032607207301160",
        team: TeamType.Donator,
        social: "https://notifyme.bot/"
    },
    {
        id: "742224557632389160",
        team: TeamType.Donator
    },
    {
        id: "340243638892101646",
        team: TeamType.Donator,
        social: "https://sattler.dev/"
    },
    {
        id: "911823996767600730",
        team: TeamType.Donator,
        social: "https://ibcheechy.com/"
    }
] as const;