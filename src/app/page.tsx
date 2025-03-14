"use client";

import React, { useState, useEffect } from "react";
import { JsonForms } from "@jsonforms/react";
import { materialRenderers, materialCells } from "@jsonforms/material-renderers";
import { useRouter } from "next/navigation";
import { leadFormSchema } from "../models/leadFormSchema";
import { leadUiSchema } from "../models/leadUiSchema";
import { JsonFormsRendererRegistryEntry } from "@jsonforms/core";
import FileUpload from "../components/FileUpload";
import TextAreaRenderer from "../components/TextAreaRenderer";

import styles from "./lead-form.module.css";

const customRenderers: JsonFormsRendererRegistryEntry[] = [
  ...materialRenderers,
  { tester: (uischema) => ((uischema as any)?.scope === "#/properties/resume" ? 2 : -1), renderer: FileUpload },
  { tester: (uischema) => ((uischema as any)?.scope === "#/properties/additionalInfo" ? 2 : -1), renderer: TextAreaRenderer },
];

export default function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, unknown> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validateMode, setValidateMode] = useState<"ValidateAndShow" | "ValidateAndHide">("ValidateAndHide");

  useEffect(() => {
    setFormData({});
  }, []);

  const handleSubmit = async () => {
    setValidateMode("ValidateAndShow");
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const formDataToSend = new FormData();
      if (formData) {
        Object.entries(formData).forEach(([key, value]) => {
          formDataToSend.append(key, value as string);
        });
      }

      const response = await fetch("/api/leads", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        setErrorMessage(`Failed to submit: ${errorMessage.message}`);
        return;
      }

      router.push("/thank-you");
    } catch (error) {
      setErrorMessage("Failed to submit the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.title}>Want to understand your visa options?</h1>
      <p className={styles.subtitle}>
        Submit the form below and our team of experienced attorneys will review your information and send a
        preliminary assessment of your case based on your goals.
      </p>

      {errorMessage ? <p style={{ color: "red" }}>{errorMessage}</p> : null}

      {formData !== null && (
        <JsonForms
          schema={leadFormSchema}
          uischema={leadUiSchema}
          data={formData}
          renderers={customRenderers}
          cells={materialCells}
          validationMode={validateMode}
          onChange={({ data }) => setFormData(data)}
        />
      )}

      <button type="submit" className={styles.submitButton} disabled={isSubmitting} onClick={handleSubmit}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
}
