import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "src/data/leads.json");

interface Lead {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: "PENDING" | "REACHED_OUT";
    citizenship: string;
    createdAt: string;
    updatedAt?: string;
}

async function readLeads(): Promise<Lead[]> {
    try {
        const data = await fs.readFile(filePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function writeLeads(leads: Lead[]) {
    await fs.writeFile(filePath, JSON.stringify(leads, null, 2), "utf-8");
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;

    const { status } = await req.json();

    if (status !== "PENDING" && status !== "REACHED_OUT") {
        return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    const leads: Lead[] = await readLeads();
    const leadIndex = leads.findIndex((lead: Lead) => lead.id === id);

    if (leadIndex === -1) {
        return NextResponse.json({ message: "Lead not found" }, { status: 404 });
    }

    leads[leadIndex].status = status;
    leads[leadIndex].updatedAt = new Date().toISOString();

    await writeLeads(leads);
    return NextResponse.json(leads[leadIndex]);
}
