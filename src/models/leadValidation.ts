import { z } from "zod";
import { countries } from "../data/countries";

export const leadFormSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required." }),
    lastName: z.string().min(1, { message: "Last name is required." }),
    email: z.string().email({ message: "Enter a valid email address." }),
    linkedin: z.string().url({ message: "Enter a valid LinkedIn URL." }),
    citizenship: z.string()
        .min(1, { message: "Country of citizenship is required." })
        .refine((value) => countries.includes(value), { message: "Invalid country selected." }),
    visasOfInterest: z.array(z.string()).min(1, { message: "Select at least one visa category." }),
    resume: z
        .any()
        .refine((file) => file instanceof File, { message: "Upload a valid resume file." })
        .refine((file) => ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type), {
            message: "Only PDF and Word documents are allowed.",
        })
        .refine((file) => file.size < 5 * 1024 * 1024, { message: "File size must be under 5MB." }),
    additionalInfo: z.string().optional(),
});