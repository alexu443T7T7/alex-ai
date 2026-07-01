import { Composition } from "remotion";
import { StreetGoPromo } from "./StreetGoPromo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="StreetGoPromo"
        component={StreetGoPromo}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
