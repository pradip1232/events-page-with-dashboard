import { CheckIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Separator } from "../../../../components/ui/separator";

// Define pricing plan features data
const pricingPlans = [
  {
    title: "Freemium",
    tagline: "Perfect for small events",
    icon: "/group-4.png",
    features: [
      "100 attendee tokens free per event",
      "After 100 attendees, a per-user charge applies.",
      "QR-based check-ins, customizable forms, automated communication, analytics & reporting",
    ],
    buttonText: "Create Your Free Event Now",
  },
  {
    title: "Enterprise",
    tagline: "For pro organizers who want full control",
    icon: "/group-5.png",
    features: [
      "100 attendee tokens free per event",
      "After 100 attendees, a per-user charge applies.",
      "QR-based check-ins, customizable forms, automated communication, analytics & reporting",
      "Whitelabel experience — your branding, your domain",
      "Advanced customization of forms & workflows",
    ],
    buttonText: "Create Your Free Event Now",
  },
];

export const PricingSection = (): JSX.Element => {
  return (
    <section className="flex flex-col items-center gap-[90px] w-full max-w-[1156px] mx-auto">
      <div className="flex flex-col items-start gap-[90px] w-full">
        <header className="flex flex-col w-full max-w-[427px] items-start">
          <h2 className="font-headline font-[number:var(--headline-font-weight)] text-text text-[length:var(--headline-font-size)] tracking-[var(--headline-letter-spacing)] leading-[var(--headline-line-height)] [font-style:var(--headline-font-style)] h-20">
            Pricing
          </h2>
          <p className="font-sub-heading font-[number:var(--sub-heading-font-weight)] text-text text-[length:var(--sub-heading-font-size)] tracking-[var(--sub-heading-letter-spacing)] leading-[var(--sub-heading-line-height)] [font-style:var(--sub-heading-font-style)]">
            Start Free. Scale Effortlessly. No Hidden Charges
          </p>
        </header>

        <div className="flex flex-wrap items-center justify-center gap-[104px] px-[90px] w-full">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`flex flex-col items-center bg-[#18181c] rounded-[20px] relative ${index === 0 ? "w-[350px]" : "w-[391px]"}`}
            >
              <CardContent className="flex flex-col items-center px-0 py-[35px] w-full">
                <div className="flex flex-col items-center gap-2.5 w-full">
                  <h3 className="font-card-headline font-[number:var(--card-headline-font-weight)] text-text text-[length:var(--card-headline-font-size)] text-center tracking-[var(--card-headline-letter-spacing)] leading-[var(--card-headline-line-height)] [font-style:var(--card-headline-font-style)]">
                    {plan.title}
                  </h3>
                  <p className="font-emphasis-taglines-card font-[number:var(--emphasis-taglines-card-font-weight)] [font-style:var(--emphasis-taglines-card-font-style)] text-text text-[length:var(--emphasis-taglines-card-font-size)] text-center tracking-[var(--emphasis-taglines-card-letter-spacing)] leading-[var(--emphasis-taglines-card-line-height)] whitespace-nowrap">
                    {plan.tagline}
                  </p>
                </div>

                <div className="flex flex-col items-center gap-8 w-full mt-2.5">
                  <Separator className="w-[287px] h-px bg-text/20" />

                  <div className="flex flex-col items-center gap-4 w-full">
                    <div className="flex flex-col items-start gap-6 w-full px-4">
                      {plan.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center justify-between w-full"
                        >
                          <div className="flex w-[29px] h-[29px] items-center justify-center bg-[#222228] rounded-[10px]">
                            <CheckIcon className="w-[5px] h-[7px] text-text" />
                          </div>
                          <p className="w-[calc(100%-40px)] font-body-text-smaller font-[number:var(--body-text-smaller-font-weight)] text-text text-[length:var(--body-text-smaller-font-size)] tracking-[var(--body-text-smaller-letter-spacing)] leading-[var(--body-text-smaller-line-height)] [font-style:var(--body-text-smaller-font-style)]">
                            {feature}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col items-center gap-[17px] w-[287px] mt-4">
                      <Separator className="w-full h-px bg-text/20" />
                      <Button className="px-7 py-3 rounded-[5px] [background:linear-gradient(132deg,rgba(255,152,152,1)_0%,rgba(153,24,196,0.53)_100%)] hover:opacity-90">
                        <span className="font-button-text font-[number:var(--button-text-font-weight)] text-text text-[length:var(--button-text-font-size)] tracking-[var(--button-text-letter-spacing)] leading-[var(--button-text-line-height)] whitespace-nowrap [font-style:var(--button-text-font-style)]">
                          {plan.buttonText}
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>

              <div className="flex items-center justify-center w-[76px] h-[76px] absolute -top-11 left-1/2 -translate-x-1/2 bg-[#222228] rounded-[38px]">
                <img
                  className="w-auto h-auto"
                  alt={`${plan.title} icon`}
                  src={plan.icon}
                />
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Button className="inline-flex items-center gap-3 px-7 py-3 rounded-[5px] [background:linear-gradient(132deg,rgba(255,152,152,1)_0%,rgba(153,24,196,0.53)_100%)] hover:opacity-90">
        <span className="font-button-text font-[number:var(--button-text-font-weight)] text-text text-[length:var(--button-text-font-size)] tracking-[var(--button-text-letter-spacing)] leading-[var(--button-text-line-height)] whitespace-nowrap [font-style:var(--button-text-font-style)]">
          Get Custom Pricing
        </span>
        <img className="w-[17.63px] h-[17.63px]" alt="Icon" src="/icon.svg" />
      </Button>
    </section>
  );
};
