import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const leads = [
    {
        id: uuidv4(),
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        status: "PENDING",
        citizenship: "USA",
        createdAt: new Date().toISOString(),
    },
    {
        id: uuidv4(),
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        status: "PENDING",
        citizenship: "Canada",
        createdAt: new Date().toISOString(),
    },
    {
        id: uuidv4(),
        firstName: "Carlos",
        lastName: "Gomez",
        email: "carlos.gomez@example.com",
        status: "PENDING",
        citizenship: "Mexico",
        createdAt: new Date().toISOString(),
    },
    {
        id: uuidv4(),
        firstName: "Li",
        lastName: "Zhang",
        email: "li.zhang@example.com",
        status: "PENDING",
        citizenship: "China",
        createdAt: new Date().toISOString(),
    },
    {
        id: uuidv4(),
        firstName: "Aisha",
        lastName: "Khan",
        email: "aisha.khan@example.com",
        status: "PENDING",
        citizenship: "Pakistan",
        createdAt: new Date().toISOString(),
    },
    {
        id: uuidv4(),
        firstName: "Michael",
        lastName: "Brown",
        email: "michael.brown@example.com",
        status: "PENDING",
        citizenship: "UK",
        createdAt: new Date().toISOString(),
    },
    {
        id: uuidv4(),
        firstName: "Fatima",
        lastName: "Ali",
        email: "fatima.ali@example.com",
        status: "PENDING",
        citizenship: "UAE",
        createdAt: new Date().toISOString(),
    },
    {
        id: uuidv4(),
        firstName: "Ricardo",
        lastName: "Santos",
        email: "ricardo.santos@example.com",
        status: "PENDING",
        citizenship: "Brazil",
        createdAt: new Date().toISOString(),
    },
    {
        id: uuidv4(),
        firstName: "Elena",
        lastName: "Ivanova",
        email: "elena.ivanova@example.com",
        status: "PENDING",
        citizenship: "Russia",
        createdAt: new Date().toISOString(),
    },
    {
        id: uuidv4(),
        firstName: "Hiroshi",
        lastName: "Tanaka",
        email: "hiroshi.tanaka@example.com",
        status: "PENDING",
        citizenship: "Japan",
        createdAt: new Date().toISOString(),
    },
];

export async function GET() {
    try {
        const response = await fetch("http://localhost:3000/api/leads", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(leads),
        });

        if (!response.ok) {
            throw new Error("Failed to insert dummy leads");
        }

        return NextResponse.json({ message: "Dummy leads inserted successfully" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

