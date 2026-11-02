import type { MetadataRoute } from "next";
import { articleHref, articles } from "@/lib/journal";
import { projectHref, siteUrl, visibleProjects } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    ...visibleProjects.map((project) => ({
      url: `${siteUrl}${projectHref(project)}`,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    { url: `${siteUrl}/journal`, changeFrequency: "monthly", priority: 0.6 },
    ...articles.map((article) => ({
      url: `${siteUrl}${articleHref(article)}`,
      lastModified: article.date,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
