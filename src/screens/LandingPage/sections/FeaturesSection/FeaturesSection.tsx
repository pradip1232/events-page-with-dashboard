import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

// Feature card data for mapping
const featureCards = [
  {
    id: 1,
    icon: "/group.png",
    title: "DIY & Fully Customizable Setup",
    tagline: "Your event, your rules. No development, no delays.",
    features: [
      "Build forms using smart templates or make your own from scratch",
      "Configure ticket types (free, paid, food passes, VIP, etc.)",
      "Create an event microsite in minutes",
      "All drag, drop, click — no coding needed",
    ],
  },
  {
    id: 2,
    icon: "/group-1.png",
    title: "Smart & Efficient",
    tagline:
      "Everything auto-updated. Runs faster than your ops team ever could.",
    features: [
      "QR-based check-ins — no printouts, no drama",
      "Automated emails & WhatsApp flows for confirmations, reminders, and check-ins",
      "RSVP nudges and real-time push alerts",
      "No more follow-up fatigue",
    ],
  },
  {
    id: 3,
    icon: "/group-2.png",
    title: "Locked & Secured Control",
    tagline: "Only your team gets the keys to the kingdom.",
    features: [
      "Assign QR scan access only to verified volunteers",
      "Create crew roles with tiered permissions",
      "External scans redirect to event microsite — not user data",
      "Lockdown-grade privacy for your attendee info",
    ],
  },
  {
    id: 4,
    icon: "/group-3.png",
    title: "Real-Time Insights & Analytics",
    tagline: "Run your event like a data-driven boss.",
    features: [
      "Track registrations and check-ins live",
      "Exportable reports on attendance, ticket types, and more",
      "Capture leads and post-event feedback easily",
      "Turn every event into a growth opportunity",
    ],
  },
];

export const FeaturesSection = (): JSX.Element => {
  return (
    <section className="flex flex-col items-start gap-[73px] w-full max-w-[1156px]">
      <header className="flex flex-col items-start w-full max-w-[380px]">
        <h2 className="font-headline text-text text-[length:var(--headline-font-size)] font-[number:var(--headline-font-weight)] tracking-[var(--headline-letter-spacing)] leading-[var(--headline-line-height)] [font-style:var(--headline-font-style)] w-fit mt-[-1px]">
          Features
        </h2>
        <div className="flex flex-col items-start gap-2.5">
          <h3 className="font-sub-heading text-text text-[length:var(--sub-heading-font-size)] font-[number:var(--sub-heading-font-weight)] tracking-[var(--sub-heading-letter-spacing)] leading-[var(--sub-heading-line-height)] [font-style:var(--sub-heading-font-style)] w-fit mt-[-1px]">
            Everything You Need. Nothing, You Don&apos;t.
          </h3>
        </div>
      </header>

      <div className="flex flex-wrap items-start justify-center gap-[60px_95px] w-full">
        {featureCards.map((card) => (
          <Card
            key={card.id}
            className="flex flex-col w-[410px] items-center gap-2.5 px-5 py-[30px] bg-[#18181c] rounded-[20px] border-none"
          >
            <CardContent className="p-0 flex flex-col items-center w-full">
              <div className="flex flex-col w-[104px] h-[104px] items-center justify-center gap-2.5 p-[29px] bg-[#222228] rounded-[30px] mb-2.5">
                {card.id === 1 || card.id === 4 ? (
                  <div className="relative w-[44.78px] h-[45.96px] bg-[url(${card.icon})] bg-[100%_100%]" />
                ) : (
                  <div className="relative w-[44.78px] h-[45.96px]">
                    <div className="relative w-[45px] h-[46px]">
                      <img
                        className={`absolute ${card.id === 2 ? "w-[38px] h-[46px] top-0 left-[3px]" : "w-[45px] h-[45px] top-0 left-0"}`}
                        alt="Feature icon"
                        src={card.icon}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="inline-flex items-center justify-center gap-2.5 p-2.5">
                <h4 className="font-card-headline-secondary text-text text-[length:var(--card-headline-secondary-font-size)] font-[number:var(--card-headline-secondary-font-weight)] tracking-[var(--card-headline-secondary-letter-spacing)] leading-[var(--card-headline-secondary-line-height)] text-center [font-style:var(--card-headline-secondary-font-style)] mt-[-1px]">
                  {card.title}
                </h4>
              </div>

              <div className="inline-flex items-center justify-center gap-2.5 p-2.5">
                <p className="font-body-text-smaller text-text text-[length:var(--body-text-smaller-font-size)] font-[number:var(--body-text-smaller-font-weight)] tracking-[var(--body-text-smaller-letter-spacing)] leading-[var(--body-text-smaller-line-height)] text-center [font-style:var(--body-text-smaller-font-style)] mt-[-1px]">
                  {card.tagline}
                </p>
              </div>

              <div className="inline-flex items-center justify-center gap-2.5 p-2.5">
                <div className="w-[303px] font-body-text-smaller text-text text-[length:var(--body-text-smaller-font-size)] font-[number:var(--body-text-smaller-font-weight)] tracking-[var(--body-text-smaller-letter-spacing)] leading-[var(--body-text-smaller-line-height)] [font-style:var(--body-text-smaller-font-style)] mt-[-1px]">
                  {card.features.map((feature, index) => (
                    <React.Fragment key={index}>
                      {feature}
                      {index < card.features.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
