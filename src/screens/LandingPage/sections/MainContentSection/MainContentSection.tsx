import React from "react";
import { Button } from "../../../../components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../../../../components/ui/navigation-menu";

// Navigation menu items data
const navItems = ["How It Works", "Features", "Why Us", "Pricing"];

export const MainContentSection = (): JSX.Element => {
  return (
    <section className="relative w-full overflow-hidden bg-black min-h-[1024px] [background:url(..//desktop---7.png)_50%_50%_/_cover,linear-gradient(0deg,rgba(0,0,0,1)_0%,rgba(0,0,0,1)_100%)]">
      {/* Hero content container */}
      <div className="relative w-full h-[860px] mt-[117px] mx-auto max-w-[1725px]">
        {/* Background image */}
        <div className="relative w-full h-[838px]">
          <img
            className="w-full h-[838px] object-cover mx-auto max-w-[1440px]"
            alt="Whatsapp image"
            src="/whatsapp-image-2025-06-10-at-11-27-34-f327137c-2.png"
          />
        </div>

        {/* Main headline */}
        <div className="absolute w-[355px] top-[103px] left-1/2 -translate-x-1/2 font-['Poppins',Helvetica] text-text text-[44px] leading-[44px] text-center tracking-[0]">
          <span className="font-bold leading-[42px]">
            No More Messy Events.
          </span>
          <span className="font-extrabold text-[40px] leading-[42px]">
            &nbsp;
          </span>
          <span className="text-[32px] leading-[0.1px]">Just</span>
        </div>

        {/* CTA Button */}
        <Button
          onClick={() => (window.location.href = "/dashboard")}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 px-7 py-3 rounded-[5px] [background:linear-gradient(132deg,rgba(255,152,152,1)_0%,rgba(153,24,196,0.53)_100%)] hover:opacity-90 transition-opacity"
        >
          <span className="font-button-text font-[number:var(--button-text-font-weight)] text-text text-[length:var(--button-text-font-size)] tracking-[var(--button-text-letter-spacing)] leading-[var(--button-text-line-height)] whitespace-nowrap [font-style:var(--button-text-font-style)]">
            Create a Free Test Eventt
          </span>
        </Button>


        {/* Logo image */}
        <img
          className="absolute w-[280px] h-[163px] top-[251px] left-1/2 -translate-x-1/2"
          alt="Name"
          src="/name.png"
        />

        {/* Descriptive text */}
        <div className="absolute top-[549px] left-1/2 -translate-x-1/2 max-w-[1000px] [font-family:'Playfair_Display',Helvetica] text-transparent text-[40px] leading-10 font-normal text-center tracking-[0]">
          <span className="italic text-white leading-[43px]">
            Build Out Your Event Experience
            <br />
          </span>
          <span className="font-bold italic text-white leading-[43px]">
            {" "}
            Faster Than Your Food Delivery.
            <br />
          </span>
          <span className="[font-family:'Poppins',Helvetica] text-white text-lg leading-7">
            {" "}
          </span>
          <span className="[font-family:'Poppins',Helvetica] text-white text-2xl leading-9">
            From registration forms to QR-based check-ins, it&apos;s all DIY —
            <br />
            zero calls, no downloads, no chaos. No middlemen. Just Click. And
            Go.
          </span>
        </div>
      </div>

      {/* Navigation bar */}
      <div className="flex items-center justify-between absolute top-[39px] left-1/2 -translate-x-1/2 w-full max-w-[1199px] px-4">
        {/* Logo */}
        <div className="flex flex-col items-start gap-2.5">
          <img
            className="w-[166.61px] h-[77.91px]"
            alt="Complete LOGO"
            src="/complete-logo.png"
          />
        </div>

        {/* Navigation menu */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="flex items-center gap-10">
            {navItems.map((item, index) => (
              <NavigationMenuItem key={index}>
                <NavigationMenuLink className="font-nav-bar-text font-[number:var(--nav-bar-text-font-weight)] text-text text-[length:var(--nav-bar-text-font-size)] text-center tracking-[var(--nav-bar-text-letter-spacing)] leading-[var(--nav-bar-text-line-height)] whitespace-nowrap [font-style:var(--nav-bar-text-font-style)] hover:opacity-80 transition-opacity">
                  {item}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* CTA Button */}
        <Button className="px-7 py-3 rounded-[5px] [background:linear-gradient(132deg,rgba(255,152,152,1)_0%,rgba(153,24,196,0.53)_100%)] hover:opacity-90 transition-opacity">
          <span className="font-button-text font-[number:var(--button-text-font-weight)] text-text text-[length:var(--button-text-font-size)] tracking-[var(--button-text-letter-spacing)] leading-[var(--button-text-line-height)] whitespace-nowrap [font-style:var(--button-text-font-style)]">
            Create a Free Test Event
          </span>
        </Button>
      </div>
    </section>
  );
};
