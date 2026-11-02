import Image from "next/image";
import Link from "next/link";
import { type Article, articleHref, formatDate } from "@/lib/journal";

/** Photo, category, title and excerpt for a journal article, linking to its page. */
export function ArticleCard({ article, sizes }: { article: Article; sizes: string }) {
  return (
    <Link href={articleHref(article)} className="group block">
      <span className="relative block aspect-[4/3] overflow-hidden">
        <Image
          src={article.image.src}
          alt={article.image.alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-[2400ms] ease-calm group-hover:scale-[1.06]"
        />
      </span>
      <span className="mt-6 flex items-center gap-4 text-[0.6rem] uppercase tracking-[0.28em] text-gold">
        {article.category}
        <span aria-hidden="true" className="h-px w-6 bg-gold/50" />
        <time dateTime={article.date} className="text-beige/55">
          {formatDate(article.date)}
        </time>
      </span>
      <span className="mt-4 block font-serif text-[clamp(1.5rem,2.4vw,2rem)] font-light lowercase leading-tight text-beige transition-colors duration-500 group-hover:text-gold">
        {article.title}
      </span>
      <span className="mt-3 block text-[0.95rem] font-light leading-relaxed text-beige/65">{article.excerpt}</span>
      <span className="mt-5 inline-flex items-center gap-3 text-[0.62rem] uppercase tracking-[0.26em] text-gold">
        Read · {article.readMinutes} min
        <span aria-hidden="true" className="transition-transform duration-500 ease-calm group-hover:translate-x-1">
          →
        </span>
      </span>
    </Link>
  );
}
