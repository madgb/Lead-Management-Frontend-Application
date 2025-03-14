import { promises as fs } from "fs";
import path from "path";
import { IncomingForm, Fields, Files } from "formidable";
import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import { IncomingMessage } from "http";

export const config = {
    api: {
        bodyParser: false,
    },
};

const DATA_FILE = path.join(process.cwd(), "src/data/leads.json");

interface Lead {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    linkedin: string;
    citizenship: string;
    visasOfInterest: string[];
    resumeUrl: string;
    additionalInfo: string;
    status: "PENDING" | "REACHED_OUT";
    createdAt: string;
}

async function readLeads(): Promise<Lead[]> {
    try {
        const data = await fs.readFile(DATA_FILE, "utf-8");
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("❌ Error reading leads file:", error);
        return [];
    }
}

async function writeLeads(leads: Lead[]): Promise<void> {
    await fs.writeFile(DATA_FILE, JSON.stringify(leads, null, 2));
}

function convertNextRequestToIncomingMessage(req: NextRequest): IncomingMessage {
    if (!req.body) {
        throw new Error("Request body is null or undefined");
    }

    const reader = req.body.getReader();

    const stream = new Readable({
        async read() {
            const { done, value } = await reader.read();
            if (done) {
                this.push(null);
            } else {
                this.push(Buffer.from(value));
            }
        },
    });

    const incomingMessage = Object.assign(stream, {
        headers: Object.fromEntries(req.headers),
        method: req.method,
        url: req.url,
    });

    return incomingMessage as IncomingMessage;
}

export async function GET() {
    const leads = await readLeads();
    return NextResponse.json(leads);
}

export async function POST(req: NextRequest) {
    const form = new IncomingForm({ uploadDir: "./public/uploads", keepExtensions: true });

    try {
        const incomingReq = convertNextRequestToIncomingMessage(req);

        return new Promise<NextResponse>((resolve, reject) => {
            form.parse(incomingReq, async (err: Error | null, fields: Fields, files: Files) => {
                if (err) {
                    return reject(NextResponse.json({ message: "File upload error" }, { status: 500 }));
                }

                const file = files.resume?.[0];
                if (!file) {
                    return resolve(NextResponse.json({ message: "Resume file is required" }, { status: 400 }));
                }

                if (!fields.firstName || !fields.lastName || !fields.email || !fields.linkedin) {
                    return resolve(NextResponse.json({ message: "Missing required fields" }, { status: 400 }));
                }

                const originalFilename = file.originalFilename || "uploaded-file";
                const newFileName = `${uuidv4()}${path.extname(originalFilename)}`;
                const newPath = path.join(process.cwd(), "public/uploads", newFileName);
                await fs.rename(file.filepath, newPath);

                let visas = fields.visasOfInterest?.[0] || "[]";
                if (!visas.startsWith("[")) {
                    visas = `[${JSON.stringify(visas)}]`;
                }
                const parsedVisas: string[] = JSON.parse(visas);

                const newLead: Lead = {
                    id: uuidv4(),
                    firstName: fields.firstName?.[0] || "Unknown",
                    lastName: fields.lastName?.[0] || "Unknown",
                    email: fields.email?.[0] || "Unknown",
                    linkedin: fields.linkedin?.[0] || "",
                    citizenship: fields.citizenship?.[0] || "",
                    visasOfInterest: parsedVisas,
                    resumeUrl: `/uploads/${newFileName}`,
                    additionalInfo: fields.additionalInfo?.[0] || "",
                    status: "PENDING",
                    createdAt: new Date().toISOString(),
                };

                const leads = await readLeads();
                leads.push(newLead);
                await writeLeads(leads);

                return resolve(NextResponse.json(newLead, { status: 201 }));
            });
        });
    } catch (error) {
        return NextResponse.json({ message: `Internal Server Error: ${error}` }, { status: 500 });
    }
}
