import PageHead from "../components/PageHead";
import SEO from "../components/SEO";
import { useApi } from "../hooks/useApi";
import { getLegalPage } from "../services/legal/legalService";
import { formatDate } from "../utils/format";

// Privacy and Disclaimer: plain text
// from the staff portal, a blank line
// between paragraphs.
export default function Legal({ slug, fallbackTitle }: { slug: string; fallbackTitle: string }) {
  const { data: page, loading } = useApi(() => getLegalPage(slug), [slug]);

  const title = page?.title ?? fallbackTitle;
  const paragraphs = (page?.content ?? "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <>
      <SEO title={title} />

      <PageHead
        crumb={title}
        eyebrow="Legal"
        title={title}
        lead={page ? `Last updated ${formatDate(page.updatedAt)}` : loading ? "" : "This page is being prepared."}
      />

      <section className="bg-white">
        <div className="sec-wrap" style={{ maxWidth: 820 }}>
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="lead" style={{ maxWidth: "none", whiteSpace: "pre-line" }}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>
    </>
  );
}
