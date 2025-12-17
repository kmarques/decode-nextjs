import { NextRequest, NextResponse, ProxyConfig } from "next/server";
import firebaseAdmin from "@/lib/firebase-back";
import getUser from "./services/get-user";

export async function proxy(request: NextRequest) {
  const headerValue = request.headers.get("Authorization");
  if (headerValue) {
    const [, token] = headerValue.split(/\s+/);
    try {
      const decodedToken = await firebaseAdmin
        .auth()
        .verifyIdToken(token, true);
      const user = await getUser(decodedToken.uid);
      request.headers.set("X-USER-ID", user.uid);
    } catch (error) {
      return new NextResponse(null, {
        status: 401,
      });
    }
  }
  return NextResponse.next();
}

export const config: ProxyConfig = {
  matcher: [
    {
      source: "/api/:path*",
    },
  ],
};
