import type { Metadata } from "next";
import ScrollFade from "@/components/animations/ScrollFade";

export const metadata: Metadata = {
  title: "Privacy Policy | Casa Avenida",
  description: "Privacy policy for the Casa Avenida website.",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  {
    heading: "Information We Collect",
    body: `When you submit an inquiry or subscribe to our newsletter, we collect the personal information you provide — including your name, email address, and phone number. We may also collect non-personal information about your visit, such as your browser type and the pages you view, through analytics tools.`,
  },
  {
    heading: "How We Use Your Information",
    body: `Information you submit is used solely to respond to your inquiry and, if applicable, to send you updates about Casa Avenida. We do not sell, trade, or transfer your personal information to third parties except as required to operate this service (e.g., email delivery providers).`,
  },
  {
    heading: "Third-Party Services",
    body: `This website uses Vercel Analytics for anonymous usage statistics. When you subscribe to our newsletter, your email is stored with MailerLite. Form submissions are processed through Resend. All third-party providers are bound by their own privacy policies and applicable law.`,
  },
  {
    heading: "Cookies",
    body: `We use a single functional cookie to remember your cookie consent preference. We do not set analytics cookies without your consent. You may withdraw consent at any time by clearing your browser cookies and revisiting the site.`,
  },
  {
    heading: "Data Retention",
    body: `Inquiry data is retained for the duration of the Casa Avenida sales process and may be retained by Douglas Elliman thereafter for regulatory compliance purposes. Newsletter subscribers may unsubscribe at any time via the link in each email.`,
  },
  {
    heading: "Your Rights",
    body: `You may request access to, correction of, or deletion of your personal data at any time by contacting us at casaavenida@elliman.com. We will respond within 30 days.`,
  },
  {
    heading: "Contact",
    body: `For privacy-related inquiries, please contact:\n\nDouglas Elliman Real Estate\nCasa Avenida Sales Team\ncasaavenida@elliman.com`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <section className="bg-lunar min-h-screen pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-3xl mx-auto">
        <ScrollFade>
          <p className="font-heading text-sapling/60 text-xs tracking-heading mb-4">
            LEGAL
          </p>
          <h1 className="font-display text-white text-3xl lg:text-4xl leading-tight mb-3">
            PRIVACY POLICY
          </h1>
          <p className="font-body text-white/30 text-xs mb-10 pb-6 border-b border-white/10">
            Last updated: March 2026. Subject to attorney review before site launch.
          </p>
        </ScrollFade>

        <div className="space-y-10">
          {SECTIONS.map((section, i) => (
            <ScrollFade key={section.heading} delay={i * 40}>
              <h2 className="font-heading text-white text-xs tracking-heading mb-3">
                {section.heading.toUpperCase()}
              </h2>
              <p className="font-body text-white/50 text-sm leading-loose whitespace-pre-wrap">
                {section.body}
              </p>
            </ScrollFade>
          ))}
        </div>
      </div>
    </section>
  );
}
