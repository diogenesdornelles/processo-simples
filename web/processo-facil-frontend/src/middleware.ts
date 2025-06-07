import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  const publicRoutes = ["/login", "/registro"];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const apiUrl = process.env.API_URL || "http://localhost:8000/api";
    
    const response = await axios(`${apiUrl}/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    });

    if (!response.status || response.status < 200 || response.status >= 300) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const nextResponse = NextResponse.next();
    nextResponse.headers.set('X-User-ID', response.data.id.toString());
    nextResponse.headers.set('X-User-Email', response.data.email);
    nextResponse.headers.set('X-User-Role', response.data.role);
    nextResponse.headers.set('X-User-Name', response.data.name);
    
    return nextResponse;
    
  } catch (error) {
    console.error("Token validation error:", error);
    
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: [
    "/",
    "/home/:path*",
    "/processos/:path*", 
    "/usuarios/:path*",
  ],
};