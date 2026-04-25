import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const API_KEY = process.env.FIREBASE_API_KEY;

function firestoreUrl(docId?: string) {
  const base = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/shares`;
  return docId ? `${base}/${docId}?key=${API_KEY}` : `${base}?key=${API_KEY}`;
}

function toFirestoreFields(obj: Record<string, unknown>): Record<string, unknown> {
  const fields: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "string") fields[k] = { stringValue: v };
    else if (typeof v === "number") fields[k] = { integerValue: String(v) };
    else if (typeof v === "boolean") fields[k] = { booleanValue: v };
    else if (v === null || v === undefined) fields[k] = { nullValue: null };
    else fields[k] = { stringValue: JSON.stringify(v) };
  }
  return fields;
}

function fromFirestoreFields(fields: Record<string, Record<string, unknown>>): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(fields)) {
    if ("stringValue" in v) {
      const s = v.stringValue as string;
      try { obj[k] = JSON.parse(s); } catch { obj[k] = s; }
    } else if ("integerValue" in v) obj[k] = Number(v.integerValue);
    else if ("booleanValue" in v) obj[k] = v.booleanValue;
    else obj[k] = null;
  }
  return obj;
}

export async function POST(request: NextRequest) {
  try {
    if (!PROJECT_ID || !API_KEY) {
      return NextResponse.json({ error: "Firebase 환경변수가 설정되지 않았습니다." }, { status: 500 });
    }

    const { result, type } = await request.json();
    const id = crypto.randomBytes(5).toString("hex");

    const payload = {
      id,
      type: type ?? "analysis",
      data: JSON.stringify(result),
      createdAt: new Date().toISOString(),
    };

    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/shares?documentId=${id}&key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: toFirestoreFields(payload as unknown as Record<string, unknown>),
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || "저장 실패");
    }

    return NextResponse.json({ id, url: `/share/${id}` });
  } catch (error) {
    console.error("Share save error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "공유 링크 생성 실패" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!PROJECT_ID || !API_KEY) {
      return NextResponse.json({ error: "Firebase 환경변수 없음" }, { status: 500 });
    }

    const id = request.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id 없음" }, { status: 400 });

    const res = await fetch(firestoreUrl(id));
    if (!res.ok) return NextResponse.json({ error: "결과를 찾을 수 없습니다." }, { status: 404 });

    const doc = await res.json();
    const parsed = fromFirestoreFields(doc.fields);
    const data = typeof parsed.data === "string" ? JSON.parse(parsed.data) : parsed.data;

    return NextResponse.json({ ...parsed, data });
  } catch (error) {
    console.error("Share get error:", error);
    return NextResponse.json({ error: "불러오기 실패" }, { status: 500 });
  }
}
