import { AbsoluteFill, Sequence } from "remotion";
import { SceneIntro } from "./scenes/SceneIntro";
import { SceneLogoReveal } from "./scenes/SceneLogoReveal";
import { SceneMap } from "./scenes/SceneMap";
import { SceneCreate } from "./scenes/SceneCreate";
import { SceneAR } from "./scenes/SceneAR";
import { SceneCommunity } from "./scenes/SceneCommunity";
import { SceneClosing } from "./scenes/SceneClosing";

export const StreetGoPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence from={0} durationInFrames={120}>
        <SceneIntro />
      </Sequence>

      <Sequence from={100} durationInFrames={140}>
        <SceneLogoReveal />
      </Sequence>

      <Sequence from={220} durationInFrames={140}>
        <SceneMap />
      </Sequence>

      <Sequence from={340} durationInFrames={140}>
        <SceneCreate />
      </Sequence>

      <Sequence from={460} durationInFrames={140}>
        <SceneAR />
      </Sequence>

      <Sequence from={580} durationInFrames={140}>
        <SceneCommunity />
      </Sequence>

      <Sequence from={700} durationInFrames={200}>
        <SceneClosing />
      </Sequence>
    </AbsoluteFill>
  );
};
