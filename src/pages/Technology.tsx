import TechHero from "../components/technology/TechHero";
import LedgerSection from "../components/technology/LedgerSection";
import NetworkAggregation from "../components/technology/NetworkAggregation";
import TypeSafeLoop from "../components/technology/TypeSafeLoop";
import ResiliencePanels from "../components/technology/ResiliencePanels";
import StatusBoard from "../components/technology/StatusBoard";
import StackGrid from "../components/technology/StackGrid";
import TechCta from "../components/technology/TechCta";

export default function Technology() {
  return (
    <>
      <TechHero />
      <LedgerSection />
      <NetworkAggregation />
      <TypeSafeLoop />
      <ResiliencePanels />
      <StatusBoard />
      <StackGrid />
      <TechCta />
    </>
  );
}
