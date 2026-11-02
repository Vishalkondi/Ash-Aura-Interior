import { ArrowIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "./Icons";
import { contact } from "@/lib/site";

type ContactLink = {
  label: string;
  value: string;
  icon: (props: { className?: string }) => React.ReactElement;
  href?: string;
  external?: boolean;
};

const links: Record<"phone" | "whatsapp" | "email" | "instagram" | "studio", ContactLink> = {
  phone: { label: "Call", value: contact.phoneDisplay, href: contact.phoneHref, icon: PhoneIcon },
  whatsapp: { label: "WhatsApp", value: "Message on WhatsApp", href: contact.whatsappUrl, external: true, icon: WhatsAppIcon },
  email: { label: "Email", value: contact.email, href: `mailto:${contact.email}`, icon: MailIcon },
  instagram: { label: "Instagram", value: contact.instagramHandle, href: contact.instagramUrl, external: true, icon: InstagramIcon },
  studio: { label: "Studio", value: contact.studio, icon: PinIcon },
};

export type ContactKey = keyof typeof links;

const tones = {
  dark: {
    row: "border-gold/20",
    ring: "border-gold/40 text-gold group-hover:border-gold group-hover:bg-gold group-hover:text-ink",
    label: "text-gold",
    value: "text-beige group-hover:text-gold",
    arrow: "text-gold/60 group-hover:text-gold",
  },
  light: {
    row: "border-gold/60",
    ring: "border-gold text-gold-deep group-hover:border-ink group-hover:bg-ink group-hover:text-beige",
    label: "text-gold-deep",
    value: "text-ink",
    arrow: "text-gold-deep group-hover:text-ink",
  },
};

/** A list of contact rows: icon ring, label, value and an arrow for links. */
export function ContactLinks({ items, tone = "dark" }: { items: ContactKey[]; tone?: keyof typeof tones }) {
  const t = tones[tone];

  return (
    <ul className={`border-t ${t.row}`}>
      {items.map((key) => {
        const { label, value, href, external, icon: Icon } = links[key];
        const body = (
          <>
            <span
              className={`flex size-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-500 ${t.ring}`}
            >
              <Icon className="size-[1.1rem]" />
            </span>
            <span className="min-w-0 flex-1">
              <span className={`block text-[0.62rem] uppercase tracking-[0.3em] ${t.label}`}>{label}</span>
              <span
                className={`mt-1 block font-serif text-[1.15rem] font-light leading-snug wrap-anywhere transition-colors duration-500 min-[400px]:text-[1.3rem] sm:text-[1.45rem] ${t.value}`}
              >
                {value}
              </span>
            </span>
            {href && (
              <ArrowIcon
                className={`block size-4 shrink-0 max-[400px]:hidden transition-[color,transform] duration-500 ease-calm group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${t.arrow}`}
              />
            )}
          </>
        );

        return (
          <li key={key} className={`border-b ${t.row}`}>
            {href ? (
              <a
                href={href}
                className="group flex items-center gap-4 py-5 sm:gap-5"
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {body}
                {external && <span className="sr-only">(opens in a new tab)</span>}
              </a>
            ) : (
              <div className="group flex items-center gap-4 py-5 sm:gap-5">{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
