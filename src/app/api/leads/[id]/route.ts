import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { promises as fs } from "fs";
import path from "path";

export interface Lead {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: "PENDING" | "REACHED_OUT";
    citizenship: string;
    createdAt: string;
    updatedAt?: string;
}

const DATA_FILE = path.join(process.cwd(), "src/data/leads.json");

const isVercel = !!process.env.KV_REST_API_URL;

async function readLeads(): Promise<Lead[]> {
    if (isVercel) {
        return (await kv.get<Lead[]>("leads")) || [];
    } else {
        try {
            const data = await fs.readFile(DATA_FILE, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            console.error("❌ Error reading leads file:", error);
            return [];
        }
    }
}

async function writeLeads(leads: Lead[]): Promise<void> {
    if (isVercel) {
        await kv.set("leads", leads);
    } else {
        await fs.writeFile(DATA_FILE, JSON.stringify(leads, null, 2), "utf-8");
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    if (!params || !params.id) {
        return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const { id } = params;
    const { status } = await req.json();

    if (status !== "PENDING" && status !== "REACHED_OUT") {
        return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    const leads = await readLeads();
    const leadIndex = leads.findIndex((lead) => lead.id === id);

    if (leadIndex === -1) {
        return NextResponse.json({ message: "Lead not found" }, { status: 404 });
    }

    leads[leadIndex].status = status;
    leads[leadIndex].updatedAt = new Date().toISOString();

    await writeLeads(leads);

    return NextResponse.json(leads[leadIndex]);
}
