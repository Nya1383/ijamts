import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - IJAMTS",
  description: "Contact the International Journal of Advanced Methods in Technology Studies team",
};

export default function ContactPage() {
  return (
    <div className="container py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Contact Info Section */}
        <div className="lg:w-1/2">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">CONTACT INFO</h2>
          
          <p className="text-[var(--secondary-text)] mb-6">
            If you have any questions or enquiries please feel free to contact us at the following, or fill out the contact form.
          </p>
          
          <div className="mb-6">
            <h3 className="text-[var(--foreground)] font-semibold mb-2">Address:</h3>
            <p className="text-[var(--secondary-text)]">
              International Journal of Advanced Methods in Technology Studies<br />
              70, Om Vihar, Phase-3, Uttam Nagar West<br />
              New Delhi-110059
            </p>
          </div>

          <div className="flex items-center mb-4">
            <div className="mr-4 text-[var(--accent)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-[var(--secondary-text)]">editor.manuscript1@gmail.com</span>
          </div>

          <div className="flex items-center">
            <div className="mr-4 text-[var(--accent)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span className="text-[var(--secondary-text)]">Mobile Number: +91-89504-48770</span>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="lg:w-1/2">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">CONTACT INFO</h2>
          
          <form className="space-y-4">
            <div>
              <input 
                type="text" 
                placeholder="Your Name" 
                className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
            
            <div>
              <input 
                type="email" 
                placeholder="Your Email" 
                className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
            
            <div>
              <input 
                type="tel" 
                placeholder="Phone Number" 
                className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
            
            <div>
              <textarea 
                placeholder="Your Message" 
                rows={6}
                className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded resize-none focus:outline-none focus:border-[var(--accent)]"
              ></textarea>
            </div>
            
            <div>
              <button 
                type="submit"
                className="bg-[var(--accent)] text-gray-800 py-3 px-6 rounded hover:bg-opacity-90 transition-colors"
              >
                SEND EMAIL
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 