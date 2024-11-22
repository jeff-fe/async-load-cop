export function encodeToBase64(obj: any): string {
  // Convert the object to a JSON string and encode to UTF-8
  const jsonString = JSON.stringify(obj);
  // Encode UTF-8 string to Base64
  return btoa(unescape(encodeURIComponent(jsonString)));
}

export function decodeFromBase64(str: string): any {
  // Decode Base64 to UTF-8 string
  const jsonString = decodeURIComponent(escape(atob(str)));
  // Parse JSON string back to object
  return JSON.parse(jsonString);
}