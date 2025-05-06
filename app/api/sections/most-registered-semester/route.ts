import { NextResponse } from "next/server";
import sectionRepo from "../../../repos/section-repo";

export async function GET() {
  try {
    const mostRegisteredSemester =
      await sectionRepo.getMostRegisteredSemester();
    return NextResponse.json({ mostRegisteredSemester });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch most registered course =.=" },
      { status: 500 }
    );
  }
}
