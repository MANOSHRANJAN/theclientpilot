import Image from "next/image";
import { StarBurst } from "./icons";

const LOGOS = [
  { src: "/images/dm.webp", alt: "dm" },
  { src: "/images/dr.oetker.webp", alt: "Dr. Oetker" },
  { src: "/images/eronet_new.webp", alt: "Eronet" },
  { src: "/images/lactalis.webp", alt: "Lactalis" },
  { src: "/images/wiener.webp", alt: "Wiener" },
  { src: "/images/mepas.webp", alt: "Mepas" },
  { src: "/images/hp-mostar.webp", alt: "HP Mostar" },
  { src: "/images/elektro-milas.webp", alt: "Elektro Milas" },
  { src: "/images/heineken.webp", alt: "Heineken" },
  { src: "/images/holdina.webp", alt: "Holdina" },
];

function ConnectionSquiggle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 620 147"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M5 73.5 C 25 5, 65 5, 85 73.5 S 145 142, 165 73.5 S 225 5, 245 73.5 S 305 142, 325 73.5 S 385 5, 405 73.5 S 465 142, 485 73.5 S 545 5, 565 73.5 S 615 142, 615 73.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="14"
        strokeLinecap="round"
        className="text-copula-orange"
      />
    </svg>
  );
}

export function Clients() {
  const loop = [...LOGOS, ...LOGOS];

  return (
    <section id="clients" className="relative overflow-hidden py-5">
      <div className="px-(--padding-x)">
        <div className="text-text-black flex items-center gap-2">
          <StarBurst className="size-6 animate-spin-slow text-text-black" />
          <p className="display uppercase text-[40px] leading-none">Our clients</p>
        </div>

        <div className="relative py-8 md:p-20">
          <div className="flex items-end justify-between gap-6">
            <p className="display text-dark-grey uppercase leading-[0.9] flex-1">
              <span className="block">When the</span>
              <span className="block">
                C
                <span className="relative inline-block align-middle">
                  <ConnectionSquiggle className="-mb-2 inline h-auto w-70 md:-mb-4 md:w-155" />
                </span>
                nnection
              </span>
              <span className="block">is real, it shows</span>
            </p>
            <div className="relative aspect-square w-40 shrink-0 md:w-56 lg:w-64">
              <Image
                src="/images/Clients-Image-Container-1.webp"
                alt="Overall client rating score 9.6"
                fill
                sizes="(min-width: 1024px) 256px, (min-width: 768px) 224px, 160px"
                className="animate-spin-slow object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex w-full overflow-hidden pb-13 md:pb-20">
        <div
          className="flex w-max shrink-0 items-center gap-x-12 pl-(--padding-x) animate-marquee md:gap-x-20"
          style={{ ["--marquee-duration" as string]: "35s" }}
        >
          {loop.map((logo, i) => (
            <div key={i} className="relative h-20 w-32 shrink-0 md:h-30 md:w-44">
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                sizes="200px"
                className="object-contain object-center"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
