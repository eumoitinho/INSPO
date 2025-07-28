import { startOfDay, endOfDay, isAfter, isBefore, differenceInDays } from 'date-fns'

export class DateRange {
  private readonly _startDate: Date
  private readonly _endDate: Date

  constructor(startDate: Date, endDate: Date) {
    if (isAfter(startDate, endDate)) {
      throw new Error('Start date must be before end date')
    }
    
    this._startDate = startOfDay(startDate)
    this._endDate = endOfDay(endDate)
  }

  get startDate(): Date {
    return this._startDate
  }

  get endDate(): Date {
    return this._endDate
  }

  get days(): number {
    return differenceInDays(this._endDate, this._startDate) + 1
  }

  contains(date: Date): boolean {
    return !isBefore(date, this._startDate) && !isAfter(date, this._endDate)
  }

  overlaps(other: DateRange): boolean {
    return this.contains(other._startDate) || 
           this.contains(other._endDate) ||
           other.contains(this._startDate)
  }

  equals(other: DateRange): boolean {
    return this._startDate.getTime() === other._startDate.getTime() &&
           this._endDate.getTime() === other._endDate.getTime()
  }

  toString(): string {
    return `${this._startDate.toISOString().split('T')[0]} - ${this._endDate.toISOString().split('T')[0]}`
  }
}