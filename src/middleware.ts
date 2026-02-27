import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  const { pathname } = req.nextUrl;
  
  if (pathname.startsWith("/admin") || 
  pathname.startsWith("/faculty-advisor") || 
  pathname.startsWith("/student")) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
    
    const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
    
    if (!profile) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    
    if (pathname.startsWith("/admin") && profile.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    
    if (pathname.startsWith("/faculty-advisor") && profile.role !== "faculty_advisor") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    
    if (pathname.startsWith("/student") && profile.role !== "student") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
  
  if (pathname === "/" && user) {
    const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
    
    if(profile?.role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    
    if(profile?.role === "faculty_advisor") {
      return NextResponse.redirect(new URL("/faculty-advisor/dashboard", req.url));
    }
    
    if(profile?.role === "student") {
      return NextResponse.redirect(new URL("/student/dashboard", req.url));
    }
  }
  return res;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/faculty-advisor/:path*",
    "/student/:path*",
    "/",
    ],
};