import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";

/**
 * Undergraduate teaching schematic, not a scale anatomical drawing.
 * Viewer-left denotes the patient's anatomical right.
 * Venae cavae are simplified as one return pathway.
 * Blue represents oxygen-poor blood by convention; blood itself is not blue.
 * The highlighted stages explain a continuous, simultaneous circulation.
 */
type Point = readonly [number, number];

const BLUE = "#4BA9F2";
const RED = "#F87171";
const PALE = "#DCE8F5";
const FG = "#F7FAFF";

const blueRoute: Point[] = [
  [1040, 630], [1040, 760], [125, 760], [125, 305],
  [225, 305], [305, 305], [305, 550], [420, 550],
  [420, 165], [930, 165], [1040, 270],
];

const redRoute: Point[] = [
  [1040, 270], [850, 270], [670, 305], [670, 550],
  [785, 550], [785, 95], [1170, 95], [1170, 630],
  [1040, 630],
];

const steps = [
  {start: 0, end: 120, label: "The heart's double circulation",
    detail: "Two connected circuits deliver oxygen and return blood for re-oxygenation.",
    focus: "both"},
  {start: 120, end: 410, label: "1  Body to right heart",
    detail: "Venae cavae carry oxygen-poor blood into the right atrium. It flows through the tricuspid valve into the right ventricle.",
    focus: "blue"},
  {start: 410, end: 690, label: "2  Right heart to lungs",
    detail: "The right ventricle ejects blood through the pulmonary valve into the pulmonary trunk and pulmonary arteries.",
    focus: "blue"},
  {start: 690, end: 900, label: "3  Gas exchange in the lungs",
    detail: "In pulmonary capillaries, blood releases carbon dioxide and takes up oxygen.",
    focus: "both"},
  {start: 900, end: 1170, label: "4  Lungs to left heart",
    detail: "Pulmonary veins return oxygen-rich blood to the left atrium. Blood then crosses the mitral valve into the left ventricle.",
    focus: "red"},
  {start: 1170, end: 1480, label: "5  Left heart to the body",
    detail: "The left ventricle ejects blood through the aortic valve into the aorta and systemic arteries.",
    focus: "red"},
  {start: 1480, end: 1800, label: "Review  Both circuits run together",
    detail: "The right and left ventricles eject blood during the same cardiac cycle. Valves maintain one-way flow.",
    focus: "both"},
] as const;

const lengths = (points: ReadonlyArray<Point>) =>
  points.slice(1).map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1]));

function pointOnPath(points: ReadonlyArray<Point>, fraction: number): Point {
  const segments = lengths(points);
  const total = segments.reduce((sum, length) => sum + length, 0);
  let distance = (((fraction % 1) + 1) % 1) * total;
  for (let i = 0; i < segments.length; i++) {
    if (distance <= segments[i] || i === segments.length - 1) {
      const t = segments[i] === 0 ? 0 : distance / segments[i];
      return [
        points[i][0] + (points[i + 1][0] - points[i][0]) * t,
        points[i][1] + (points[i + 1][1] - points[i][1]) * t,
      ];
    }
    distance -= segments[i];
  }
  return points[points.length - 1];
}

const Route = ({points, color, frame, opacity}: {
  points: Point[];
  color: string;
  frame: number;
  opacity: number;
}) => {
  const positions = points.map((p) => p.join(",")).join(" ");
  return (
    <g opacity={opacity}>
      <polyline
        points={positions}
        fill="none"
        stroke={color}
        strokeWidth={20}
        strokeOpacity={0.14}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points={positions}
        fill="none"
        stroke={color}
        strokeWidth={7}
        strokeOpacity={0.85}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {Array.from({length: 12}, (_, index) => {
        const [cx, cy] = pointOnPath(points, (frame / 420 + index / 12) % 1);
        return (
          <circle
            key={index}
            cx={cx}
            cy={cy}
            r={index % 3 === 0 ? 10 : 7}
            fill={color}
            stroke="#F5FBFF"
            strokeWidth={1.3}
            opacity={0.92}
          />
        );
      })}
    </g>
  );
};

