"use client";

import useUser from "@/hooks/useUser"
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { supabase } from "@/config/supabaseConfig";
import SyntaxHighlighter from "react-syntax-highlighter";
import { sunburst } from "react-syntax-highlighter/dist/esm/styles/hljs";
import bcrypt from "bcryptjs";

export default function SettingsPage() {
    const [user] = useUser();
    const [loading, setLoading] = useState(false);
    const [apiKey, setApiKey] = useState("");

    useEffect(() => {
        if (!user) return;
        if (user === "no user") redirect("/signin");
    }, [user]);

    const encryptData = async (plainData, encryptionKey) => {
        const initVector = crypto.getRandomValues(new Uint8Array(12));
        const encodedData = new TextEncoder().encode(plainData);
        
        const cryptoKey = await crypto.subtle.importKey(
            "raw",
            Buffer.from(encryptionKey, "base64"),
            {
                name: "AES-GCM",
                length: 256,
            },
            true,
            ["encrypt", "decrypt"]
        );
        
        const encryptedData = await crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: initVector,
            },
            cryptoKey,
            encodedData
        );
        
        return {
            encryptedData: Buffer.from(encryptedData).toString("base64"),
            initVector: Buffer.from(initVector).toString("base64"),
        };
    };

    const decryptData = async (encryptedData, initVector, encryptionKey) => {
        try {
            const cryptoKey = await crypto.subtle.importKey(
                "raw",
                Buffer.from(encryptionKey, "base64"),
                {
                    name: "AES-GCM",
                    length: 256,
                },
                true,
                ["encrypt", "decrypt"]
            );
        
            const decodedData = await crypto.subtle.decrypt(
                {
                    name: "AES-GCM",
                    iv: Buffer.from(initVector, "base64"),
                },
                cryptoKey,
                Buffer.from(encryptedData, "base64")
            );
        
            return new TextDecoder().decode(decodedData);
        } catch (error) {
            console.error("Decryption failed:", error);
            return null; 
        }
    };

    const getUserAPIs = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from("users").select().eq("user_id", user.id);
            if (error) throw error;
            
            if (data.length > 0 && data[0].encrypted_api && data[0].iv) {
                const decryptedKey = await decryptData(
                    data[0].encrypted_api,
                    data[0].iv,
                    process.env.NEXT_PUBLIC_ENCRYPTION_KEY
                );

                console.log(`decrypted key in getuserAPIs is,${decryptedKey}`);
                
                if (decryptedKey) {
                    setApiKey(decryptedKey);
                } else {
                    setApiKey(""); 
                }
            } else {
                setApiKey(""); 
            }
        } catch (error) {
            console.error("Error fetching API key:", error);
            setApiKey(""); 
        }
        setLoading(false);
    };

    const hashApiKey = async (apiKey) => {
        const salt = await bcrypt.genSaltSync(10);
        const hash = await bcrypt.hashSync(apiKey, salt);
        return hash;
    };

    const generateApiKey = async () => {
        setLoading(true);
        if (loading || !user) return;
        
        try {
            const randomString =
                Math.random().toString(36).substring(2, 300) +
                Math.random().toString(36).substring(2, 300);
            

            const hashedApiKey = await hashApiKey(randomString);
            const encryptedData = await encryptData(randomString, process.env.NEXT_PUBLIC_ENCRYPTION_KEY);
            
            const { data, error } = await supabase
                .from("users")
                .update([{ 
                    encrypted_api: encryptedData.encryptedData,
                    user_id: user.id,
                    iv: encryptedData.initVector,
                    api: hashedApiKey,
                }])
                .eq("user_id", user.id) 
                .select();
                
            if (error) throw error;
            
            setApiKey(randomString);
        } catch (error) {
            console.error("Error generating API key:", error);
            setApiKey("");
        }
        setLoading(false);
    };

    const copyApiKey = () => {
        navigator.clipboard.writeText(apiKey);
        alert("API key copied to clipboard!");
    };

    useEffect(() => {
        if (!user || !supabase) return;
        getUserAPIs();
    }, [user, supabase]);

    if (user === "no user") {
        return (
            <div>
                <Header />
                <div className="min-h-screen items-center justify-center flex flex-col w-full z-40 text-white">
                    Redirecting....
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-black items-center justify-center flex flex-col">
            <Header />
            <div className="min-h-screen items-center justify-center flex flex-col w-full z-40 text-white">
                {!apiKey && !loading && (
                    <button className="button" onClick={generateApiKey}>
                        Generate API Key
                    </button>
                )}
                {apiKey && (
                    <div className="mt-12 border-white/5 bg-black space-y-12 py-12 w-full md:w-3/4 lg:w-1/2">
                        <div className="space-y-12 px-4">
                            <p>API key</p>
                            <input 
                                disabled 
                                className="input-disabled p-3" 
                                value={apiKey} 
                                readOnly 
                                type="text" 
                            />
                            <button className="button" onClick={copyApiKey}>
                                Copy API Key
                            </button>
                        </div>
                        <div className="space-y-4 border-t border-white/5 bg-black p-6">
                            <h1 className="text-lg p-4 bg-[#0f0f0f70]">
                                You can create custom events using our api like below
                            </h1>
                            <div className="">
                                <CodeComp />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export const CodeComp = () => {
    let codeString = `
    const url = "https://analytics-xi-five.vercel.app/api/events";
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer {{apiKey}}",
    };
    const eventData = {
      name: "",//* required
      domain: "", //* required
      description: "",//optional
    };
  
    const sendRequest = async () => {
      axios
        .post(url, eventData, { headers })
        .then()
        .catch((error) => {
          console.error("Error:", error);
        });
    };`;
    return (
        <SyntaxHighlighter language="javascript" style={sunburst}>
            {codeString}
        </SyntaxHighlighter>
    );
};