import { NextResponse } from "next/server";
import { getAllManga } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const manga = await getAllManga();
    return NextResponse.json(manga);
  } catch {
    return NextResponse.json({ error: "Манга мэдээллийг татахад алдаа гарлаа" }, { status: 500 });
  }
}
