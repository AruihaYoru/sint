export interface Author {
    id: string;
    name: string;
    github?: string;
    role?: string;
    specialties?: string[];
    nationality?: string;
}

export const authors: Record<string, Author> = {
    aruihayoru: {
        id: "aruihayoru",
        name: "AruihaYoru",
        github: "https://github.com/aruihayoru",
        role: "It's just A Editor",
        specialties: ["language", "NumberTheory(Novice)", "Study", "Engineering(apprentice)"],
        nationality: "JP"
    },
    okawa: {
        id: "okawa",
        name: "Kohei Okawa",
        github: "https://sint-org.academia.edu/KoheiOkawa",
        role: "Researcher",
        specialties: ["Geometric Number Theory", "Ihara zeta function", "Ramanujan graph"],
        nationality: "JP"
    }
};

export function getAuthor(id: string): Author {
    return authors[id] || {
        id,
        name: id,
        role: "Contributor",
        specialties: [],
        nationality: "Unknown"
    };
}