const Chamber = ({x, y, label, subtitle, color, strong}: {
  x: number;
  y: number;
  label: string;
  subtitle: string;
  color: string;
  strong?: boolean;
}) => (
  <g>
    <rect
      x={x} y={y} width={184} height={142} rx={46}
      fill={color} fillOpacity={strong ? 0.23 : 0.15}
      stroke={color} strokeWidth={strong ? 6 : 4}
      strokeOpacity={0.93}
    />
    <text x={x + 92} y={y + 63} textAnchor="middle"
      fill={FG} fontSize={29} fontWeight={800}>{label}</text>
    <text x={x + 92} y={y + 101} textAnchor="middle"
      fill={PALE} fontSize={20}>{subtitle}</text>
  </g>
);

const Valve = ({x, y, label, color}: {
  x: number;
  y: number;
  label: string;
  color: string;
}) => (
  <g>
    <circle cx={x} cy={y} r={14} fill="#101E35" stroke={color} strokeWidth={5}/>
    <text x={x + 19} y={y + 8} fill={PALE} fontSize={21}
      fontWeight={650}>{label}</text>
  </g>
);

const HeartDiagram = ({frame, blueOpacity, redOpacity}: {
  frame: number;
  blueOpacity: number;
  redOpacity: number;
}) => (
  <svg viewBox="0 0 1250 840" width="100%" height="100%"
    role="img" aria-label="Diagram of the heart and pulmonary and systemic blood flow">
    <defs>
      <radialGradient id="heartBackdrop">
        <stop stopColor="#284261"/>
        <stop offset="1" stopColor="#112238"/>
      </radialGradient>
    </defs>
    <rect x={12} y={12} width={1226} height={816} rx={38}
      fill="#101D32" stroke="#34465D" strokeWidth={2}/>
    <rect x={183} y={210} width={642} height={454} rx={130}
      fill="url(#heartBackdrop)" stroke="#8497A9" strokeOpacity={0.37}
      strokeWidth={8}/>
    <text x={500} y={245} textAnchor="middle" fill="#B6C8D9"
      fontSize={22} letterSpacing={3}>FOUR-CHAMBER HEART</text>
    <line x1={500} y1={265} x2={500} y2={648}
      stroke="#AFC0D1" strokeWidth={10} strokeOpacity={0.7}/>
    <text x={305} y={280} textAnchor="middle" fill={BLUE}
      fontSize={21} letterSpacing={2}>ANATOMICAL RIGHT</text>
    <text x={670} y={280} textAnchor="middle" fill={RED}
      fontSize={21} letterSpacing={2}>ANATOMICAL LEFT</text>

    <Route points={blueRoute} color={BLUE} frame={frame} opacity={blueOpacity}/>
    <Route points={redRoute} color={RED} frame={frame + 80} opacity={redOpacity}/>

    <Chamber x={215} y={290} label="RIGHT" subtitle="ATRIUM" color={BLUE}/>
    <Chamber x={215} y={490} label="RIGHT" subtitle="VENTRICLE" color={BLUE}/>
    <Chamber x={578} y={290} label="LEFT" subtitle="ATRIUM" color={RED}/>
    <Chamber x={578} y={490} label="LEFT" subtitle="VENTRICLE" color={RED} strong/>

    <Valve x={305} y={459} label="Tricuspid" color={BLUE}/>
    <Valve x={420} y={550} label="Pulmonary" color={BLUE}/>
    <Valve x={670} y={459} label="Mitral" color={RED}/>
    <Valve x={785} y={550} label="Aortic" color={RED}/>

    <text x={140} y={706} fill="#A6D8FC" fontSize={24} fontWeight={700}>
      Venae cavae
    </text>
    <text x={530} y={149} fill="#A6D8FC" fontSize={24} fontWeight={700}>
      Pulmonary arteries
    </text>
    <text x={815} y={322} fill="#FDB6B6" fontSize={23} fontWeight={700}>
      Pulmonary veins
    </text>
    <text x={860} y={75} fill="#FDB6B6" fontSize={24} fontWeight={700}>
      Aorta
    </text>

    <g>
      <ellipse cx={1040} cy={265} rx={97} ry={107}
        fill="#184A61" stroke="#73D3DA" strokeWidth={4}/>
      <path d="M1040 184 V345 M1040 220 L998 245 M1040 255 L1084 278
        M1040 284 L996 307" fill="none" stroke="#98E0DE"
        strokeWidth={9} strokeLinecap="round"/>
      <text x={1040} y={399} textAnchor="middle" fill="#D1F7F2"
        fontSize={31} fontWeight={800}>LUNGS</text>
      <text x={1040} y={427} textAnchor="middle" fill="#ADC8D4"
        fontSize={19}>Pulmonary capillaries</text>
    </g>
    <g>
      <rect x={955} y={578} width={171} height={112} rx={38}
        fill="#394559" stroke="#C8D1DE" strokeWidth={4}/>
      <path d="M1040 598 v71 m0 -39 h-47 m47 0 h47"
        stroke="#C5D5E2" strokeWidth={7} strokeLinecap="round"/>
      <text x={1040} y={720} fill="#F2F6FC" fontSize={31}
        fontWeight={800} textAnchor="middle">BODY</text>
      <text x={1040} y={746} fill="#BECDE0" fontSize={20}
        textAnchor="middle">Systemic capillaries</text>
    </g>
    <text x={35} y={800} fill="#B5C6D8" fontSize={19}>
      Schematic: blood pathways simplified; anatomical orientation shown as anterior view.
    </text>
  </svg>
);

