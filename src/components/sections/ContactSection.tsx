"use client";

import { useState } from "react";
import { SITE_DATA } from "@/config";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // Reset form on success
        setFormData({ name: "", email: "", subject: "", message: "" });
        setSubmitStatus('success');
        setTimeout(() => setSubmitStatus('idle'), 5000); // Hide success message after 5 seconds
      } else {
        setSubmitStatus('error');
        console.error('Form submission error:', result.error);
      }
    } catch (error) {
      setSubmitStatus('error');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Email",
      value: SITE_DATA.contact.contactInfo.email,
      link: `mailto:${SITE_DATA.contact.contactInfo.email}`
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Location",
      value: SITE_DATA.contact.contactInfo.location,
      link: null
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Response Time",
      value: SITE_DATA.contact.availability.responseTime,
      link: null
    }
  ];

  return (
    <section id="contact" className="py-24 px-6 bg-gray-50/60 dark:bg-slate-50/10">
      <div className="container mx-auto max-w-6xl">
        <div className="space-y-16">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient">{SITE_DATA.contact.title}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {SITE_DATA.contact.subtitle}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold">Send a Message</h3>
                <p className="text-muted-foreground">
                  Fill out the form below and I&apos;ll get back to you as soon as possible.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      {SITE_DATA.contact.form.fields.name.label} *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                      placeholder={SITE_DATA.contact.form.fields.name.placeholder}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      {SITE_DATA.contact.form.fields.email.label} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                      placeholder={SITE_DATA.contact.form.fields.email.placeholder}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    {SITE_DATA.contact.form.fields.subject.label} *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                    placeholder={SITE_DATA.contact.form.fields.subject.placeholder}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    {SITE_DATA.contact.form.fields.message.label} *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 resize-none"
                    placeholder={SITE_DATA.contact.form.fields.message.placeholder}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 bg-gradient text-primary-foreground rounded-lg font-semibold hover-lift focus-ring disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isSubmitting ? "Sending..." : SITE_DATA.contact.form.submitButton}
                </button>
                
                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-green-800 dark:text-green-200 font-medium">
                        {SITE_DATA.contact.form.successMessage}
                      </p>
                    </div>
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <p className="text-red-800 dark:text-red-200 font-medium">
                        {SITE_DATA.contact.form.errorMessage}
                      </p>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold">Contact Information</h3>
                <p className="text-muted-foreground">
                  Prefer to reach out directly? Here are the best ways to contact me.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-medium">{item.title}</h4>
                      {item.link ? (
                        <a
                          href={item.link}
                          className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-muted-foreground">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="space-y-4 pt-8 border-t border-border">
                <h4 className="font-semibold">Follow Me</h4>
                <div className="flex space-x-4">
                  {SITE_DATA.contact.socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-accent transition-colors duration-200 focus-ring"
                      aria-label={link.name}
                    >
                      <span className="text-lg">{link.icon}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Response Note */}
              <div className="p-6 bg-card border border-border rounded-xl">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium">{SITE_DATA.contact.availability.status}</h4>
                    <p className="text-sm text-muted-foreground">
                      {SITE_DATA.contact.availability.responseTime}. {SITE_DATA.contact.availability.workingHours}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}