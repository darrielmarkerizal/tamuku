import { cn } from "@/lib/cn";

export type MascotState = "vibrant" | "cheerful" | "tired" | "pucat";

const fillByState: Record<MascotState, string> = {
  vibrant: "#ff3d8a",
  cheerful: "#ff8fb6",
  tired: "#ffd1e3",
  pucat: "#ffe4ec",
};

interface MascotProps {
  state?: MascotState;
  size?: number;
  className?: string;
}

export function Mascot({ state = "vibrant", size = 120, className }: MascotProps) {
  const fill = fillByState[state];
  const eyeClosed = state === "tired" || state === "pucat";

  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      role="img"
      aria-label="Hemo, maskot sel darah merah Tamuku"
      className={cn("drop-shadow-[2px_2px_0_#1a0a14]", className)}
    >
      <circle
        cx="60"
        cy="62"
        r="44"
        fill={fill}
        stroke="#1a0a14"
        strokeWidth="3.5"
      />
      <circle cx="46" cy="44" r="7" fill="#ffe4ec" opacity="0.7" />
      {eyeClosed ? (
        <>
          <path d="M40 56 Q46 62 52 56" stroke="#1a0a14" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M68 56 Q74 62 80 56" stroke="#1a0a14" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="46" cy="58" r="5" fill="#1a0a14" />
          <circle cx="74" cy="58" r="5" fill="#1a0a14" />
          <circle cx="47.5" cy="56" r="1.5" fill="#ffffff" />
          <circle cx="75.5" cy="56" r="1.5" fill="#ffffff" />
        </>
      )}
      <path
        d="M44 76 Q60 90 76 76"
        stroke="#1a0a14"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      {state === "vibrant" && (
        <>
          <circle cx="38" cy="74" r="3" fill="#ff3d8a" opacity="0.6" />
          <circle cx="82" cy="74" r="3" fill="#ff3d8a" opacity="0.6" />
        </>
      )}
    </svg>
  );
}
