import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const staticRoutes = [
    "",
    "/services",
    "/bridal",
    "/mehendi",
    "/gallery",
    "/stylists",
    "/book",
    "/quiz",
    "/try-on",
    "/lookboard",
    "/reviews",
    "/offers",
    "/memberships",
    "/blog",
    "/about",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  return staticRoutes;
}
