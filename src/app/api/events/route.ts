import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Define the Event type
type EventFromDB = {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  capacity: number;
  type: string;
  plan: string;
  presenter: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

// GET /api/events - Get all events
export async function GET() {
  try {
    const events = await prisma.$queryRaw<EventFromDB[]>`
      SELECT * FROM Event ORDER BY startDate ASC
    `;

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
