// WickiLeaksComponent.tsx
import React, { useState } from "react";
import axios from "axios";
import styled from "@emotion/styled";

// Emotion styles
const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
  font-family: Arial, sans-serif;
`;

const Header = styled.h1`
  text-align: center;
  color: #333;
`;

const UploadForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FileInput = styled.input`
  background: #ffffff;
  padding: 6px;
  font-size: 1rem;
`;

const TextField = styled.textarea`
  padding: 10px;
  font-size: 1rem;
  resize: none;
`;

const Button = styled.button`
  padding: 10px 20px;
  background: #0077ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #005bb5;
  }
`;

const ReportSection = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
`;

const ReportTitle = styled.h2`
  color: #444;
  margin-bottom: 12px;
`;

const ReportItem = styled.p`
  font-size: 0.9rem;
  margin-bottom: 8px;
  color: #555;
`;

const ErrorMsg = styled.div`
  color: #bf0606;
  font-weight: bold;
`;

const SuccessMsg = styled.div`
  color: #0f812e;
  font-weight: bold;
`;

// Main component
const WickiLeaksComponent: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !description) {
      setError("Please provide all required data.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", description);

    try {
      setError(null);
      setLoading(true);

      // Example: POST data to server for rule processing
      const res = await axios.post("/api/process-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setReport(res.data);
      setSuccess("File successfully processed and judgments generated.");
    } catch (err) {
      setError("An error occurred while submitting the data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>WickiLeaks - Powered by Rules of the Land</Header>
      <UploadForm onSubmit={handleSubmit}>
        <label>
          <strong>Description of Evidence</strong>
        </label>
        <TextField
          placeholder="Provide a brief description of the data (e.g., polluting factory, improper practices, etc.)"
          rows={4}
          value={description}
          onChange={handleDescriptionChange}
        />
        <label>
          <strong>Upload File</strong>
        </label>
        <FileInput type="file" onChange={handleFileChange} />
        <Button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Submit Evidence"}
        </Button>
      </UploadForm>

      {error && <ErrorMsg>{error}</ErrorMsg>}
      {success && <SuccessMsg>{success}</SuccessMsg>}

      {report && (
        <ReportSection>
          <ReportTitle>Generated Report</ReportTitle>
          {report.violations.map((violation: any, index: number) => (
            <ReportItem key={index}>
              <strong>Violation Detected:</strong> {violation.rule}
              <br />
              <strong>Entity:</strong> {violation.entity}
              <br />
              <strong>Details:</strong> {violation.details}
            </ReportItem>
          ))}
        </ReportSection>
      )}
    </Container>
  );
};

export default WickiLeaksComponent;