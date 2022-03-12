export interface CardMeta {
  imgUrl: string;
  maxHealth: number;
  damage: number;
}

export class Card {
  public health: number;

  constructor(public meta: CardMeta) {
    this.health = meta.maxHealth;
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
