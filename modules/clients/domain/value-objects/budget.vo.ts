export class Budget {
  private readonly _value: number

  constructor(value: number) {
    if (value < 0) {
      throw new Error('Budget cannot be negative')
    }
    this._value = value
  }

  get value(): number {
    return this._value
  }

  get formatted(): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this._value)
  }

  add(amount: number): Budget {
    return new Budget(this._value + amount)
  }

  subtract(amount: number): Budget {
    return new Budget(this._value - amount)
  }

  percentage(percent: number): number {
    return (this._value * percent) / 100
  }

  isGreaterThan(other: Budget): boolean {
    return this._value > other.value
  }

  isLessThan(other: Budget): boolean {
    return this._value < other.value
  }

  equals(other: Budget): boolean {
    return this._value === other.value
  }
}