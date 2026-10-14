import { Helmet } from "react-helmet-async";

// The page's <title> and description.
// Home is "G.D. Pharmaceuticals — …";
// every other page is "<Page> — G.D.
// Pharmaceuticals", as in the design.
type SEOProps = {
  title: string;
  description?: string;
  home?: boolean;
};

export default function SEO({ title, description, home = false }: SEOProps) {
  return (
    <Helmet>
      <title>{home ? `G.D. Pharmaceuticals — ${title}` : `${title} — G.D. Pharmaceuticals`}</title>
      {description && <meta name="description" content={description} />}
    </Helmet>
  );
}
