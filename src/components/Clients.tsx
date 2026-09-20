import Image from "next/image";
import { StarBurst } from "./icons";

/*
  The scrolling client-logo marquee that used to sit at the bottom of this
  section has been removed.

  It carried ten logos — dm, Dr. Oetker, Eronet, Lactalis, Wiener, Mepas,
  HP Mostar, Elektro Milas, Heineken and Holdina — every one of them inherited
  from the site this codebase was originally cloned from. None was ever a
  TheClientPilot client, so the strip presented other agencies' customers as
  our own.

  Do not reinstate it with placeholder or aspirational logos. Displaying a
  company's mark as a client without their agreement is a trademark problem as
  well as a credibility one, and it is the kind of claim a prospect can check in
  seconds. Add logos back only for real clients who have agreed to be named.
*/

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
  return (
    // `pb-13 md:pb-20` moved up from the removed logo strip, which was what
    // gave this section its bottom spacing. Without it the section would butt
    // straight into the next one.
    <section id="clients" className="relative overflow-hidden py-5 pb-13 md:pb-20">
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
                {/*
                  The squiggle is a stylised stand-in for the "o" in
                  "connection". Without the letter below, the DOM text of this
                  headline reads "When the C nnection is real, it shows" — that
                  is the string Google indexes and the string a screen reader
                  announces. The `sr-only` "o" restores the real word at zero
                  visual cost: it is removed from layout, so the squiggle still
                  occupies the glyph's place exactly as designed.
                */}
                <span className="sr-only">o</span>
                <span aria-hidden className="relative inline-block align-middle">
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
    </section>
  );
}
