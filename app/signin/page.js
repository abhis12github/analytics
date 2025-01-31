"use client"

import { supabase } from "@/config/supabaseConfig"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {

    const router = useRouter();
    const signIn = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo:"https://analytics-xi-five.vercel.app/dashboard/"
                // redirectTo: "http://localhost:3000/dashboard"
            }
        });
    }

    const catchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            if (user.role === 'authenticated') router.push("/dashboard")
        }
    }

    useEffect(() => {
        if (!supabase) return;
        catchUser();
    }, [supabase]);

    return (

        <div className="bg-black items-center justify-center flex w-full min-h-screen z-500">
            <button className="button flex items-center justify-center space-x-5" onClick={signIn}>
                signIn with Google
            </button>
        </div>



    )
}