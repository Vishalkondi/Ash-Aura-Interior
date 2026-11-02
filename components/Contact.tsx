import { ContactLinks } from "./ContactLinks";
import { EnquiryForm } from "./EnquiryForm";
import { PhoneIcon, WhatsAppIcon } from "./Icons";
import { Magnetic } from "./Magnetic";
import { Reveal } from "./Reveal";
import { SplitText } from "./SplitText";
import { contact, contactSection, enquiry } from "@/lib/site";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-ink">
      <div className="mx-auto max-w-360 px-5 py-24 sm:px-8 md:py-36 lg:px-12 lg:py-44">
        <div className="grid gap-16 md:grid-cols-12 md:gap-8">
          <Reveal className="md:col-span-7">
            <p className="eyebrow text-gold">{contactSection.eyebrow}</p>
            <SplitText
              id="contact-title"
              className="display mt-8 text-[clamp(2.8rem,8vw,7rem)]"
              text={contactSection.heading}
            />
            <p className="mt-8 max-w-lg text-base font-light leading-relaxed text-beige/75 md:text-[1.05rem]">
              {contactSection.body}
            </p>
            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Magnetic>
                <a
                  href={contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-gold px-8 py-4 text-[0.72rem] uppercase tracking-[0.28em] text-ink transition-colors duration-500 hover:bg-beige"
                >
                  <WhatsAppIcon />
                  WhatsApp us
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href={contact.phoneHref}
                  className="inline-flex items-center justify-center gap-3 border border-gold/70 px-8 py-4 text-[0.72rem] uppercase tracking-[0.28em] text-beige transition-colors duration-500 hover:border-beige hover:bg-beige hover:text-ink"
                >
                  <PhoneIcon />
                  Call us
                </a>
              </Magnetic>
            </div>
          </Reveal>

          <Reveal delay={0.2} className="md:col-span-5 md:self-end lg:col-span-4 lg:col-start-9">
            <ContactLinks items={["studio", "phone", "email", "instagram"]} />
          </Reveal>
        </div>

        <Reveal className="mt-24 border border-gold/20 bg-ink-soft px-5 py-10 sm:px-10 sm:py-14 md:mt-32 lg:px-16 lg:py-16">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <p className="eyebrow text-gold">Enquiry</p>
              <h3 className="display mt-6 text-[clamp(2.2rem,4.5vw,3.5rem)]">{enquiry.heading}</h3>
              <p className="mt-6 max-w-sm text-base font-light leading-relaxed text-beige/70">
                A few details help Aishwarya prepare for your first conversation. Your enquiry goes straight to her
                inbox and is not stored on this site.
              </p>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <EnquiryForm />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
