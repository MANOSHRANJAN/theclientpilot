import { BondButton } from "./BondButton";

export function CtaBanner() {
  return (
    <section className="flex w-full flex-col items-center justify-center gap-6 px-(--padding-x) py-14">
      <div className="bg-copula-orange mx-auto flex w-full max-w-292.5 flex-col items-center justify-between gap-6 rounded-[22px] p-4 pt-10 md:flex-row md:gap-12 md:p-6 md:pt-6">
        <p className="h2 text-copula-white max-md:text-center md:pl-12">
          Ready when you are. Reach out and see what happens when the right minds connect
        </p>
        <BondButton href="/contact" label="Let's bond" blobClass="text-copula-blue" textClass="text-copula-white" />
      </div>
    </section>
  );
}
