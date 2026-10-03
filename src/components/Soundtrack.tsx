import React from "react";
import { Html5Audio, interpolate, Sequence, staticFile } from "remotion";
import { FPS, MUSIC_DUCKED_VOLUME, MUSIC_VOLUME, SFX_VOLUME, VOICE_VOLUME } from "../config";

export type Sfx = { name: "whoosh" | "thud" | "pop" | "shutter" | "ding" | "notif"; at: number; volume?: number };

type Voice = { id: string; start: number; duration: number };

/** Volume de la musique à la frame `f` : baisse en douceur pendant la voix off. */
const musicVolume = (f: number, voice: Voice[]) => {
  const RAMP = 6;
  let duck = 0;
  for (const v of voice) {
    const a = v.start * FPS;
    const b = (v.start + v.duration) * FPS;
    duck = Math.max(duck, interpolate(f, [a - RAMP, a, b, b + RAMP * 2], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  }
  return MUSIC_VOLUME + (MUSIC_DUCKED_VOLUME - MUSIC_VOLUME) * duck;
};

/** Musique + voix off + bruitages. `at` des sfx est en frames, `start` des voix en secondes. */
export const Soundtrack: React.FC<{
  music: string;
  voice: Voice[];
  sfx: Sfx[];
}> = ({ music, voice, sfx }) => (
  <>
    <Html5Audio src={staticFile(music)} volume={(f) => musicVolume(f, voice)} />
    {voice.map((v) => (
      <Sequence key={v.id} from={Math.round(v.start * FPS)} layout="none" name={`Voix ${v.id}`}>
        <Html5Audio src={staticFile(`audio/voice/${v.id}.mp3`)} volume={VOICE_VOLUME} />
      </Sequence>
    ))}
    {sfx.map((s, i) => (
      <Sequence key={`${s.name}-${i}`} from={s.at} layout="none" name={`Sfx ${s.name}`}>
        <Html5Audio src={staticFile(`audio/sfx/${s.name}.wav`)} volume={(s.volume ?? 1) * SFX_VOLUME} />
      </Sequence>
    ))}
  </>
);
