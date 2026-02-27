import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabasePublic = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        let role: "admin" | "faculty_advisor" | "student" | null = null;

        const { data: admin } = await supabaseAdmin
            .from("admins")
            .select("email")
            .eq("email", email)
            .maybeSingle();

        if (admin) {
            role = "admin";
        }

        if (!role) {
            const { data: faculty_advisor } = await supabaseAdmin
                .from("faculty_advisors")
                .select("email")
                .eq("email", email)
                .maybeSingle();

            if (faculty_advisor) {
                role = "faculty_advisor";
            }
        }

        if (!role) {
            const { data: student } = await supabaseAdmin
                .from("students")
                .select("email")
                .eq("email", email)
                .maybeSingle();

            if (student) {
                role = "student";
            }
        }

        if (!role) {
            return NextResponse.json(
                {
                    error: "Email is not in college records. Please contact your faculty advisor.",
                },
                { status: 400 }
            );
        }

        const { data: authData, error: authError } =
            await supabasePublic.auth.signUp({
                email,
                password,
                options: {
                     emailRedirectTo: "https://drkist.vercel.app/auth/signup",
                },
            });

        if (authError || !authData.user) {
            return NextResponse.json(
                { error: authError?.message || "SignUp failed, try again!" },
                { status: 400 }
            );
        }

        const { error: profileError } = await supabaseAdmin
            .from("profiles")
            .insert({
                id: authData.user.id,
                email,
                role,
            });

        if (profileError) {
            return NextResponse.json(
                { error: profileError.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message:
                "SignUp successfull! please check your inbox to verify your email.",
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message },
        { status: 500 });
    }
}
