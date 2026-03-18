import { NextResponse } from "next/server";
import { getAllManga } from "@/lib/data";

export async function GET() {
  try {
    const manga = await getAllManga();
    return NextResponse.json(manga);
  } catch (error) {
    return NextResponse.json({ error: "Манга мэдээллийг татахад алдаа гарлаа" }, { status: 500 });
  }
}