export const HeartCirculation = () => {
  const frame = useCurrentFrame();
  const stageIndex = Math.max(0, steps.findIndex((s) => frame < s.end));
  const step = steps[stageIndex];
  const blueOpacity = step.focus === "red" ? 0.19 : 1;
  const redOpacity = step.focus === "blue" ? 0.19 : 1;
  const fade = interpolate(frame, [0, 24, 1760, 1799], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(135deg, #071323 0%, #142841 100%)",
      color: FG, fontFamily: "Arial, Helvetica, sans-serif", opacity: fade,
    }}>
      <div style={{position: "absolute", left: 68, top: 44}}>
        <div style={{fontSize: 23, letterSpacing: 5, color: "#8CD4DC"}}>
          HUMAN PHYSIOLOGY • DIGITAL TEXTBOOK
        </div>
        <div style={{fontSize: 58, fontWeight: 900, marginTop: 8}}>
          Blood circulation through the human heart
        </div>
      </div>
      <div style={{
        position: "absolute", left: 64, top: 172, width: 1360, height: 790,
      }}>
        <HeartDiagram frame={frame}
          blueOpacity={blueOpacity} redOpacity={redOpacity}/>
      </div>
      <div style={{
        position: "absolute", left: 1450, top: 185, width: 400, height: 795,
        padding: "32px 30px", boxSizing: "border-box",
        background: "#1D3149", border: "2px solid #39546F", borderRadius: 30,
      }}>
        <div style={{fontSize: 23, color: "#8BDCE0", letterSpacing: 3}}>
          HOW BLOOD FLOWS
        </div>
        <div style={{height: 2, background: "#38546A", marginTop: 18}}/>
        <div style={{fontSize: 37, fontWeight: 800, marginTop: 34,
          lineHeight: 1.16}}>{step.label}</div>
        <div style={{fontSize: 26, lineHeight: 1.5, color: "#D7E6F4",
          marginTop: 26}}>{step.detail}</div>
        <div style={{position: "absolute", bottom: 126, left: 30, right: 30}}>
          <div style={{display: "flex", alignItems: "center", gap: 10,
            fontSize: 21, color: "#DCEAF6"}}>
            <span style={{width: 17, height: 17, background: BLUE,
              borderRadius: 100}}/>
            Oxygen-poor blood
          </div>
          <div style={{display: "flex", alignItems: "center", gap: 10,
            fontSize: 21, marginTop: 17, color: "#DCEAF6"}}>
            <span style={{width: 17, height: 17, background: RED,
              borderRadius: 100}}/>
            Oxygen-rich blood
          </div>
          <div style={{fontSize: 18, lineHeight: 1.3, marginTop: 21,
            color: "#9EB4C8"}}>
            Blue is a teaching convention; deoxygenated blood is dark red.
          </div>
        </div>
        <div style={{position: "absolute", bottom: 31, left: 30, right: 30,
          display: "flex", gap: 7}}>
          {steps.map((s, index) => (
            <div key={s.start} style={{
              height: 9, flex: 1, borderRadius: 6,
              background: index <= stageIndex ? "#79DFDA" : "#344A65",
            }}/>
          ))}
        </div>
      </div>
      <div style={{position: "absolute", left: 80, bottom: 31,
        fontSize: 20, color: "#AFC3D6"}}>
        Teaching sequence highlights one pathway at a time; circulation is continuous.
      </div>
      <div style={{position: "absolute", right: 78, bottom: 31,
        fontSize: 20, color: "#AFC3D6"}}>
        60 s • 30 fps • 1920 × 1080
      </div>
    </AbsoluteFill>
  );
};
