import { useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";

import { Ic } from "../components/Icons";
import PageHead from "../components/PageHead";
import SEO from "../components/SEO";
import { useSite } from "../context/SiteContext";
import { useUi } from "../context/UiContext";
import { getApiErrorMessage } from "../services/base/api";
import { ENQUIRY_TYPES, sendEnquiry, type EnquiryType } from "../services/enquiry/enquiryService";
import { firstName } from "../utils/format";

// ========================================
// FORM STATE
// ========================================

type Fields = {
  name: string;
  email: string;
  phone: string;
  type: EnquiryType;
  message: string;
  consent: boolean;
};

type Checked = "name" | "email" | "message" | "consent";

const RULES: Record<Checked, (fields: Fields) => boolean> = {
  name: (fields) => fields.name.trim().length > 1,
  email: (fields) => /^\S+@\S+\.\S+$/.test(fields.email),
  message: (fields) => fields.message.trim().length > 3,
  consent: (fields) => fields.consent,
};

const FIELD_IDS: Record<Checked, string> = { name: "f1", email: "f2", message: "f5", consent: "f6" };

function initialFields(params: URLSearchParams): Fields {
  const type = params.get("type");
  const product = params.get("product");
  const role = params.get("role");

  return {
    name: "",
    email: "",
    phone: "",
    type: ENQUIRY_TYPES.includes(type as EnquiryType) ? (type as EnquiryType) : "General enquiry",
    message: product ? `Enquiry about ${product}: ` : role ? `Application for ${role}: ` : "",
    consent: false,
  };
}

// ========================================
// FORM
// ========================================

function ContactForm({ onSent }: { onSent: (name: string, reference: string) => void }) {
  const { contact } = useSite();
  const { toast } = useUi();
  const [params] = useSearchParams();

  const [fields, setFields] = useState<Fields>(() => initialFields(params));
  // A field shows its error once it has
  // been left, or after a submit attempt.
  const [touched, setTouched] = useState<Partial<Record<Checked, boolean>>>({});
  const [sending, setSending] = useState(false);

  const formRef = useRef<HTMLFormElement | null>(null);

  const product = params.get("product") ?? undefined;

  const set = <K extends keyof Fields>(key: K, value: Fields[K]) =>
    setFields((previous) => ({ ...previous, [key]: value }));

  const touch = (key: Checked) => setTouched((previous) => ({ ...previous, [key]: true }));

  const fieldClass = (key: Checked, isCheckbox = false) => {
    const good = RULES[key](fields);
    const shown = touched[key];
    if (shown && !good) return "field bad";
    if (good && !isCheckbox) return "field ok";
    return "field";
  };

  const invalid = (key: Checked) => Boolean(touched[key] && !RULES[key](fields));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setTouched({ name: true, email: true, message: true, consent: true });

    const firstBad = (Object.keys(RULES) as Checked[]).find((key) => !RULES[key](fields));
    if (firstBad) {
      formRef.current?.querySelector<HTMLElement>(`#${FIELD_IDS[firstBad]}`)?.focus();
      return;
    }

    try {
      setSending(true);
      const { reference } = await sendEnquiry({
        name: fields.name.trim(),
        email: fields.email.trim(),
        phone: fields.phone.trim(),
        type: fields.type,
        message: fields.message.trim(),
        product,
      });
      onSent(fields.name, reference);
    } catch (error) {
      toast(getApiErrorMessage(error, "Your enquiry could not be sent. Please try again."));
      setSending(false);
    }
  };

  return (
    <form id="cform" noValidate ref={formRef} onSubmit={handleSubmit}>
      <div className="fgrid">
        <div className={fieldClass("name")}>
          <label htmlFor="f1">Full name *</label>
          <input
            id="f1"
            name="name"
            placeholder="Your full name"
            required
            value={fields.name}
            aria-invalid={invalid("name")}
            onChange={(event) => set("name", event.target.value)}
            onBlur={() => touch("name")}
          />
          <div className="err">Enter your full name.</div>
        </div>

        <div className={fieldClass("email")}>
          <label htmlFor="f2">Email address *</label>
          <input
            id="f2"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            value={fields.email}
            aria-invalid={invalid("email")}
            onChange={(event) => set("email", event.target.value)}
            onBlur={() => touch("email")}
          />
          <div className="err">Enter a valid email address.</div>
        </div>

        <div className="field">
          <label htmlFor="f3">Phone number</label>
          <input
            id="f3"
            placeholder="Optional"
            value={fields.phone}
            onChange={(event) => set("phone", event.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="f4">Enquiry type</label>
          <select id="f4" value={fields.type} onChange={(event) => set("type", event.target.value as EnquiryType)}>
            {ENQUIRY_TYPES.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className={`${fieldClass("message")} full`}>
          <label htmlFor="f5">Message *</label>
          <textarea
            id="f5"
            name="msg"
            placeholder="Please provide the relevant details"
            required
            value={fields.message}
            aria-invalid={invalid("message")}
            onChange={(event) => set("message", event.target.value)}
            onBlur={() => touch("message")}
          />
          <div className="err">Add a short message.</div>
        </div>

        <div className={`${fieldClass("consent", true)} full`}>
          <label className="check">
            <input
              type="checkbox"
              id="f6"
              required
              checked={fields.consent}
              aria-invalid={invalid("consent")}
              onChange={(event) => {
                set("consent", event.target.checked);
                touch("consent");
              }}
            />{" "}
            I acknowledge that my information will be used to respond to this enquiry.
          </label>
          <div className="err">Tick the box to continue.</div>
        </div>

        <div className="full">
          <button className={`btn btn-primary${sending ? " loading" : ""}`} type="submit" disabled={sending}>
            {sending ? (
              <>
                <span className="spinner" aria-hidden="true"></span>Sending…
              </>
            ) : (
              <>
                Send enquiry <Ic name="arrow" />
              </>
            )}
          </button>
          {contact.formNote && <p className="form-note">{contact.formNote}</p>}
        </div>
      </div>
    </form>
  );
}

// ========================================
// PAGE
// ========================================

export default function Contact() {
  const { contact, general } = useSite();

  const [sent, setSent] = useState<{ name: string; reference: string } | null>(null);
  // Remounts a fresh form for "Send another".
  const [formKey, setFormKey] = useState(0);

  const successText = contact.successText
    .replace("{name}", firstName(sent?.name ?? ""))
    .replace("{reference}", sent?.reference ?? "");

  return (
    <>
      <SEO title="Contact" description={contact.head.lead} />

      <PageHead crumb="Contact" eyebrow={contact.head.eyebrow} title={contact.head.title} lead={contact.head.lead} />

      <section className="bg-white">
        <div className="sec-wrap split" style={{ alignItems: "start" }}>
          <div>
            <div className="eyebrow">{contact.eyebrow}</div>
            <h2>{contact.title}</h2>
            <p className="lead">{contact.lead}</p>
            <div className="office">
              <small>Head office</small>
              <b>{general.officeAddress}</b>
              {general.phone || general.email ? (
                <p style={{ fontSize: 14, lineHeight: 1.8 }}>
                  {general.phone && (
                    <a href={`tel:${general.phone.replace(/[^\d+]/g, "")}`} style={{ color: "var(--blue)" }}>
                      {general.phone}
                    </a>
                  )}
                  {general.phone && general.email && <br />}
                  {general.email && (
                    <a href={`mailto:${general.email}`} style={{ color: "var(--blue)" }}>
                      {general.email}
                    </a>
                  )}
                </p>
              ) : (
                general.contactPendingText && <span className="pending">{general.contactPendingText}</span>
              )}
            </div>
          </div>

          <div className="form-card" id="formCard">
            {sent ? (
              <div className="success">
                <span className="round">
                  <Ic name="check" />
                </span>
                <h3 style={{ fontSize: "1.3rem" }}>Enquiry sent</h3>
                <p className="lead" style={{ margin: "8px auto 20px" }}>
                  {successText}
                </p>
                <button
                  className="btn btn-ghost"
                  autoFocus
                  onClick={() => {
                    setSent(null);
                    setFormKey((key) => key + 1);
                  }}
                >
                  Send another enquiry
                </button>
              </div>
            ) : (
              <ContactForm key={formKey} onSent={(name, reference) => setSent({ name, reference })} />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
