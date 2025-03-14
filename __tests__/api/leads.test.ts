import * as leadApi from "../../src/app/api/leads/route";
import { describe, it, expect } from "@jest/globals";
import { POST, GET } from "@/app/api/leads/route";
import { NextRequest } from "next/server";
import { createMocks } from "node-mocks-http";

describe("Leads API", () => {
    it("should create a new lead with valid data", async () => {
        const { req, res } = createMocks({
            method: "POST",
            body: {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                linkedin: "https://linkedin.com/in/johndoe",
                visasOfInterest: ["O-1"],
            },
            headers: { "Content-Type": "application/json" },
        });

        expect(res._getStatusCode()).toBe(200);
    });
});
