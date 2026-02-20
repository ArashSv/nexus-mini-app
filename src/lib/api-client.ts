

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...init })
  if (!res.ok) {
    const errText = await res.text();
    let errJson: any;
    try {
      errJson = JSON.parse(errText);
    } catch {
      errJson = {};
    }
    throw new Error(errJson.error || errJson.message || 'API Request failed');
  }
  const data = await res.json();
  return data as T;
}