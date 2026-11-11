import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronLeft, Clock, User, Calendar, Share2, Crown } from "lucide-react";
import { db } from "@/lib/db";
import { formatInKolkata } from "@/lib/timezone";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const post = await db.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post) return { title: "Article Not Found" };
  return {
    title: `${post.title} | BEEM Beauty Empire`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await db.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post) notFound();

  return (
    <div className="py-12 bg-[#FAF7FD] dark:bg-[#0F081D] min-h-screen">
      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-muted hover:text-brand-violet"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Beauty Journal</span>
        </Link>

        {/* Title & Metadata */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs text-brand-muted">
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5 text-brand-violet" />
              {post.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-brand-violet" />
              {post.readingTimeMinutes} min read
            </span>
            <span>•</span>
            <span>{formatInKolkata(post.publishedAt, "MMMM dd, yyyy")}</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-brand-ink dark:text-white leading-tight">
            {post.title}
          </h1>

          <p className="text-base text-brand-muted leading-relaxed font-medium">
            {post.excerpt}
          </p>
        </div>

        {/* Cover Image */}
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-xl border-4 border-white dark:border-purple-900">
          <Image src={post.coverImage} alt={post.title} fill priority className="object-cover" />
        </div>

        {/* Article Body */}
        <div className="rounded-3xl bg-white dark:bg-[#1A102F] p-8 sm:p-10 border border-purple-100 dark:border-purple-900 shadow-sm">
          <div className="prose prose-purple dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed whitespace-pre-line text-brand-ink/90 dark:text-purple-100">
            {post.content}
          </div>

          {/* Book CTA Banner at Bottom of Blog */}
          <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-purple-100 via-pink-50 to-amber-50 dark:from-purple-950/60 dark:to-purple-900/40 border border-purple-200 dark:border-purple-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-brand-ink dark:text-white flex items-center gap-1.5">
                <Crown className="h-4 w-4 text-brand-softgold" />
                Ready to Experience This in Person?
              </p>
              <p className="text-xs text-brand-muted mt-0.5">
                Consult with our senior master artisans at our Indiranagar salon.
              </p>
            </div>
            <Link
              href="/book"
              className="px-6 py-2.5 rounded-full bg-brand-violet text-white text-xs font-bold hover:bg-brand-royal transition-all shadow-soft shrink-0"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
