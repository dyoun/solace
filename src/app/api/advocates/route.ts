import { NextResponse } from "next/server";
// import db from "../../../db";
// import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";
import type { AdvocatesApiResponse, ApiErrorResponse } from "@/types";

/**
 * GET handler for advocates API endpoint
 * @returns JSON response with advocate data or error
 */
export async function GET(): Promise<NextResponse<AdvocatesApiResponse | ApiErrorResponse>> {
  try {
    // Uncomment these lines to use a database
    // const data = await db.select().from(advocates);

    const data = advocateData;

    return NextResponse.json({ data } as AdvocatesApiResponse);
  } catch (error: unknown) {
    console.error("Error fetching advocates:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    
    return NextResponse.json(
      { 
        error: errorMessage,
        status: 500 
      } as ApiErrorResponse,
      { status: 500 }
    );
  }
}
