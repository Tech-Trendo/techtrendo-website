import { Metadata } from "next";
import Link from "next/link";

const PATH = "/refund-policy";

export const metadata: Metadata = {
  title: { absolute: "Refund Policy | Tech Trendo" },
  description:
    "How refunds, cancellations, and warranty support work for Tech Trendo services and software products.",
  alternates: { canonical: `https://techtrendo.com${PATH}` },
};

// NOTE: Template drafted for launch — have legal review (and align with the
// terms of any signed client agreement) before relying on it.
export default function RefundPolicyPage() {
  return (
    <div className="flex flex-col">
      <section className="section-padding bg-linear-to-br from-primary via-secondary to-accent text-white">
        <div className="container-custom text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold">Refund Policy</h1>
          <p className="text-lg text-white/90">Last updated: August 2026</p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom max-w-3xl space-y-6 text-muted-foreground leading-relaxed">
          <p>
            This policy explains how refunds and cancellations work for
            services and products provided by Tech Trendo Multipurpose Company
            Pvt. Ltd. Where a signed agreement states different terms, that
            agreement prevails.
          </p>

          <h2 className="text-2xl font-bold text-foreground">Project services</h2>
          <ul className="list-disc space-y-2 ml-6">
            <li>
              Deposits and milestone payments cover work performed; completed
              and approved milestones are non-refundable.
            </li>
            <li>
              If you cancel a project before a milestone begins, unused
              prepayments for that milestone are refunded within 14 business
              days.
            </li>
            <li>
              If we fail to deliver an agreed milestone and cannot remedy it,
              you are entitled to a refund of the fees paid for the undelivered
              milestone.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground">Software products</h2>
          <ul className="list-disc space-y-2 ml-6">
            <li>
              Product licenses include a warranty period during which we fix
              reported defects at no charge, as defined in your license
              agreement.
            </li>
            <li>
              Because products are demoed with you before purchase, license fees
              are generally non-refundable once activated — except where the
              product materially fails to perform as demonstrated, in which case
              contact us within 30 days of delivery.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground">How to request a refund</h2>
          <p>
            Email{" "}
            <a href="mailto:info@techtrendo.com" className="text-primary hover:underline">
              info@techtrendo.com
            </a>{" "}
            with your project or license reference and the reason for the
            request. We acknowledge every request within 2 business days and
            resolve refunds as described above.
          </p>

          <p className="pt-4">
            See also our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
