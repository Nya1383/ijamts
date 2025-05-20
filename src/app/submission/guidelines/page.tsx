import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Publication Guidelines - IJAMTS",
  description: "Guidelines for submitting your research to the International Journal of Advances in Management, Technology and Science",
};

export default function PublicationGuidelinesPage() {
  return (
    <div className="container py-12">
      <div className="relative max-w-4xl mx-auto">
        {/* Downloads Box */}
        <div className="lg:absolute lg:right-[-250px] lg:top-20 lg:w-[220px] w-full mb-8 lg:mb-0 bg-[var(--background)] rounded-xl shadow-lg p-5 border border-[var(--border)]">
          <h3 className="text-xl font-bold mb-4 text-[var(--foreground)]">Downloads</h3>
          <ul className="space-y-3">
            <li>
              <Link 
                href="/downloads/undertaking-form.docx" 
                className="flex items-center text-[var(--accent)] hover:underline"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
                Undertaking Form
              </Link>
            </li>
            <li>
              <Link 
                href="/downloads/paper-format.docx" 
                className="flex items-center text-[var(--accent)] hover:underline"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
                Paper Format
              </Link>
            </li>
          </ul>
        </div>
        
        <h1 className="text-3xl font-bold mb-8 text-[var(--foreground)]">Publication Guidelines</h1>
        
        <div className="bg-[var(--background)] rounded-xl shadow-lg p-8 border border-[var(--border)] mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[var(--foreground)]">Manuscript Preparation</h2>
          
          <div className="space-y-6 text-[var(--secondary-text)]">
            <p className="text-lg">
              Please follow these guidelines carefully to ensure a smooth publication process. Manuscripts that do not conform to these guidelines may be returned for revision before review.
            </p>
            
            <div>
              <h3 className="text-xl font-semibold mb-3 text-[var(--foreground)]">Manuscript Format</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>You can use Microsoft Word (.doc or .docx format)</li>
                <li>Paper size: A4</li>
                <li>Margins: 1 inch (2.54 cm) on all sides</li>
                <li>Font: Times New Roman, 12 point for text, 14 point for headings</li>
                <li>Line spacing: 1.5 throughout the manuscript</li>
                <li>Text alignment: Justified</li>
                <li>Page numbers: Bottom center</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3 text-[var(--foreground)]">Manuscript Structure</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Title Page:</strong> Include the title, author names, affiliations, contact information, and a short running title (up to 50 characters)</li>
                <li><strong>Abstract:</strong> 200-250 words, structured to highlight the purpose, methodology, findings, and conclusions</li>
                <li><strong>Keywords:</strong> 4-6 keywords or phrases</li>
                <li><strong>Introduction:</strong> Provide background, context, and clear research objectives</li>
                <li><strong>Methods:</strong> Describe in sufficient detail to allow replication</li>
                <li><strong>Results:</strong> Present findings without interpretation</li>
                <li><strong>Discussion:</strong> Interpret findings in the context of existing literature</li>
                <li><strong>Conclusion:</strong> Summarize key findings and implications</li>
                <li><strong>References:</strong> Follow APA 7th edition format</li>
                <li><strong>Appendices:</strong> Include supporting materials as needed</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3 text-[var(--foreground)]">Tables and Figures</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Place tables and figures within the text at appropriate locations</li>
                <li>Number tables and figures consecutively (Table 1, Figure 1, etc.)</li>
                <li>Provide a descriptive title for each table and figure</li>
                <li>Ensure all tables and figures are referenced in the text</li>
                <li>Include legends and explanatory notes as needed</li>
                <li>For figures, use high resolution images (minimum 300 dpi)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3 text-[var(--foreground)]">References</h3>
              <p className="mb-3">Follow APA 7th edition format for all references. Examples:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Journal Article:</strong> Author, A. A., & Author, B. B. (Year). Title of article. <em>Title of Journal</em>, Volume(Issue), page range. DOI</li>
                <li><strong>Book:</strong> Author, A. A. (Year). <em>Title of book</em>. Publisher.</li>
                <li><strong>Book Chapter:</strong> Author, A. A. (Year). Title of chapter. In E. Editor (Ed.), <em>Title of book</em> (pp. xx-xx). Publisher.</li>
                <li><strong>Website:</strong> Author, A. A. (Year, Month Day). Title of page. Site Name. URL</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-[var(--background)] rounded-xl shadow-lg p-8 border border-[var(--border)]">
          <h2 className="text-2xl font-bold mb-6 text-[var(--foreground)]">Author Undertaking</h2>
          
          <div className="space-y-6 text-[var(--secondary-text)]">
            <p className="text-lg">
              All authors must agree to the following terms and conditions before their manuscript can be considered for publication:
            </p>
            
            <ol className="list-decimal pl-6 space-y-4">
              <li>
                <strong>Originality:</strong> The submitted manuscript is original work that has not been published previously, nor is under consideration for publication elsewhere.
              </li>
              <li>
                <strong>Authorship:</strong> All authors listed have made a significant contribution to the research and approve the final version of the manuscript.
              </li>
              <li>
                <strong>Ethics:</strong> The research involving human subjects, animals, or biological materials has been conducted in accordance with relevant ethical guidelines and approvals.
              </li>
              <li>
                <strong>Conflicts of Interest:</strong> All authors have disclosed any actual or potential conflicts of interest that could influence the research or its interpretation.
              </li>
              <li>
                <strong>Data Integrity:</strong> The data presented in the manuscript are authentic and accurate, and the authors agree to make the data available upon reasonable request.
              </li>
              <li>
                <strong>Copyright:</strong> Upon acceptance, the authors grant IJAMTS a license to publish the article while retaining copyright ownership. The article will be published under the Creative Commons Attribution License (CC BY 4.0).
              </li>
              <li>
                <strong>Permissions:</strong> The authors have obtained permission to use any copyrighted material, including figures, tables, or extensive quotations from other sources.
              </li>
              <li>
                <strong>Compliance:</strong> The authors agree to comply with any reasonable request from the journal editors to provide evidence of the claims made in the paper.
              </li>
            </ol>
            
            <p>
              An undertaking form must and will need to be signed by all authors and submitted along with the manuscript. This form can be downloaded from the downloads box.
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link 
            href="/submission" 
            className="inline-block px-8 py-4 bg-[var(--accent)] text-white text-lg font-medium rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Submit Your Paper
          </Link>
        </div>
      </div>
    </div>
  );
} 