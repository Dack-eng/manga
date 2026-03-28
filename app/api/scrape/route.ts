import { NextResponse } from "next/server";
import { autoIngestManga } from "@/lib/scraper";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const externalId = searchParams.get("id") || "123";

  try {
    const manga = await autoIngestManga(externalId);
    return NextResponse.json({ success: true, manga });
  } catch {
    return NextResponse.json({ success: false, error: "Өгөгдөл оруулахад алдаа гарлаа" }, { status: 500 });
  }
}
