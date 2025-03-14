import React from "react";
import { OwnPropsOfControl } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";

interface FileUploadProps extends OwnPropsOfControl {
    data?: File;
    handleChange: (path: string, value: File | null) => void;
    path: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ data, handleChange, path }) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        handleChange(path, file);
    };

    return (
        <div style={{ display: "flex", flexFlow: "column" }}>
            <h2>Upload your resume</h2>
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
            {data ? <p>✅ {data.name} selected</p> : <p>No file selected</p>}
        </div>
    );
};

export default withJsonFormsControlProps(FileUpload);
