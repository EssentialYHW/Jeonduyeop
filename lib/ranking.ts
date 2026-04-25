const STORAGE_KEY = "jeonduyeop_ranking";

export interface RankingEntry {
  type: string;
  count: number;
  date: string;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function recordSpeaker(type: string): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    const today = todayKey();
    if (data.date !== today) {
      data.date = today;
      data.counts = {};
    }
    data.counts[type] = (data.counts[type] || 0) + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data.counts;
  } catch {
    return {};
  }
}

export function getRanking(): { date: string; counts: Record<string, number> } {
  if (typeof window === "undefined") return { date: todayKey(), counts: {} };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { date: todayKey(), counts: {} };
    const data = JSON.parse(raw);
    if (data.date !== todayKey()) return { date: todayKey(), counts: {} };
    return { date: data.date, counts: data.counts || {} };
  } catch {
    return { date: todayKey(), counts: {} };
  }
}
