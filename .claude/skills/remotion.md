# Remotion Skill

## Overview
Use Remotion to create programmatic videos with React. Remotion lets you write videos using React components, render them as MP4/WebM, and preview them in the browser.

## When to Use
TRIGGER when: the user asks to create a video, animate something, generate motion graphics, or mentions Remotion.

## Setup

To initialize a new Remotion project in this repo:

```bash
npx create-video@latest --template blank
```

Or add Remotion to the existing project:

```bash
npm init -y
npm install remotion @remotion/cli @remotion/player react react-dom
npm install -D typescript @types/react
```

## Project Structure

A Remotion project typically has:

```
src/
  Root.tsx           # Register compositions here
  MyComposition.tsx  # Video component(s)
  index.ts           # Entry point (registerRoot)
remotion.config.ts   # Remotion configuration
package.json
tsconfig.json
```

## Key Concepts

### Composition Registration (src/Root.tsx)
```tsx
import { Composition } from "remotion";
import { MyVideo } from "./MyVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MyVideo"
      component={MyVideo}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
```

### Entry Point (src/index.ts)
```ts
import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";
registerRoot(RemotionRoot);
```

### Video Component (src/MyVideo.tsx)
```tsx
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";

export const MyVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const scale = spring({ frame, fps, config: { damping: 10 } });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f0f1e" }}>
      <div style={{ opacity, transform: `scale(${scale})` }}>
        <h1 style={{ color: "white", fontSize: 80 }}>Hello Remotion</h1>
      </div>
    </AbsoluteFill>
  );
};
```

### Remotion Config (remotion.config.ts)
```ts
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
```

## Core APIs

- **`useCurrentFrame()`** - Returns the current frame number.
- **`useVideoConfig()`** - Returns `{ fps, durationInFrames, width, height }`.
- **`interpolate(frame, inputRange, outputRange, options?)`** - Maps frame values to animated values. Use `extrapolateRight: "clamp"` to prevent overshoot.
- **`spring({ frame, fps, config? })`** - Physics-based spring animation. Config options: `damping`, `mass`, `stiffness`, `overshootClamping`.
- **`<Sequence from={frame} durationInFrames={n}>`** - Offsets time for children. Children see frame 0 when the sequence starts.
- **`<AbsoluteFill>`** - Full-size absolutely positioned container.
- **`<Audio src={staticFile("audio.mp3")} />`** - Add audio.
- **`<Img src={staticFile("image.png")} />`** - Add images from `public/`.
- **`staticFile(name)`** - Reference files in the `public/` folder.

## Animation Patterns

### Staggered entrance
```tsx
const items = ["Item 1", "Item 2", "Item 3"];
items.map((item, i) => (
  <Sequence key={i} from={i * 15}>
    <FadeIn>{item}</FadeIn>
  </Sequence>
));
```

### Color interpolation
```tsx
import { interpolateColors } from "remotion";
const color = interpolateColors(frame, [0, 60], ["#00c8ff", "#ff5078"]);
```

### Easing
```tsx
import { Easing } from "remotion";
interpolate(frame, [0, 30], [0, 1], { easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
```

## Commands

```bash
# Preview in browser
npx remotion studio

# Render to MP4
npx remotion render src/index.ts MyVideo out/video.mp4

# Render specific frames
npx remotion render src/index.ts MyVideo out/video.mp4 --frames=0-90

# Render as GIF
npx remotion render src/index.ts MyVideo out/video.gif --image-format=png

# Get composition info
npx remotion compositions src/index.ts
```

## Best Practices

1. **Use `interpolate` with `clamp`** to prevent values from going beyond intended range.
2. **Use `<Sequence>`** to organize timeline sections - it resets the frame counter for children.
3. **Use `spring()`** for natural-feeling animations instead of linear interpolation.
4. **Keep compositions pure** - no side effects, same frame = same output.
5. **Use `staticFile()`** for assets in the `public/` directory.
6. **Set `durationInFrames` based on fps** - e.g., 10 seconds at 30fps = 300 frames.
7. **Prefer `AbsoluteFill`** for layering elements in the video.
