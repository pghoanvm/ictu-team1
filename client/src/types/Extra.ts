export interface Collection {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    productIds?: string[];
}

export interface AboutUs {
    title: string;
    content: string;
    mission: string;
    vision: string;
    contactEmail: string;
}