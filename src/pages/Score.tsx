import ScoreHero from "../components/score/ScoreHero";
import ExclusionProblem from "../components/score/ExclusionProblem";
import Pipeline from "../components/score/Pipeline";
import TierExplorer from "../components/score/TierExplorer";
import Explainability from "../components/score/Explainability";
import Ewa from "../components/score/Ewa";
import ScoreCta from "../components/score/ScoreCta";

export default function Score() {
  return (
    <>
      <ScoreHero />
      <ExclusionProblem />
      <Pipeline />
      <TierExplorer />
      <Explainability />
      <Ewa />
      <ScoreCta />
    </>
  );
}
