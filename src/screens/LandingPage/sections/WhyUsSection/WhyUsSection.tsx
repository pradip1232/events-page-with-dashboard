import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

// Feature card data for mapping
const featureCards = [
  {
    icon: "/layer-1.svg",
    text: "Fully automated workflows from start to finish.",
  },
  {
    icon: "/layer-1-3.svg",
    text: "No follow-ups, no scrambling, no micromanaging. Just flow.",
  },
  {
    icon: "/layer-1-4.svg",
    text: "Designed for small teams or even solo organizers with big plans.",
  },
  {
    icon: "/layer-1-2.svg",
    text: "No hidden charges, no surprises",
  },
  {
    icon: "/layer-1-1.svg",
    text: "Works behind-the-scenes, 24/7 — even when you're not.",
  },
];

export const WhyUsSection = (): JSX.Element => {
  return (
    <section className="flex flex-col w-full max-w-[1156px] items-center gap-2.5 p-2.5 mx-auto">
      <div className="flex flex-col items-center gap-[35px] w-full">
        <div className="flex flex-col items-center gap-12">
          <h2 className="font-['Poppins',Helvetica] font-extrabold text-text text-9xl leading-[65px]">
            Why Us
          </h2>

          <div className="flex flex-col items-center gap-[5px]">
            <h3 className="font-['Playfair_Display',Helvetica] font-normal italic text-text text-[32px] text-center leading-normal">
              Built So You Don&apos;t Have to Babysit It.
            </h3>

            <p className="font-card-headline-secondary font-[number:var(--card-headline-secondary-font-weight)] text-text text-[length:var(--card-headline-secondary-font-size)] text-center tracking-[var(--card-headline-secondary-letter-spacing)] leading-[var(--card-headline-secondary-line-height)] whitespace-nowrap [font-style:var(--card-headline-secondary-font-style)]">
              ClicknGO takes over the boring bits so you can focus on the big
              moments.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-start justify-center gap-2.5 p-2.5 w-full">
          {featureCards.map((feature, index) => (
            <Card
              key={index}
              className="flex flex-col w-[213px] h-[236px] items-center justify-center gap-5 p-2.5 bg-[#18181c] rounded-[20px] overflow-hidden border-none"
            >
              <CardContent className="flex flex-col items-center justify-center gap-5 p-0">
                <div className="flex flex-col w-[60px] h-[57px] items-center justify-center px-[13px] py-3 rounded-[238px] overflow-hidden [background:linear-gradient(132deg,rgba(255,152,152,1)_0%,rgba(153,24,196,0.53)_100%)]">
                  <img
                    className="w-[34px] h-[33px] object-contain"
                    alt="Feature icon"
                    src={feature.icon}
                  />
                </div>

                <p className="w-[180.47px] font-body-text font-[number:var(--body-text-font-weight)] text-text text-[length:var(--body-text-font-size)] text-center tracking-[var(--body-text-letter-spacing)] leading-[var(--body-text-line-height)] [font-style:var(--body-text-font-style)]">
                  {feature.text}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
