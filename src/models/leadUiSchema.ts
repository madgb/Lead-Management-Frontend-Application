export const leadUiSchema = {
    type: "VerticalLayout",
    elements: [
        { type: "Control", scope: "#/properties/firstName" },
        { type: "Control", scope: "#/properties/lastName" },
        { type: "Control", scope: "#/properties/email" },
        { type: "Control", scope: "#/properties/linkedin" },
        {
            type: "Control",
            scope: "#/properties/citizenship",
            options: { format: "dropdown" }
        },
        {
            type: "Group",
            label: "Visa categories of interest",
            elements: [
                {
                    type: "VerticalLayout",
                    elements: [
                        { type: "Control", scope: "#/properties/visasOfInterest" }
                    ]
                }
            ]
        },
        { type: "Control", scope: "#/properties/resume" },
        {
            type: "Control",
            scope: "#/properties/additionalInfo",
            options: { multi: true }
        }
    ]
};
