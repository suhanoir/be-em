import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, User, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { formatInKolkata } from "@/lib/timezone";

export const metadata = {
  title: "Beauty Blog, Haircare & Bridal Prep Guides | BEEM (Beauty Empire)",
  description: "Expert advice from celebrity makeup artists and master colorists on bridal glow, organic henna care, and balayage maintenance.",
};

export default async function BlogPage() {
  const posts = await db.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="py-12 bg-[#FAF7FD] dark:bg-[#0F081D] min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold tracking-widest text-brand-violet uppercase">
            Artisan Insights
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-brand-ink dark:text-white mt-1">
            The BEEM Beauty Journal
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-2">
            Curated care advice, bridal timelines, and styling secrets directly from our senior master artisans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group rounded-3xl overflow-hidden bg-white dark:bg-[#1A102F] border border-purple-100 dark:border-purple-900 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 text-[11px] text-brand-muted mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-brand-violet" />
                      {post.readingTimeMinutes} min read
                    </span>
                    <span>•</span>
                    <span>{formatInKolkata(post.publishedAt, "MMM dd, yyyy")}</span>
                  </div>

                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="font-heading text-xl font-bold text-brand-ink dark:text-white group-hover:text-brand-violet transition-colors leading-snug">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="text-xs text-brand-muted line-clamp-3 mt-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-royal dark:text-brand-orchid hover:underline"
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
