import Hero from "../components/home/Hero";
import RailsMarquee from "../components/home/RailsMarquee";
import Problem from "../components/home/Problem";
import Layer from "../components/home/Layer";
import StatsBand from "../components/home/StatsBand";
import Products from "../components/home/Products";
import NetworkRails from "../components/home/NetworkRails";
import ScoreTeaser from "../components/home/ScoreTeaser";
import SecurityStrip from "../components/home/SecurityStrip";
import ClosingCta from "../components/home/ClosingCta";

export default function Home() {
  return (
    <>
      <Hero />
      <RailsMarquee />
      <Problem />
      <Layer />
      <StatsBand />
      <Products />
      <NetworkRails />
      <ScoreTeaser />
      <SecurityStrip />
      <ClosingCta />
    </>
  );
}
