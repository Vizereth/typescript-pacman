// src/game/entities/AtomView.ts
import { Container, Graphics } from "pixi.js";
import type { Atom } from "../../logic/entities/Atom.js";

export class AtomView {
  public readonly container: Container;

  private readonly nucleus: Graphics;
  private readonly electronGraphics: Graphics[];
  private readonly orbitPaths: Graphics;

  constructor() {
    this.container = new Container();

    // Initialize all graphics objects immediately
    this.orbitPaths = new Graphics();
    this.container.addChild(this.orbitPaths);

    this.nucleus = new Graphics();
    this.nucleus.circle(0, 0, 18).fill({ color: 0x8877cc, alpha: 0.9 });
    this.nucleus.stroke({ width: 2, color: 0xffffff, alpha: 0.8 });
    this.container.addChild(this.nucleus);

    // Initialize exactly 3 electron graphics (matches Atom.ts)
    this.electronGraphics = [];
    for (let i = 0; i < 3; i++) {
      const g = new Graphics();
      g.circle(0, 0, 6).fill(0xeeeedd);
      g.stroke({ width: 1, color: 0x8877cc });
      this.electronGraphics.push(g);
      this.container.addChild(g);
    }
  }

  public sync(atom: Atom): void {
    // Direct property access - no ?. operators
    const pulseScale = 1 + Math.sin(atom.pulsePhase) * 0.15;
    this.nucleus.scale.set(pulseScale);
    this.nucleus.x = atom.x;
    this.nucleus.y = atom.y;

    // Sync electrons - direct array access
    for (let i = 0; i < atom.electrons.length; i++) {
      const e = atom.electrons[i];
      const g = this.electronGraphics[i];

      g.x = atom.x + Math.cos(e.angle) * e.radius;
      g.y = atom.y + Math.sin(e.angle) * e.radius * Math.cos(e.tilt);

      const depthFactor = 0.7 + (Math.sin(e.angle) * 0.3 + 0.3);
      g.scale.set(depthFactor);
      g.alpha = depthFactor;
    }

    // Redraw orbits
    this.orbitPaths.clear();
    for (const e of atom.electrons) {
      this.orbitPaths
        .ellipse(atom.x, atom.y, e.radius, e.radius * Math.cos(e.tilt))
        .stroke({ width: 1, color: 0x8877cc, alpha: 0.2 });
    }
  }
}
