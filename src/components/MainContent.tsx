export default function MainContent() {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* About the Journal */}
      <section>
        <h2 className="text-3xl font-bold text-[var(--foreground)] mb-6">About the Journal</h2>
        <div className="bg-[var(--background)] rounded-xl shadow-lg p-8 border border-[var(--border)]">
          <p className="mb-6 text-[var(--secondary-text)] text-lg leading-relaxed">
          The International Journal of Advances in Management, Technology, and Science (IJAMTS) is a peer-reviewed, open access, international journal published monthly. The journal's goal is to encourage creative research in a variety of areas that bridges the gap between prior and advanced ideas
          </p>
          <p className="mb-6 text-[var(--secondary-text)] text-lg leading-relaxed">
          IJAMTS encourages writers to submit unique and unpublished material in the form of written reviews, brief messages, and notes dealing with a variety of fields that present current research. It features a global editorial board made up of accomplished academics and researchers. The primary goal of IJAMTS is to disseminate new knowledge and technology in order to advance academic and research experts in many study areas. The magazine also welcomes properly written reviews, brief messages, and remarks on the many subjects covered by the fields. We accept longer versions of works that have previously appeared in conferences and/or publications.
          </p>
          <div className="flex flex-col md:flex-row justify-between mt-8 pt-6 border-t border-[var(--border)]">
            <div className="mb-4 md:mb-0">
              <h3 className="font-semibold text-[var(--foreground)]">Frequency</h3>
              <p className="text-[var(--secondary-text)]">12 Issues per Year</p>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--foreground)]">Accepted Language</h3>
              <p className="text-[var(--secondary-text)]">English</p>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--foreground)]">ISSN</h3>
              <p className="text-[var(--secondary-text)]">2582-7359</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call for Papers */}
      <section>
        <h2 className="text-3xl font-bold text-[var(--foreground)] mb-6">Call for Papers</h2>
        <div className="bg-[var(--background)] rounded-xl shadow-lg p-8 border border-[var(--border)]">
          <p className="mb-6 text-[var(--secondary-text)] text-lg leading-relaxed">
            The International Journal of Advances in Management, Technology, and
            Science (IJAMTS) (ISSN 2582-7359) invites you to submit your study
            using our online submission system or by email at editor@ijamts.com.
            Ensure that the submitted paper has not already been submitted or
            published elsewhere for publication. It is strongly encouraged to
            submit original, plagiarism-free articles solely for consideration;
            otherwise, they will be rejected without answer. All accepted
            submissions will undergo Double Blind Peer Review, with the ultimate
            choice based on high quality, creativity, and new contribution to
            existing knowledge.
          </p>
          <p className="mb-6 text-[var(--secondary-text)] text-lg leading-relaxed">
            Once your article has been submitted to the International Journal of
            Advances in Management, Technology, and Science (IJAMTS) ISSN 2582-
            7359, you are not permitted to submit or present it elsewhere unless
            it is rejected by the International Journal of Advances in
            Management, Technology, and Science (IJAMTS) 2582-7359. Accepted
            submissions will not be withdrawn or presented in any other journal,
            conference, magazine, or media without the prior consent of the
            International Journal of Advances in Management, Technology, and
            Science (IJAMTS) (ISSN 2582-7359).
          </p>
          
          <div className="mt-8 text-center">
            <a 
              href="/submission" 
              className="inline-block px-8 py-4 bg-[var(--accent)] text-white text-lg font-medium rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Submit Your Paper
            </a>
          </div>
        </div>
      </section>
    </div>
  );
} 