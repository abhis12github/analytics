import { supabase } from "@/config/supabaseConfig";
import { NextResponse } from "next/server";

export const corsHeaders={
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS(request){
    return NextResponse.json({},{headers:corsHeaders});
}

export async function POST(req){
    const body=await req.json();
    const {domain,url,event,source} = body;

    if(!url.includes(domain)){
        return NextResponse.json({
            error:"the script points to a different domain than the current url.make sure they match"
        },{headers:corsHeaders})
    }

    if(event==="session_start"){
        await supabase.from("visits").insert([{website_id:domain,source:source ?? "Direct"}]).select();
    }

    if(event==="page_views"){
        await supabase.from("page_views").insert([{domain,page:url}])
    }
    //as we need to return anything, so returned body
    return NextResponse.json({body},{headers:corsHeaders});
}