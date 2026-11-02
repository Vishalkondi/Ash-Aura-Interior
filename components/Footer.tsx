import { FooterWordmark } from "./FooterWordmark";
import { InstagramIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "./Icons";
import { LogoMark } from "./Logo";
import { Magnetic } from "./Magnetic";
import { contact, nav, site } from "@/lib/site";

const heading = "text-[0.62rem] uppercase tracking-[0.32em] text-gold";
const linkClass = "transition-colors duration-500 hover:text-gold";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gold/20 bg-ink">
      <div className="mx-auto max-w-360 px-5 sm:px-8 lg:px-12">
        {/* Invitation */}
        <div className="flex flex-col gap-8 border-b border-gold/15 py-16 md:flex-row md:items-end md:justify-between md:py-20">
          <p className="max-w-xl font-serif text-[clamp(2rem,4.5vw,3.5rem)] font-light lowercase leading-[1.05] text-beige">
            have a space in mind? let&apos;s talk about it.
          </p>
          <span className="inline-flex">
            <Magnetic>
              <a
                href="/#book"
                className="group inline-flex items-center gap-4 bg-gold px-8 py-4 text-[0.72rem] uppercase tracking-[0.28em] text-ink transition-colors duration-500 hover:bg-beige"
              >
                Book a consultation
                <span aria-hidden="true" className="transition-transform duration-500 ease-calm group-hover:translate-x-1">
                  →
                </span>
              </a>
            </Magnetic>
          </span>
        </div>

        {/* Columns */}
        <div className="grid gap-12 py-14 sm:grid-cols-2 md:py-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <a href="/#top" className="group inline-flex items-center gap-3">
              <LogoMark className="size-10 text-gold transition-transform duration-700 ease-calm group-hover:rotate-[20deg]" />
              <span className="flex flex-col leading-none">
                <span className="font-serif text-2xl text-beige">Ash Aura</span>
                <span className="mt-1 text-[0.5rem] tracking-[0.48em] text-gold">INTERIORS</span>
              </span>
            </a>
            <p className="mt-6 max-w-sm text-[0.95rem] font-light leading-relaxed text-beige/65">
              {site.tagline} An interior design studio in {site.location}, led by {site.founder}.
            </p>
          </div>

          <nav aria-label="Footer" className="lg:col-span-3">
            <p className={heading}>Explore</p>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-[0.95rem] font-light text-beige/80">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href.startsWith("#") ? `/${item.href}` : item.href} className={linkClass}>
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="/#book" className={linkClass}>
                  Book a visit
                </a>
              </li>
            </ul>
          </nav>

          <div className="sm:col-span-2 lg:col-span-4">
            <p className={heading}>Studio</p>
            <ul className="mt-5 space-y-3 text-[0.95rem] font-light text-beige/80">
              <li className="flex items-start gap-3">
                <PinIcon className="mt-1 size-4 shrink-0 text-gold" />
                {contact.studio}
              </li>
              <li>
                <a href={contact.phoneHref} className={`flex items-center gap-3 ${linkClass}`}>
                  <PhoneIcon className="size-4 shrink-0 text-gold" />
                  {contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 ${linkClass}`}
                >
                  <WhatsAppIcon className="size-4 shrink-0 text-gold" />
                  WhatsApp
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className={`flex items-center gap-3 break-all ${linkClass}`}>
                  <MailIcon className="size-4 shrink-0 text-gold" />
                  {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 ${linkClass}`}
                >
                  <InstagramIcon className="size-4 shrink-0 text-gold" />
                  {contact.instagramHandle}
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <FooterWordmark text="Ash Aura" />

      <div className="border-t border-gold/15">
        <div className="mx-auto flex max-w-360 flex-col items-center gap-4 px-5 py-6 text-center text-[0.65rem] uppercase tracking-[0.24em] text-beige/55 sm:flex-row sm:justify-between sm:px-8 sm:text-left lg:px-12">
          <p>
            © {year} {site.name} · {site.location}
          </p>
          <a href="#top" className={`inline-flex items-center gap-2 ${linkClass}`}>
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
