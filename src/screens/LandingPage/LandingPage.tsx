import React from "react";
import { FeaturesSection } from "./sections/FeaturesSection";
import { FooterSection } from "./sections/FooterSection";
import { FooterWrapperSection } from "./sections/FooterWrapperSection";
import { HowItWorksSection } from "./sections/HowItWorksSection";
import { MainContentSection } from "./sections/MainContentSection";
import { PricingSection } from "./sections/PricingSection";
import { WhyUsSection } from "./sections/WhyUsSection";

export const LandingPage = (): JSX.Element => {
  return (
    <div className="flex flex-col items-center gap-20 relative bg-[url(..//desktop---7.png)] bg-cover bg-center bg-no-repeat bg-black py-0 pb-[75px]">
      <MainContentSection />
      <HowItWorksSection />
      <FeaturesSection />
      <WhyUsSection />
      <PricingSection />
      <FooterSection />
      <FooterWrapperSection />



      {/* Decorative elements */}
      <div className="w-24 h-24 rounded-[48px] absolute top-[5885px] left-[432px] blur-[10px] bg-[radial-gradient(50%_50%_at_43%_-7%,rgba(73,73,85,1)_0%,rgba(20,20,20,1)_100%)]" />
      <div className="w-16 h-16 rounded-[32px] absolute top-[5634px] left-[245px] blur-[10px] bg-[radial-gradient(50%_50%_at_43%_-7%,rgba(73,73,85,1)_0%,rgba(20,20,20,1)_100%)]" />
    </div>
  );
};
