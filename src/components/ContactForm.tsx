"use client";

import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      email: "",
      message: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    try {
      // In a real application, you would send this data to your backend
      // await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">CONTACT INFO</h2>
      
      {submitSuccess ? (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded mb-6">
          Thank you for your message! We will get back to you as soon as possible.
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input 
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name" 
              className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--accent)]"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          
          <div>
            <input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email" 
              className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--accent)]"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          
          <div>
            <input 
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number" 
              className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
          
          <div>
            <textarea 
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message" 
              rows={6}
              className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded resize-none focus:outline-none focus:border-[var(--accent)]"
            ></textarea>
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message}</p>
            )}
          </div>
          
          <div>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-[var(--accent)] text-gray-800 py-3 px-6 rounded hover:bg-opacity-90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "SENDING..." : "SEND EMAIL"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 