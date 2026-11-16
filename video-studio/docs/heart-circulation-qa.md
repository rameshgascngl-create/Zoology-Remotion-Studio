# HumanHeartCirculation — first Remotion composition

## Design intent
60 seconds, 1920 × 1080, 30 fps, 1800 frames.
A clearly labelled schematic of **normal adult double circulation** for undergraduate teaching.
No external images, reused copyrighted plates or third-party fonts are required.
Animated circles are conceptual blood-flow tracers, not a single erythrocyte's journey.

## Scientific flow audit
1. Body / systemic veins → superior or inferior vena cava → right atrium.
2. Right atrium → tricuspid valve → right ventricle.
3. Right ventricle → pulmonary valve → pulmonary trunk / arteries → pulmonary capillaries.
4. Pulmonary capillaries: CO2 leaves blood and O2 enters blood.
5. Pulmonary veins → left atrium → mitral valve → left ventricle.
6. Left ventricle → aortic valve → aorta → systemic arteries → body tissues.

The **pulmonary arteries carry oxygen-poor blood**; **pulmonary veins carry oxygen-rich blood**.
The **anatomical right side** appears on the **viewer-left**.
Blue and red are educational conventions; actual oxygen-poor blood is dark red.
Both circuits operate simultaneously. Sequential emphasis is for teaching only.
The drawing is schematic, not to anatomical scale, and the two cavae are represented by a combined pathway.

References:
- https://www.nhlbi.nih.gov/health/heart/blood-flow
- https://www.nhlbi.nih.gov/health/heart/anatomy
- https://www.heart.org/en/health-topics/congenital-heart-defects/about-congenital-heart-defects/how-the-healthy-heart-works

## Local validation in GitHub Codespaces
From the repository root:
\`\`\`bash
git fetch origin
git switch feat/heart-circulation-first-video
cd video-studio
npm ci
npm run lint
npx remotion compositions
npm run dev
\`\`\`

Open the existing Studio browser tab or the forwarded Codespaces port. Select
**Zoology → HumanHeartCirculation** and inspect frames:
- 0–120: introduction; two routes visible (0 begins with a fade-in)
- 120–410: venae cavae, right atrium, tricuspid valve, right ventricle
- 410–690: pulmonary valve and pulmonary arteries
- 690–900: exchange in lung capillaries
- 900–1170: pulmonary veins, left atrium, mitral valve
- 1170–1480: left ventricle, aortic valve, aorta
- 1480–1799: simultaneous pulmonary and systemic circulation recap

The motion should be smooth. Check label legibility at 100% and 50%,
verify no text overlap, verify arrows/tracers travel in the right direction,
and inspect frame 890 and 900 for continuity.
The video contains **no narration** in this initial version.

After reviewing and approving the feature branch, merge its pull request.
Rendered MP4 files should be shared via artifacts or releases; they are not
tracked in the Git repository.
