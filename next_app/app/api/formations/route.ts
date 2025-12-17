import { getFormations } from "@/services/formation";
import getUser from "@/services/get-user";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  if (request.headers.has("X-USER-ID")) {
    const uid = request.headers.get("X-USER-ID");
    if (uid) {
      const user = await getUser(uid);
      console.log(user);
    }
  }
  return Response.json(await getFormations());
}
