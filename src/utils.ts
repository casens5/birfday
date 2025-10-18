export function capitalize(string: string): string {
  return String(string).charAt(0).toUpperCase() + String(string).slice(1);
}
