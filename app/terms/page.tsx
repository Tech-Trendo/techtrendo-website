import { Metadata } from "next";
import Link from "next/link";

const PATH = "/terms";

export const metadata: Metadata = {
  title: { absolute: "Terms of Service | Tech Trendo" },
  description:
    "The terms that govern use of the Tech Trendo website and our software development services and products.",
  alternates: { canonical: `https://techtrendo.com${PATH}` },
};

// NOTE: Template drafted for launch — have legal review before relying on it
// as the company's binding terms.
export default function TermsPage() {
  return (
    <div className="flex flex-col">
      <section className="section-padding bg-linear-to-br from-primary via-secondary to-accent text-white">
        <div className="container-custom text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold">Terms of Service</h1>
          <p className="text-lg text-white/90">Last updated: August 2026</p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom max-w-3xl space-y-6 text-muted-foreground leading-relaxed">
          <p>
            These Terms of Service (&quot;Terms&quot;) govern your use of
            techtrendo.com and the services and products provided by Tech
            Trendo Multipurpose Company Pvt. Ltd. By using this website or
            engaging us, you agree to these Terms.
          </p>

          <h2 className="text-2xl font-bold text-foreground">Services</h2>
          <p>
            We provide software development, web and app design, digital
            marketing, ICT services, and related ready-made software products.
            Specific engagements are governed by individual proposals, quotes,
            or agreements, which prevail over these Terms where they differ.
          </p>

          <h2 className="text-2xl font-bold text-foreground">Quotes and engagement</h2>
          <p>
            Project work begins after both parties agree on scope, milestones,
            timeline, and fees in writing. Product demos and evaluations are
            provided on request; contact us to arrange access to a live demo of
            any product listed on this site.
          </p>

          <h2 className="text-2xl font-bold text-foreground">Intellectual property</h2>
          <p>
            Upon full payment, clients receive the usage rights to project
            deliverables as defined in their agreement. Our pre-built products,
            frameworks, and internal tools remain the property of Tech Trendo
            and are licensed, not sold, unless otherwise agreed in writing.
          </p>

          <h2 className="text-2xl font-bold text-foreground">Acceptable use</h2>
          <p>
            You agree not to misuse this website — including attempting to
            breach security, scraping content at disruptive volumes, or using
            our forms for spam or unlawful purposes.
          </p>

          <h2 className="text-2xl font-bold text-foreground">Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, Tech Trendo is not liable
            for indirect or consequential damages arising from use of this
            website. Liability for services and products is defined in the
            applicable signed agreement.
          </p>

          <h2 className="text-2xl font-bold text-foreground">Contact</h2>
          <p>
            For questions about these Terms, email{" "}
            <a href="mailto:info@techtrendo.com" className="text-primary hover:underline">
              info@techtrendo.com
            </a>
            .
          </p>

          <p className="pt-4">
            See also our{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/refund-policy" className="text-primary hover:underline">
              Refund Policy
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
