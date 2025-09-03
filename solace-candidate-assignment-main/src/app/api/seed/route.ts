import { NextResponse } from "next/server";
import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

/**
 * POST handler for seeding advocates data
 * @returns JSON response with seeded advocates or error
 */
export async function POST(): Promise<NextResponse> {
  try {
    // Check if database is properly configured
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    // TypeScript doesn't know the exact type of db due to conditional setup
    const records = await (db as any).insert(advocates).values(advocateData).returning();

    return NextResponse.json({ advocates: records });
  } catch (error: unknown) {
    console.error("Error seeding advocates:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Failed to seed advocates";
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
