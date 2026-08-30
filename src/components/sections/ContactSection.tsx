"use client";

import { useSiteConfig } from "@/components/providers/SiteConfigProvider";
import { useState } from "react";

/**
 * Contact as a split: the ask on the left, the form on the right.
 *
 * Submit logic is unchanged — same state, same POST to /api/contact, same status
 * handling. Only the layout and the field chrome are rewritten.
 */
export function ContactSection() {
  const siteConfig = useSiteConfig();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const getFieldConfig = (fieldName: string) => {
    const field = siteConfig.contact.form.fields?.[fieldName];
    return field || { label: fieldName.charAt(0).toUpperCase() + fieldName.slice(1), placeholder: `Enter ${fieldName}` };
  };

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

  const info = siteConfig.contact?.contactInfo;
  const availability = siteConfig.contact?.availability;
  const form = siteConfig.contact?.form;

  const field = (name: "name" | "email" | "subject" | "message") => {
    const cfg = getFieldConfig(name);
    const shared =
      "w-full border-2 border-border bg-card px-4 py-3 text-[15px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-brand";
    return (
      <div key={name}>
        <label
          htmlFor={`contact-${name}`}
          className="mb-2 block font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground"
        >
          {cfg.label}
        </label>
        {name === "message" ? (
          <textarea
            id={`contact-${name}`}
            name={name}
            rows={5}
            required
            value={formData[name]}
            onChange={handleChange}
            placeholder={cfg.placeholder}
            className={`${shared} resize-y`}
          />
        ) : (
          <input
            id={`contact-${name}`}
            name={name}
            type={name === "email" ? "email" : "text"}
            required={name !== "subject"}
            value={formData[name]}
            onChange={handleChange}
            placeholder={cfg.placeholder}
            className={shared}
          />
        )}
      </div>
    );
  };

  return (
    <section id="contact" className="px-6 py-16 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="inline-block border-2 border-border bg-brand px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--brand-ink)]">
              Contact
            </p>
            <h2 className="mt-3 max-w-[16ch] text-[2rem] md:text-5xl">
              {siteConfig.contact?.title}
            </h2>
            {siteConfig.contact?.subtitle && (
              <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-muted-foreground">
                {siteConfig.contact.subtitle}
              </p>
            )}

            <dl className="mt-10 flex flex-col">
              {info?.email && (
                <div className="border-t border-border py-4">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    Email
                  </dt>
                  <dd className="mt-1.5">
                    <a
                      href={`mailto:${info.email}`}
                      className="text-[17px] underline decoration-border underline-offset-4 transition-colors hover:decoration-brand"
                    >
                      {info.email}
                    </a>
                  </dd>
                </div>
              )}
              {info?.phone && (
                <div className="border-t border-border py-4">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    Phone
                  </dt>
                  <dd className="mt-1.5 font-mono text-[15px] text-muted-foreground">{info.phone}</dd>
                </div>
              )}
              {info?.location && (
                <div className="border-t border-border py-4">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    Based
                  </dt>
                  <dd className="mt-1.5 text-[15px] text-muted-foreground">{info.location}</dd>
                </div>
              )}
              {availability && (
                <div className="border-y border-border py-4">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    Availability
                  </dt>
                  <dd className="mt-1.5 text-[15px] text-muted-foreground">
                    <span className="inline-flex items-center gap-2.5 text-foreground">
                      <span className="h-3 w-3 border-2 border-border bg-brand" aria-hidden />
                      {availability.status}
                    </span>
                    {availability.responseTime && (
                      <span className="mt-1 block">{availability.responseTime}</span>
                    )}
                    {availability.workingHours && (
                      <span className="block">{availability.workingHours}</span>
                    )}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              {field("name")}
              {field("email")}
            </div>
            {field("subject")}
            {field("message")}

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="nb nb-press focus-ring inline-flex min-h-[48px] items-center bg-brand px-7 font-bold text-[var(--brand-ink)] disabled:opacity-60"
              >
                {isSubmitting ? "Sending…" : (form?.submitButton ?? "Send message")}
              </button>

              {submitStatus === "success" && (
                <p role="status" className="text-sm text-brand">
                  {form?.successMessage ?? "Thanks — I'll be in touch."}
                </p>
              )}
              {submitStatus === "error" && (
                <p role="alert" className="text-sm text-red-600 dark:text-red-400">
                  {form?.errorMessage ?? "Something went wrong. Please try again."}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
