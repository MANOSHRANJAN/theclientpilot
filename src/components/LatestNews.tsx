import Image from "next/image";
import Link from "next/link";
import { StarBurst } from "./icons";

interface Post {
  href: string;
  title: string;
  image: string;
  imagePosition?: string;
}

const POSTS: Post[] = [
  {
    href: "/blog/a-century-of-change-the-evolution-of-marketing-and-what-comes-next",
    title: "A century of change: the evolution of marketing and what comes next",
    image: "/images/news-freedom.png",
    imagePosition: "50% 35%",
  },
  {
    href: "/blog/introducing-copula-the-bond-behind-brand-success",
    title: "INTRODUCING COPULA: The Bond Behind Brand Success",
    image: "/images/news-automation.png",
    imagePosition: "50% 35%",
  },
  {
    href: "/blog/reciprocity-in-marketing-what-is-it",
    title: "Reciprocity in marketing: what is it",
    image: "/images/news-growth.png",
    imagePosition: "50% 35%",
  },
];

export function LatestNews() {
  return (
    <section className="bg-copula-blue relative pt-4 pb-6 md:py-10">
      <div className="text-copula-white flex items-center gap-2 p-(--padding-x) pt-0 md:justify-center">
        <StarBurst className="size-6 animate-spin-slow text-copula-white" />
        <p className="display uppercase text-[40px] leading-none">Latest news</p>
      </div>

      <div className="mx-auto flex max-w-292.5 flex-col items-center gap-6 px-(--padding-x) pt-12 md:pt-20">
        <h2 className="display text-copula-white text-center leading-[0.9] whitespace-pre-line">
          Insights that{"\n"}drive growth.
        </h2>
        <p className="text-copula-white max-w-2xl text-center text-base md:text-lg">
          Strategies, systems, and AI workflows that help businesses generate more leads, close
          more sales, and automate operations.
        </p>
      </div>

      <div className="no-scrollbar mt-10 flex gap-x-8 overflow-x-auto px-(--padding-x) pb-2 md:mt-16 md:grid md:grid-cols-3 md:overflow-visible md:gap-x-10">
        {POSTS.map((p) => (
          <article
            key={p.href}
            className="text-copula-white flex w-[78%] min-w-72 flex-col snap-start md:w-full md:min-w-0"
          >
            <Link
              href={p.href}
              className="wavy-box group relative block aspect-square w-full max-w-84 self-center overflow-hidden"
            >
              <Image
                src={p.image}
                alt=""
                fill
                sizes="(min-width: 768px) 320px, 80vw"
                style={{ objectPosition: p.imagePosition ?? "center" }}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
