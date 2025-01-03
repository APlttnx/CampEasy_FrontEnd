export function toCurrency(amount) {
    return `€ ${amount.toFixed(2)}`;
  }
export function addDay(date) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() +1);
    return (newDate);
  }
  