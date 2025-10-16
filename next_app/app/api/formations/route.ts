import { getFormations } from "@/services/formation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return Response.json(await getFormations());
}
