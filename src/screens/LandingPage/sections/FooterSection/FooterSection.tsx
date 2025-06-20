import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

export const FooterSection = (): JSX.Element => {
  return (
    <div className="flex items-center justify-between gap-8 py-8 w-full">
      <div className="flex items-center p-2.5">
        <img
          className="w-auto h-[500px] object-contain"
          alt="Logo SYMBOL"
          src="/logo-symbol.png"
        />
      </div>

      <Card className="border-0 max-w-[560px]">
        <CardContent className="flex flex-col items-start gap-6 p-0">
          <div className="inline-flex items-center justify-center">
            <h2 className="w-fit [background:linear-gradient(132deg,rgba(255,152,152,1)_0%,rgba(153,24,196,0.53)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] font-heading-secondary font-[number:var(--heading-secondary-font-weight)] text-[length:var(--heading-secondary-font-size)] tracking-[var(--heading-secondary-letter-spacing)] leading-[var(--heading-secondary-line-height)]">
              Try It Right Now
            </h2>
          </div>

          <div className="font-['Poppins',Helvetica] text-text text-2xl leading-8 tracking-[-0.29px]">
            <span className="font-semibold">
              No Demo Calls. No Sales Team.
              <br />
            </span>
            <span>
              Set up your first event now. If it takes more than 5 minutes,
              you&apos;re overthinking it.
            </span>
          </div>

          <Button className="px-7 py-3 rounded-[5px] [background:linear-gradient(132deg,rgba(255,152,152,1)_0%,rgba(153,24,196,0.53)_100%)] hover:opacity-90 transition-opacity">
            <span className="font-button-text font-[number:var(--button-text-font-weight)] text-text text-[length:var(--button-text-font-size)] tracking-[var(--button-text-letter-spacing)] leading-[var(--button-text-line-height)]">
              Start Test Event — It&apos;s Free
            </span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
