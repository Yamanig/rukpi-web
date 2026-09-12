import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

interface PageStubProps {
  eyebrow: string;
  title: string;
  description: string;
}

/** Temporary stub — replaced by the page agent's full implementation. */
export default function PageStub({ eyebrow, title, description }: PageStubProps) {
  return (
    <section className="mx-auto flex min-h-[70dvh] max-w-content flex-col justify-center px-6 py-24">
      <p className="eyebrow text-teal">{eyebrow}</p>
      <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold leading-[1.1] tracking-[-0.02em] text-txt">
        {title}
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-txt-sub">{description}</p>
      <Link to="/" className="btn-ghost mt-10 w-fit">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Back to home
      </Link>
    </section>
  );
}
