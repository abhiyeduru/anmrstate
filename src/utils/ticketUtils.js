export function formatTicketNumber(num) {
  return `LUCKY-${String(num).padStart(4, "0")}`;
}
