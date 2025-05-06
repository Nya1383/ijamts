export default function MainContent() {
  return (
    <div className="space-y-10">
      {/* About the Journal */}
      <section>
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">About the Journal</h2>
        <div className="bg-[var(--background)] rounded-lg shadow-sm p-6 border border-[var(--border)]">
          <p className="mb-4 text-[var(--secondary-text)]">
            The International Journal of Advances in Management, Technology and Science (IJAMTS) is a peer-reviewed, open-access journal
            that publishes original research articles, review papers, short communications, and technical notes in all
            areas of science, engineering, and technology.
          </p>
          <p className="mb-4 text-[var(--secondary-text)]">
            Founded in 2015, IJAMTS has established itself as a platform for researchers, academics, and industry
            professionals to share their findings and innovations. The journal maintains a rigorous peer-review process
            to ensure the quality and validity of published work.
          </p>
          <p className="text-[var(--secondary-text)]">
            IJAMTS is published quarterly (March, June, September, and December) and accepts submissions year-round from
            researchers worldwide.
          </p>
        </div>
      </section>

      {/* Call for Papers */}
      <section>
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Call for Papers</h2>
        <div className="bg-[var(--background)] rounded-lg shadow-sm p-6 border border-[var(--border)]">
          <p className="mb-4 text-[var(--secondary-text)]">
            IJAMTS invites researchers, academics, and professionals to submit original and unpublished research work for
            our upcoming issues. We welcome submissions in the following fields:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <ul className="list-disc list-inside text-[var(--secondary-text)] space-y-1">
              <li>Computer Science & Information Technology</li>
              <li>Electrical & Electronics Engineering</li>
              <li>Mechanical & Manufacturing Engineering</li>
              <li>Civil Engineering & Architecture</li>
              <li>Materials Science & Engineering</li>
            </ul>
            <ul className="list-disc list-inside text-[var(--secondary-text)] space-y-1">
              <li>Biotechnology & Biomedical Engineering</li>
              <li>Environmental Science & Engineering</li>
              <li>Chemistry & Chemical Engineering</li>
              <li>Physics & Applied Mathematics</li>
              <li>Interdisciplinary Research</li>
            </ul>
          </div>
          <p className="mb-4 text-[var(--secondary-text)]">
            <strong>Submission Deadline for Next Issue:</strong> August 15, 2023
          </p>
          <a href="/submission" className="btn btn-outline">
            Submit Your Paper
          </a>
        </div>
      </section>

      {/* Journal Features */}
      <section>
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Journal Features</h2>
        <div className="bg-[var(--background)] rounded-lg shadow-sm p-6 border border-[var(--border)]">
          <ul className="space-y-4">
            <li className="flex items-start space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[var(--accent)] flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h4 className="font-semibold text-lg text-[var(--foreground)]">Peer-Reviewed</h4>
                <p className="text-[var(--secondary-text)]">
                  All submissions undergo a rigorous double-blind peer-review process by at least two experts in the field.
                </p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[var(--accent)] flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h4 className="font-semibold text-lg text-[var(--foreground)]">Open Access</h4>
                <p className="text-[var(--secondary-text)]">
                  All published articles are freely accessible online without any subscription or registration barriers.
                </p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[var(--accent)] flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h4 className="font-semibold text-lg text-[var(--foreground)]">Rapid Publication</h4>
                <p className="text-[var(--secondary-text)]">
                  Efficient review process with decisions typically communicated within 4-6 weeks of submission.
                </p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[var(--accent)] flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h4 className="font-semibold text-lg text-[var(--foreground)]">Digital Object Identifier (DOI)</h4>
                <p className="text-[var(--secondary-text)]">
                  Each published article is assigned a unique DOI for persistent citation and accessibility.
                </p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[var(--accent)] flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h4 className="font-semibold text-lg text-[var(--foreground)]">Indexed</h4>
                <p className="text-[var(--secondary-text)]">
                  The journal is indexed in major academic databases, increasing the visibility and impact of published work.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Aim and Scope */}
      <section>
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Aim and Scope</h2>
        <div className="bg-[var(--background)] rounded-lg shadow-sm p-6 border border-[var(--border)]">
          <p className="mb-4 text-[var(--secondary-text)]">
            The primary aim of IJAMTS is to provide a platform for researchers, practitioners, and innovators to share
            cutting-edge research and technological developments that contribute to solving real-world problems and
            advancing knowledge in various disciplines.
          </p>
          <p className="mb-4 text-[var(--secondary-text)]">
            The journal's scope encompasses, but is not limited to:
          </p>
          <ul className="list-disc list-inside text-[var(--secondary-text)] space-y-2 mb-4">
            <li>
              <strong>Innovative Research:</strong> Original research that advances the theoretical or practical understanding in
              science, engineering, and technology.
            </li>
            <li>
              <strong>Interdisciplinary Studies:</strong> Work that bridges multiple disciplines to address complex problems and
              challenges.
            </li>
            <li>
              <strong>Emerging Technologies:</strong> Research on cutting-edge technologies and their applications in various
              fields.
            </li>
            <li>
              <strong>Sustainable Solutions:</strong> Studies focused on environmentally sustainable technologies and practices.
            </li>
            <li>
              <strong>Industry Applications:</strong> Research with direct industrial applications and implications.
            </li>
          </ul>
          <p className="text-[var(--secondary-text)]">
            We especially encourage submissions that demonstrate innovation, practical significance, and potential for
            societal impact.
          </p>
        </div>
      </section>

      {/* Open Access Statement */}
      <section>
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Open Access Statement</h2>
        <div className="bg-[var(--background)] rounded-lg shadow-sm p-6 border border-[var(--border)]">
          <p className="mb-4 text-[var(--secondary-text)]">
            IJAMTS is committed to the principles of open science and knowledge sharing. All articles published in our
            journal are freely available online immediately upon publication, without subscription fees or registration
            barriers.
          </p>
          <p className="mb-4 text-[var(--secondary-text)]">
            Authors retain copyright of their work and grant IJAMTS a license to publish the article and identify itself
            as the original publisher. Published articles are distributed under the Creative Commons Attribution License
            (CC BY 4.0), which permits unrestricted use, distribution, and reproduction in any medium, provided the
            original work is properly cited.
          </p>
          <p className="text-[var(--secondary-text)]">
            To cover the costs of providing our services, IJAMTS charges an Article Processing Charge (APC) for each
            article accepted for publication. For details about our current APC fees and available waivers, please see
            our Publication Charges page.
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <section>
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Disclaimer</h2>
        <div className="bg-[var(--background)] rounded-lg shadow-sm p-6 border border-[var(--border)]">
          <p className="mb-4 text-[var(--secondary-text)]">
            The views and opinions expressed in articles published in IJAMTS are those of the authors and do not
            necessarily reflect the official policy or position of the journal, its editors, the publisher, or any
            affiliated institutions.
          </p>
          <p className="mb-4 text-[var(--secondary-text)]">
            While the journal makes every effort to ensure the accuracy of all published information, we cannot guarantee
            the completeness, reliability, or absolute accuracy of the information provided in the articles. Readers are
            advised to independently verify any information before relying on it.
          </p>
          <p className="text-[var(--secondary-text)]">
            The mention of specific companies, products, or services in any article does not imply endorsement by the
            journal. The journal assumes no responsibility for any damage or injury to persons or property arising out of
            the use of any materials, instructions, methods, or ideas contained in the journal.
          </p>
        </div>
      </section>
    </div>
  );
} 