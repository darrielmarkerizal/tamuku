import { cn } from "@/lib/cn";

export type MascotState = "vibrant" | "cheerful" | "tired" | "pucat";

export type MascotAccessory =
  | "pita"
  | "kacamata"
  | "topi"
  | "mahkota"
  | "headphone";

export const ACCESSORY_LABEL: Record<MascotAccessory, string> = {
  pita: "PITA",
  kacamata: "KACAMATA",
  topi: "TOPI PESTA",
  mahkota: "MAHKOTA",
  headphone: "HEADPHONE",
};

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

  accessory?: MascotAccessory | null;

  bob?: boolean;
}

export function Mascot({
  state = "vibrant",
  size = 120,
  className,
  accessory = null,
  bob = false,
}: MascotProps) {
  const fill = fillByState[state];
  const eyeClosed = state === "tired" || state === "pucat";

  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      role="img"
      aria-label="Hemo, maskot sel darah merah Tamuku"
      className={cn(
        "drop-shadow-[2px_2px_0_#1a0a14]",
        bob && "animate-bob",
        className
      )}
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
        d={
          state === "pucat"
            ? "M44 84 Q60 72 76 84"
            : state === "tired"
              ? "M46 80 Q60 76 74 80"
              : "M44 76 Q60 90 76 76"
        }
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
      {accessory && <Accessory kind={accessory} />}
    </svg>
  );
}

function Accessory({ kind }: { kind: MascotAccessory }) {
  const ink = "#1a0a14";

  switch (kind) {
    case "pita":
      return (
        <g>
          <path
            d="M22 30 L38 22 L38 38 Z"
            fill="#ffd66b"
            stroke={ink}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M54 30 L38 22 L38 38 Z"
            fill="#ffd66b"
            stroke={ink}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="38" cy="30" r="5" fill="#ffffff" stroke={ink} strokeWidth="3" />
        </g>
      );

    case "kacamata":
      return (
        <g fill="none" stroke={ink} strokeWidth="3.5">
          <circle cx="46" cy="58" r="13" fill="#ffffff" fillOpacity="0.35" />
          <circle cx="74" cy="58" r="13" fill="#ffffff" fillOpacity="0.35" />
          <path d="M59 58 L61 58" strokeLinecap="round" />
          <path d="M33 55 L24 51" strokeLinecap="round" />
          <path d="M87 55 L96 51" strokeLinecap="round" />
        </g>
      );

    case "topi":
      return (
        <g>
          <path
            d="M60 2 L78 30 L42 30 Z"
            fill="#9ae6c4"
            stroke={ink}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="60" cy="2" r="4.5" fill="#ff3d8a" stroke={ink} strokeWidth="2.5" />
          <circle cx="54" cy="22" r="2.5" fill="#ffffff" />
          <circle cx="66" cy="15" r="2.5" fill="#ffffff" />
        </g>
      );

    case "mahkota":
      return (
        <g>
          <path
            d="M34 30 L34 12 L47 22 L60 8 L73 22 L86 12 L86 30 Z"
            fill="#ffd66b"
            stroke={ink}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="60" cy="24" r="3" fill="#ff3d8a" stroke={ink} strokeWidth="2" />
        </g>
      );

    case "headphone":
      return (
        <g>
          <path
            d="M16 62 A44 44 0 0 1 104 62"
            fill="none"
            stroke={ink}
            strokeWidth="6"
            strokeLinecap="round"
          />
          <rect
            x="6"
            y="54"
            width="18"
            height="26"
            rx="6"
            fill="#ff3d8a"
            stroke={ink}
            strokeWidth="3"
          />
          <rect
            x="96"
            y="54"
            width="18"
            height="26"
            rx="6"
            fill="#ff3d8a"
            stroke={ink}
            strokeWidth="3"
          />
        </g>
      );
  }
}
