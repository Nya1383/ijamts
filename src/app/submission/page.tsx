import FileUpload from "@/components/FileUpload";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Article Submission - IJAMTS",
  description: "Submit your article for publication in the International Journal of Advanced Methods in Technology Studies",
};

export default function SubmissionPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Submit Your Article</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Thank you for considering IJAMTS for publishing your research. Please complete the form below to submit your article for review.
          Our editorial team will review your submission and get back to you with feedback.
        </p>
        
        <FileUpload />
      </div>
    </div>
  );
} 