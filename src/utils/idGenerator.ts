let counter = 1;

export function generateRequestId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 6);
  const count = (counter++).toString().padStart(3, '0');
  return `req_${timestamp}_${count}_${randomPart}`;
}
