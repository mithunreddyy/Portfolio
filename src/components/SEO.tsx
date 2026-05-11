import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: string;
  image?: string;
  schema?: object;
}

export function SEO({ 
  title = "Mithun Reddy", 
  description = "Full-Stack Software Engineer & AI Enthusiast with 2+ years of experience in designing scalable web architectures and machine learning pipelines.",
  canonical = "https://mithunr.vercel.app", 
  type = "website",
  image = "https://mithunr.vercel.app/og-image.png",
  schema
}: SEOProps) {
  const siteTitle = title.includes("Mithun Reddy") ? title : `${title} | Mithun Reddy`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonical} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}

      {/* Accessibility & Theme */}
      <meta name="robots" content="index, follow" />
    </Helmet>
  );
}
