import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const mangaCount = await prisma.manga.count();
    const chapterCount = await prisma.chapter.count();
    const allManga = await prisma.manga.findMany({
      select: { title: true, slug: true }
    });
    
    return NextResponse.json({
      status: "ok",
      database: {
        mangaCount,
        chapterCount,
        mangas: allManga,
        url: process.env.DATABASE_URL?.replace(/:.*/, ":***"),
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      message: error.message,
      stack: error.stack,
      code: error.code // Prisma error code
    }, { status: 500 });
  }
}
