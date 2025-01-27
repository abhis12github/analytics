import { supabase } from "@/config/supabaseConfig";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS(request) {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req) {
    try {
        const authHeader = (await headers()).get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "Authorization header missing or invalid" },
                { status: 401, headers: corsHeaders }
            );
        }

        const apiKey = authHeader.split("Bearer ")[1];
        const { name, domain, description } = await req.json();

        // Validate input
        if (!name || !domain) {
            return NextResponse.json(
                { error: "Name and domain are required" },
                { status: 400, headers: corsHeaders }
            );
        }

        const { data: users, error: userError } = await supabase
            .from("users")
            .select("id, api");

        if (userError) {
            console.error("Error fetching users:", userError);
            return NextResponse.json(
                { error: "Internal server error" },
                { status: 500, headers: corsHeaders }
            );
        }

        // Find a matching user by comparing the provided API key with stored hashes
        let authorizedUser = null;
        for (const user of users) {
            if (user.api && await bcrypt.compareSync(apiKey,user.api)) {
                authorizedUser = user;
                break;
            }
        }

        if (!authorizedUser || users.length === 0) {
            return NextResponse.json(
                { error: "Unauthorized - Invalid API" },
                { status: 401, headers: corsHeaders }
            );
        }

        const { error: insertError } = await supabase.from("events").insert({
            event_name: name.toLowerCase(),
            website_id: domain,
            message: description || null,
        });

        if (insertError) {
            return NextResponse.json(
                { error: insertError.message },
                { status: 400, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { message: "Event created successfully" },
            { status: 201, headers: corsHeaders }
        );

    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500, headers: corsHeaders }
        );
    }
}