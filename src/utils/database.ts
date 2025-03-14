import { promises as fs } from "fs";
import path from "path";


const isVercel = process.env.VERCEL === "1";


import { kv } from "@vercel/kv"; 



const filePath = path.join(process.cwd(), "src/data/leads.json");

export interface Lead {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: "PENDING" | "REACHED_OUT";
    citizenship: string;
    createdAt: string;
    updatedAt?: string;
    linkedin: string;
    visasOfInterest: string[];
    resumeUrl: string;
    additionalInfo: string;
}


export async function readLeads(): Promise<Lead[]> {
    if (isVercel) {
        
        const leads = await kv.get<Lead[]>("leads");
        return leads ?? [];

    } else {
        
        try {
            const data = await fs.readFile(filePath, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            console.error(error);
            return [];
        }
    }
}


export async function writeLeads(leads: Lead[]): Promise<void> {
    if (isVercel) {
        
        await kv.set("leads", leads);
        
    } else {
        
        await fs.writeFile(filePath, JSON.stringify(leads, null, 2), "utf-8");
    }
}
