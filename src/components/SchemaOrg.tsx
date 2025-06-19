import Script from "next/script";

export default function SchemaOrg() {
  const currentYear = new Date().getFullYear();
  
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Periodical",
    "name": "International Journal of Advances in Management, Technology and Science",
    "alternateName": "IJAMTS",
    "issn": "2456-0944",
    "description": "A peer-reviewed, open access journal dedicated to publishing high-quality research in various fields of science and technology.",
    "publisher": {
      "@type": "Organization",
      "name": "xxxxxxx",
      "logo": {
        "@type": "ImageObject",
        "url": "https://example.com/logo.svg"
      }
    },
    "url": "https://example.com",
    "mainEntityOfPage": "https://example.com",
    "accessibilityControl": "fullKeyboardControl",
    "accessibilityFeature": ["largePrint", "highContrast", "readingOrder"],
    "accessibilityHazard": "noFlashingHazard",
    "inLanguage": "en",
    "copyrightYear": currentYear,
    "copyrightHolder": {
      "@type": "Organization",
      "name": "xxxxxxx"
    },
    "license": "https://creativecommons.org/licenses/by/4.0/"
  };

  return (
    <Script
      id="schema-org"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
} 