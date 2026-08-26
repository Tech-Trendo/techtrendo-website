import { Metadata } from "next";
import Link from "next/link";

const PATH = "/privacy";

export const metadata: Metadata = {
  title: { absolute: "Privacy Policy | Tech Trendo" },
  description:
    "How Tech Trendo collects, uses, and protects personal information across our website, products, and client engagements.",
  alternates: { canonical: `https://techtrendo.com${PATH}` },
};

// NOTE: Template drafted for launch — have legal review before relying on it
// as the company's binding privacy policy.
export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col">
      <section className="section-padding bg-linear-to-br from-primary via-secondary to-accent text-white">
        <div className="container-custom text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold">Privacy Policy</h1>
          <p className="text-lg text-white/90">
            Last updated: August 2026
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom max-w-3xl space-y-6 text-muted-foreground leading-relaxed">
          <p>
            Tech Trendo Multipurpose Company Pvt. Ltd. (&quot;Tech Trendo&quot;,
            &quot;we&quot;, &quot;us&quot;) respects your privacy. This policy
            explains what personal information we collect through
            techtrendo.com and our products, how we use it, and the choices you
            have.
          </p>

          <h2 className="text-2xl font-bold text-foreground">Information we collect</h2>
          <ul className="list-disc space-y-2 ml-6">
            <li>
              Contact details you submit through forms (name, email, phone
              number, company, project description).
            </li>
            <li>
              Job application data (resume/CV) submitted through our careers
              channels.
            </li>
            <li>
              Newsletter email addresses, used only to send updates you asked
              for.
            </li>
            <li>
              Basic analytics data (pages visited, approximate location,
              device/browser type) collected via Google Analytics.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground">How we use information</h2>
          <p>
            We use your information to respond to inquiries and quote requests,
            deliver and support our products and services, process job
            applications, send requested communications, and understand how our
            website is used so we can improve it. We do not sell your personal
            information.
          </p>

          <h2 className="text-2xl font-bold text-foreground">Data sharing and retention</h2>
          <p>
            We share information only with service providers that help us
            operate (for example hosting, email delivery, and analytics), under
            instructions to process it on our behalf. We retain personal
            information only as long as needed for the purposes above or as
            required by law.
          </p>

          <h2 className="text-2xl font-bold text-foreground">Your choices</h2>
          <p>
            You may request access to, correction of, or deletion of your
            personal information, and unsubscribe from marketing emails at any
            time by contacting{" "}
            <a href="mailto:info@techtrendo.com" className="text-primary hover:underline">
              info@techtrendo.com
            </a>
            .
          </p>

          <h2 className="text-2xl font-bold text-foreground">Contact</h2>
          <p>
            Questions about this policy? Email{" "}
            <a href="mailto:info@techtrendo.com" className="text-primary hover:underline">
              info@techtrendo.com
            </a>{" "}
            or write to Tech Trendo Multipurpose Company Pvt. Ltd.,
            Sundarharaincha, Morang (Near Itahari), Koshi Pradesh, Nepal.
          </p>

          <p className="pt-4">
            See also our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
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
