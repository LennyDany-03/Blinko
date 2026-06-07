"use client";

import { useState, type FormEvent } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  User,
} from "lucide-react";
import { validateEmail, validateDisplayName } from "@/lib/validation";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type ToastState = {
  type: "success" | "error";
  message: string;
} | null;

const initialForm: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

function validateSubject(subject: string): { isValid: boolean; message?: string; cleanValue?: string } {
  const cleanSubject = subject.trim();
  if (!cleanSubject) {
    return { isValid: false, message: "Subject is required." };
  }
  if (cleanSubject.length > 120) {
    return { isValid: false, message: "Subject cannot exceed 120 characters." };
  }
  return { isValid: true, cleanValue: cleanSubject };
}

function validateMessageBody(message: string): { isValid: boolean; message?: string; cleanValue?: string } {
  const cleanMessage = message.trim();
  if (!cleanMessage) {
    return { isValid: false, message: "Message is required." };
  }
  if (cleanMessage.length > 2000) {
    return { isValid: false, message: "Message cannot exceed 2000 characters." };
  }
  return { isValid: true, cleanValue: cleanMessage };
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 5000);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nameVal = validateDisplayName(form.name);
    if (!nameVal.isValid) {
      showToast("error", nameVal.message ?? "Invalid name.");
      return;
    }

    const emailVal = validateEmail(form.email);
    if (!emailVal.isValid) {
      showToast("error", emailVal.message ?? "Invalid email.");
      return;
    }

    const subjectVal = validateSubject(form.subject);
    if (!subjectVal.isValid) {
      showToast("error", subjectVal.message ?? "Invalid subject.");
      return;
    }

    const messageVal = validateMessageBody(form.message);
    if (!messageVal.isValid) {
      showToast("error", messageVal.message ?? "Invalid message.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameVal.cleanValue,
          email: emailVal.cleanValue,
          subject: subjectVal.cleanValue,
          message: messageVal.cleanValue,
        }),
      });

      const data = (await response.json()) as { success: boolean; message?: string };

      if (!response.ok || !data.success) {
        throw new Error(data.message ?? "Failed to send message.");
      }

      setForm(initialForm);
      showToast("success", "Message sent! We'll get back to you within 24–48 hours.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong. Please try again.";
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      {toast && (
        <div
          role="alert"
          className={`fixed bottom-5 right-5 z-50 flex max-w-sm items-start gap-2.5 rounded-xl border px-4 py-3 text-sm shadow-2xl animate-in fade-in slide-in-from-bottom-4 ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <ContactField
          label="Name"
          icon={User}
          type="text"
          placeholder="Your full name"
          value={form.name}
          onChange={(value) => updateField("name", value)}
          disabled={loading}
          required
        />
        <ContactField
          label="Email"
          icon={Mail}
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(value) => updateField("email", value)}
          disabled={loading}
          required
        />
        <ContactField
          label="Subject"
          icon={MessageSquare}
          type="text"
          placeholder="How can we help?"
          value={form.subject}
          onChange={(value) => updateField("subject", value)}
          disabled={loading}
          required
        />
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Message
          </span>
          <textarea
            placeholder="Tell us more about your inquiry..."
            required
            rows={5}
            value={form.message}
            onChange={(event) => updateField("message", event.target.value)}
            disabled={loading}
            className="mt-2 w-full resize-none rounded-2xl border border-black/10 bg-white/45 px-4 py-3 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/15 disabled:opacity-50"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-white shadow-md shadow-primary/10 transition hover:bg-primary/95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </button>
      </form>
    </>
  );
}

type ContactFieldProps = {
  label: string;
  icon: typeof User;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
};

function ContactField({
  label,
  icon: Icon,
  type,
  placeholder,
  value,
  onChange,
  disabled,
  required,
}: ContactFieldProps) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
        {label}
      </span>
      <span className="mt-2 flex h-11 items-center gap-3 rounded-2xl border border-black/10 bg-white/45 px-3.5 transition focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/15">
        <Icon className="h-4 w-4 text-on-surface-variant/60" aria-hidden="true" />
        <input
          type={type}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          className="w-full bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant/30 disabled:opacity-50"
        />
      </span>
    </label>
  );
}

export function ContactInfo() {
  const details = [
    { label: "Business Name", value: "Ascendry" },
    { label: "Product", value: "Blinko" },
    {
      label: "Email",
      value: "support@blinko.app",
      href: "mailto:support@blinko.app",
    },
    { label: "Location", value: "Chennai, Tamil Nadu, India", icon: MapPin },
    { label: "Response Time", value: "24–48 Hours" },
  ] as const;

  return (
    <div className="space-y-5 rounded-[32px] border border-white/60 bg-white/40 p-6 backdrop-blur-xl shadow-[0_8px_32px_rgba(159,65,34,0.04)] sm:p-8">
      <h2 className="font-headline-md text-[22px] font-semibold text-on-surface">
        Get in Touch
      </h2>
      <dl className="space-y-4">
        {details.map((item) => (
          <div key={item.label} className="space-y-1">
            <dt className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant/70">
              {item.label}
            </dt>
            <dd className="font-body-md text-body-md text-on-surface">
              {"href" in item ? (
                <a
                  href={item.href}
                  className="font-semibold text-primary transition-colors hover:text-primary-container"
                >
                  {item.value}
                </a>
              ) : (
                <span className="flex items-center gap-1.5">
                  {"icon" in item && item.icon && (
                    <item.icon className="h-4 w-4 text-on-surface-variant/60" />
                  )}
                  {item.value}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
