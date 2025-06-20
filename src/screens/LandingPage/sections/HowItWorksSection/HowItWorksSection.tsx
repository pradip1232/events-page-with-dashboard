import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

export const HowItWorksSection = (): JSX.Element => {
  // Define the step data to make the code more maintainable
  const steps = [
    {
      number: "Step 1",
      title: "Define Your Event Flow",
      description:
        "Paid or free? One attendee category or five? Food passes? Tell us once — we got you.",
    },
    {
      number: "Step 2",
      title: "Build Your Registration Form",
      description:
        "Pick from pre-built templates or make it yours — no coding, no fuss.",
    },
    {
      number: "Step 3",
      title: "Set Up Your Crew",
      description:
        "Assign volunteers, set roles, and give secure QR access only to your team.",
    },
    {
      number: "Step 4",
      title: "Automate All Communication",
      description:
        "Choose email & WhatsApp templates. Real-time updates — no manual follow-ups needed.",
    },
    {
      number: "Step 5",
      title: "Go Live & Breathe Easy",
      description:
        "Check-ins, access control, category validation — all automatic. No printed lists. No shouting.\nEvent = handled.",
    },
  ];

  // Background images for each card
  const backgroundImages = [
    "/mask-group.png",
    "/mask-group-1.png",
    "/mask-group-2.png",
    "/mask-group-3.png",
    "/mask-group-4.png",
  ];

  return (
    <section className="flex flex-col w-full items-start gap-[50px]">
      <header className="flex flex-col items-start">
        <h2 className="font-headline text-text text-[length:var(--headline-font-size)] font-[number:var(--headline-font-weight)] tracking-[var(--headline-letter-spacing)] leading-[var(--headline-line-height)] [font-style:var(--headline-font-style)]">
          How It Works
        </h2>

        <p className="font-sub-heading text-text text-[length:var(--sub-heading-font-size)] font-[number:var(--sub-heading-font-weight)] tracking-[var(--sub-heading-letter-spacing)] leading-[var(--sub-heading-line-height)] [font-style:var(--sub-heading-font-style)]">
          Event setup that&apos;s easier than ordering takeout.
          <br />
          Because your energy belongs to the event, not the operations
        </p>
      </header>

      <div className="flex flex-col items-center justify-center gap-[60px] w-full">
        {/* First row of cards */}
        <div className="flex flex-row items-center gap-[60px]">
          {steps.slice(0, 3).map((step, index) => (
            <Card
              key={`step-${index + 1}`}
              className="w-[345.3px] h-[426.99px] bg-[#18181c] rounded-[40px] overflow-hidden"
            >
              <CardContent className="p-0">
                <div
                  className="w-[345px] h-[421px] bg-cover bg-center"
                  style={{ backgroundImage: `url(${backgroundImages[index]})` }}
                >
                  <div className="flex flex-col w-[290px] items-start gap-[39px] pt-11 pl-[27px]">
                    <div className="inline-flex items-start gap-2.5 rounded-[5px]">
                      <span className="[background:linear-gradient(132deg,rgba(255,152,152,1)_0%,rgba(153,24,196,0.53)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Poppins',Helvetica] font-bold italic text-transparent text-[32px] leading-5">
                        {step.number}
                      </span>
                    </div>

                    <div className="flex flex-col items-start gap-[60px] w-full">
                      <h3 className="font-card-headline text-text text-[length:var(--card-headline-font-size)] font-[number:var(--card-headline-font-weight)] tracking-[var(--card-headline-letter-spacing)] leading-[var(--card-headline-line-height)] [font-style:var(--card-headline-font-style)]">
                        {step.title}
                      </h3>

                      <p className="w-[303px] [font-family:'Poppins',Helvetica] font-normal text-text text-base leading-7">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Second row of cards */}
        <div className="flex flex-row items-center gap-[60px]">
          {steps.slice(3, 5).map((step, index) => (
            <Card
              key={`step-${index + 4}`}
              className="w-[345.3px] h-[426.99px] bg-[#18181c] rounded-[40px] overflow-hidden"
            >
              <CardContent className="p-0">
                <div
                  className="w-[345px] h-[421px] bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${backgroundImages[index + 3]})`,
                  }}
                >
                  <div className="flex flex-col w-[290px] items-start gap-[39px] pt-11 pl-[27px]">
                    <div className="inline-flex items-start gap-2.5 rounded-[5px]">
                      <span className="[background:linear-gradient(132deg,rgba(255,152,152,1)_0%,rgba(153,24,196,0.53)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Poppins',Helvetica] font-bold italic text-transparent text-[32px] leading-5">
                        {step.number}
                      </span>
                    </div>

                    <div className="flex flex-col items-start gap-[60px] w-full">
                      <h3 className="font-card-headline text-text text-[length:var(--card-headline-font-size)] font-[number:var(--card-headline-font-weight)] tracking-[var(--card-headline-letter-spacing)] leading-[var(--card-headline-line-height)] [font-style:var(--card-headline-font-style)]">
                        {step.title}
                      </h3>

                      <p className="w-[303px] [font-family:'Poppins',Helvetica] font-normal text-text text-base leading-7">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
