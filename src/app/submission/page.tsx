import FileUpload from "@/components/FileUpload";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Article Submission - IJAMTS",
  description: "Submit your article for publication in the International Journal of Advances in Management, Technology and Science",
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

        <div className="bg-[var(--secondary-background)] p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold mb-4">Important Instructions</h2>
          <div className="space-y-4 text-[var(--foreground)]">
            <ul className="list-disc pl-5 space-y-4">
              <li>
                We recommend to read the <Link href="/submission/format" className="text-blue-600 hover:underline">publication guidelines/process</Link>, 
                <Link href="/submission/fee" className="text-blue-600 hover:underline ml-1">Fees & Payment</Link> and 
                <Link href="/faq" className="text-blue-600 hover:underline ml-1">FAQs</Link> before submitting your research paper / article / manuscript for publication.
              </li>
              <li>
                Kindly fill all the details properly as certificate will be generated on the basis of information provided as under.
              </li>
              <li>
                It is important that you provide functioning email address and functioning mobile number of the first author correctly because all communication will occur on those email address and/or mobile number.
              </li>
              <li>
                Details of the paper (Title, Abstract, Keywords, Author Name(s), Designation(s), Organization Name(s)) must be same as mentioned in the research paper which you are submitting.
              </li>
              <li>
                Please write Abstract in Sentence case, email address in lower case and all other fields in Title Case (Capitalize first character of each words). It's better NOT to write in UPPER CASE.
              </li>
            </ul>
          </div>
        </div>
        
        <FileUpload />
      </div>
    </div>
  );
} 