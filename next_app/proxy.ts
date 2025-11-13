import { NextRequest, NextResponse, ProxyConfig } from "next/server";

export function proxy(request: NextRequest) {
  const headerValue = request.headers.get("Authorization");
  if (headerValue) {
    const [, token] = headerValue.split(/\s+/);
    console.log(token);
  } else {
    return NextResponse.next();
  }
}

export const config: ProxyConfig = {
  matcher: [
    {
      source: "/api/:path*",
    },
  ],
};
