export const leadFormSchema = {
    type: "object",
    properties: {
        firstName: { type: "string", minLength: 1, title: "First Name" },
        lastName: { type: "string", minLength: 1, title: "Last Name" },
        email: { type: "string", format: "email", title: "Email" },
        linkedin: { type: "string", title: "LinkedIn / Personal Website URL" },
        citizenship: {
            type: "string",
            enum: [
                "United States", "Canada", "United Kingdom", "Germany", "France",
                "Australia", "India", "China", "South Korea", "Japan",
                "Brazil", "Mexico", "Russia", "South Africa"
            ],
            title: "Country of Citizenship"
        },
        visasOfInterest: {
            type: "array",
            items: { type: "string", enum: ["O-1", "EB-1A", "EB-2 NIW", "I don't know"] },
            title: "Visa categories of interest",
            uniqueItems: true
        },
        resume: { type: "string", title: "Resume/CV Upload", format: "binary" },
        additionalInfo: {
            type: "string",
            title: "How can we help you?",
            description: "What is your current status and when does it expire? Are you looking for a long-term residency or short-term employment?",
        }
    },
    required: ["firstName", "lastName", "email", "citizenship"]
};
