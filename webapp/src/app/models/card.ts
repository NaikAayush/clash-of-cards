export interface CardMeta {
  imgUrl: string;
  maxHealth: number;
  damage: number;
}

export class Card {
  public health: number;
  // for animation in UI
  public added: boolean;

  constructor(public meta: CardMeta) {
    this.health = meta.maxHealth;
    this.added = false;
  }

  public takeDamage(damage: number): boolean {
    if (damage < this.health) {
      this.health -= damage;
    } else {
      this.health = 0;
    }

    return this.isAlive();
  }

  public isAlive(): boolean {
    return this.health > 0;
  }
}
