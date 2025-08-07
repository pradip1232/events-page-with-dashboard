import React from "react";
import { Button } from "../../../../components/ui/button";

export const FooterWrapperSection = (): JSX.Element => {
  // Footer navigation links data
  const footerLinks = [
    { title: "Terms & Conditions", href: "term-and-conditions" },
    { title: "Privacy Policy", href: "privacy-and-policy" },
    { title: "Refund Policy", href: "refund-policy" },
  ];

  // Social media icons data
  const socialIcons = [
    { src: "/footer-social-icon-container-3.svg", alt: "Footer social icon" },
    { src: "/footer-social-icon-container-2.svg", alt: "Footer social icon" },
    { src: "/footer-social-icon-container.svg", alt: "Footer social icon" },
    { src: "/footer-social-icon-container-1.svg", alt: "Footer social icon" },
    { src: "/mail.svg", alt: "Mail" },
  ];

  return (
    <footer className="flex flex-col w-full items-center gap-2.5 relative">
      <div className="flex flex-col items-start gap-2.5 relative">
        <img
          className="relative w-[471.27px] h-[262.58px]"
          alt="Name"
          src="/name-1.png"
        />
      </div>

      <nav className="flex items-center gap-9 relative">
        {footerLinks.map((link, index) => (
          <Button
            key={index}
            variant="ghost"
            className="p-2.5 text-white hover:text-white/80"
            asChild
          >
            <a href={link.href}>
              <span className="font-nav-bar-text font-[number:var(--nav-bar-text-font-weight)] text-[length:var(--nav-bar-text-font-size)] tracking-[var(--nav-bar-text-letter-spacing)] leading-[var(--nav-bar-text-line-height)] [font-style:var(--nav-bar-text-font-style)]">
                {link.title}
              </span>
            </a>
          </Button>
        ))}
      </nav>

      <div className="flex items-start gap-6 relative">
        {socialIcons.map((icon, index) => (
          <a key={index} href="#" aria-label={icon.alt}>
            <img
              className="relative w-[77px] h-[77px]"
              alt={icon.alt}
              src={icon.src}
            />
          </a>
        ))}
      </div>
    </footer>
  );
};
