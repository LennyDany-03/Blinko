import type { Metadata } from "next";

const SITE_URL = "https://blinko.site";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
};

export function createPageMetadata({
  title,
  description,
  path,
}: PageMetadataOptions): Metadata {
  const url = `${SITE_URL}${path}`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Blinko`,
      description,
      url,
      siteName: "Blinko",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Blinko`,
      description,
    },
  };
}
