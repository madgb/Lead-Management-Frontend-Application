import React from "react";
import { OwnPropsOfControl } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";

interface TextAreaProps extends OwnPropsOfControl {
    data?: string;
    handleChange: (path: string, value: string) => void;
    path: string;
}

const TextAreaRenderer: React.FC<TextAreaProps> = ({ data, handleChange, path }) => {
    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        handleChange(path, event.target.value);
    };

    return (
        <div>
            <h2>How can we help you?</h2>
            <textarea
                value={data || ""}
                placeholder="What is your current status and when does it expire? Are you looking for a long-term residency or short-term employment?"
                onChange={handleInputChange}
                rows={5}
                style={{ width: "100%", resize: "vertical", padding: "1rem", marginBottom: "3rem" }}
            />
        </div>
    );
};

export default withJsonFormsControlProps(TextAreaRenderer);
