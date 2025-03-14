import { promises as fs } from "fs";
import path from "path";
import { IncomingForm } from "formidable";
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

export async function readLeads() {
    try {
        const data = await fs.readFile(DATA_FILE, "utf-8");
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("❌ Error reading leads file:", error);
        return [];
    }
}
async function writeLeads(leads: any[]) {
    await fs.writeFile(DATA_FILE, JSON.stringify(leads, null, 2));
}

function convertNextRequestToIncomingMessage(req: NextRequest): IncomingMessage {
    const readable = Readable.fromWeb(req.body as any);
    const incomingMessage = Object.assign(readable, {
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

        return new Promise((resolve, reject) => {
            form.parse(incomingReq, async (err, fields, files) => {
                if (err) {
                    return reject(NextResponse.json({ message: "File upload error" }, { status: 500 }));
                }

                const file = files.resume?.[0];
                if (!file) {
                    return resolve(NextResponse.json({ message: "Resume file is required" }, { status: 400 }));
                }

                if (!fields.firstName || !fields.lastName || !fields.email || !fields.linkedin) {
                    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
                }

                const originalFilename = file.originalFilename || "uploaded-file";
                const newFileName = `${uuidv4()}${path.extname(originalFilename)}`;
                const newPath = path.join(process.cwd(), "public/uploads", newFileName);
                await fs.rename(file.filepath, newPath);

                let visas = fields.visasOfInterest?.[0] || "[]";
                if (!visas.startsWith("[")) {
                    visas = `[${JSON.stringify(visas)}]`;
                }
                const parsedVisas = JSON.parse(visas);

                const newLead = {
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
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
