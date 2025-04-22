import RecurringPattern from "./recurringPattern";

interface Schedulable {
  startDate?: string,
  endDate?: string,
  recurringPattern: RecurringPattern
}

export default Schedulable
