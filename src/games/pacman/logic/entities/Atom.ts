export interface Electron {
  angle: number;
  radius: number;
  speed: number; // радиан в секунду
  tilt: number;  // наклон орбиты для 3D-эффекта
}

export class Atom {
  public x: number;
  public y: number;
  public pulsePhase: number = 0;
  public electrons: Electron[] = [];

  constructor(public readonly centerX: number, public readonly centerY: number) {
    this.x = centerX;
    this.y = centerY;

    // Создаем 3 электрона с разными фазами и наклонами
    for (let i = 0; i < 3; i++) {
      this.electrons.push({
        angle: (Math.PI * 2 / 3) * i,
        radius: 80 + i * 25,
        speed: 1.5 + i * 0.5, 
        tilt: (Math.PI / 3) * i // 0, 60, 120 градусов
      });
    }
  }

  /**
   * Обновление логики. deltaMS - реальное время между кадрами.
   */
  public update(deltaMS: number): void {
    const dtSec = deltaMS / 1000; // Переводим в секунды для независимости от FPS

    // 1. Пульсация ядра
    this.pulsePhase += dtSec * 3;

    // 2. Легкое парение всего атома
    this.x = this.centerX + Math.sin(this.pulsePhase * 0.5) * 15;
    this.y = this.centerY + Math.cos(this.pulsePhase * 0.7) * 15;

    // 3. Вращение электронов
    for (const e of this.electrons) {
      e.angle += e.speed * dtSec;
      if (e.angle > Math.PI * 2) e.angle -= Math.PI * 2;
    }
  }
}