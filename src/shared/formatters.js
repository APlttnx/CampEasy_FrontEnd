export function toCurrency(amount) {
    return `€ ${amount.toFixed(2)}`;
  }
export function addDay(date) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() +1);
    return (newDate);
  }
export function formatDate(dateString) {
    const [day, month, year] = dateString.split('/'); 
    return new Date(year, month - 1, day); 
}
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
} 