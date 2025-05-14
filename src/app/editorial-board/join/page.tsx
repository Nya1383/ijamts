"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function JoinAsReviewerPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    salutation: "",
    name: "",
    qualification: "",
    designation: "",
    department: "",
    organization: "",
    disciplineField: "",
    researchAreas: "",
    orcid: "",
    email: "",
    mobileNumber: "",
    country: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation for required fields
    const requiredFields = ['salutation', 'name', 'qualification', 'designation', 'organization', 'disciplineField', 'email', 'mobileNumber', 'country'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0 || !file) {
      toast.error("Please fill all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Mobile number validation (basic)
    const phoneRegex = /^\+?[0-9\s\-()]{8,20}$/;
    if (!phoneRegex.test(formData.mobileNumber)) {
      toast.error("Please enter a valid mobile number");
      return;
    }

    // File size validation (max 5MB)
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real implementation, you would upload the file to storage
      // and save the form data to your database
      
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Application submitted successfully!");
      
      // Reset form after successful submission
      setFormData({
        salutation: "",
        name: "",
        qualification: "",
        designation: "",
        department: "",
        organization: "",
        disciplineField: "",
        researchAreas: "",
        orcid: "",
        email: "",
        mobileNumber: "",
        country: "",
      });
      setFile(null);
      
      // Redirect to thank you page or home page
      // router.push("/editorial-board/join/thank-you");
      
    } catch (error) {
      console.error("Error submitting reviewer application:", error);
      toast.error("Failed to submit application. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Arrays for dropdown options
  const salutations = ["Select Salutation", "Dr.", "Prof.", "Mr.", "Mrs.", "Ms."];
  const countries = [
    "Select Country", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", 
    "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", 
    "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", 
    "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", 
    "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", 
    "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", 
    "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", 
    "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", 
    "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", 
    "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", 
    "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", 
    "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", 
    "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", 
    "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", 
    "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", 
    "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", 
    "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", 
    "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
  ];
  const disciplineFields = [
    "Select Discipline Field", "Management", "Technology", "Science", "Computer Science", "Information Technology", 
    "Business Administration", "Economics", "Engineering", "Environmental Science", "Social Sciences", "Humanities", 
    "Mathematics", "Physics", "Chemistry", "Biology", "Medicine", "Education", "Law", "Political Science", "Psychology", "Other"
  ];

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Join as a Reviewer</h1>
        <p className="text-[var(--secondary-text)] mb-8">
          Thank you for your interest in joining the IJAMTS editorial board as a reviewer. 
          Please complete the form below to apply.
        </p>

        <div className="bg-[var(--background)] rounded-xl shadow-lg p-8 border border-[var(--border)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="salutation" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Salutation <span className="text-red-500">*</span>
              </label>
              <select
                id="salutation"
                name="salutation"
                value={formData.salutation}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[var(--border)] rounded-md bg-[var(--input-background)] text-[var(--foreground)]"
              >
                {salutations.map((item, index) => (
                  <option key={index} value={index === 0 ? "" : item} disabled={index === 0}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[var(--border)] rounded-md bg-[var(--input-background)] text-[var(--foreground)]"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="qualification" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Qualification <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="qualification"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[var(--border)] rounded-md bg-[var(--input-background)] text-[var(--foreground)]"
                placeholder="E.g., Ph.D. in Computer Science, MBA, etc."
              />
            </div>

            <div>
              <label htmlFor="designation" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Designation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[var(--border)] rounded-md bg-[var(--input-background)] text-[var(--foreground)]"
                placeholder="E.g., Professor, Associate Professor, Senior Researcher, etc."
              />
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Department
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-md bg-[var(--input-background)] text-[var(--foreground)]"
                placeholder="Enter your department"
              />
            </div>

            <div>
              <label htmlFor="organization" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Organization <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[var(--border)] rounded-md bg-[var(--input-background)] text-[var(--foreground)]"
                placeholder="Enter your university, research institute, or organization"
              />
            </div>

            <div>
              <label htmlFor="disciplineField" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Discipline Field <span className="text-red-500">*</span>
              </label>
              <select
                id="disciplineField"
                name="disciplineField"
                value={formData.disciplineField}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[var(--border)] rounded-md bg-[var(--input-background)] text-[var(--foreground)]"
              >
                {disciplineFields.map((field, index) => (
                  <option key={index} value={index === 0 ? "" : field} disabled={index === 0}>
                    {field}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="researchAreas" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Research Area(s)
              </label>
              <textarea
                id="researchAreas"
                name="researchAreas"
                value={formData.researchAreas}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-md bg-[var(--input-background)] text-[var(--foreground)]"
                placeholder="List your main research areas (comma separated)"
              />
            </div>

            <div>
              <label htmlFor="orcid" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                ORCID
              </label>
              <input
                type="text"
                id="orcid"
                name="orcid"
                value={formData.orcid}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-md bg-[var(--input-background)] text-[var(--foreground)]"
                placeholder="E.g., 0000-0002-1825-0097"
              />
              <p className="mt-1 text-xs text-[var(--secondary-text)]">
                Format: 0000-0000-0000-0000
              </p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[var(--border)] rounded-md bg-[var(--input-background)] text-[var(--foreground)]"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[var(--border)] rounded-md bg-[var(--input-background)] text-[var(--foreground)]"
                placeholder="Include country code (e.g., +1 555 123 4567)"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[var(--border)] rounded-md bg-[var(--input-background)] text-[var(--foreground)]"
              >
                {countries.map((country, index) => (
                  <option key={index} value={index === 0 ? "" : country} disabled={index === 0}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="cv" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Upload CV/Resume <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                id="cv"
                name="cv"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                required
                className="w-full px-4 py-2 border border-[var(--border)] rounded-md bg-[var(--input-background)] text-[var(--foreground)]"
              />
              <p className="mt-1 text-xs text-[var(--secondary-text)]">
                Accepted file formats: PDF, DOC, DOCX (max 5MB)
              </p>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-6 py-3 bg-[var(--accent)] text-white text-lg font-medium rounded-md transition-colors ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-opacity-90"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 