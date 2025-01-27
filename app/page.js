"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "./components/Header";
import Logo from "./components/Logo";
import { ArrowRight, ArrowUp } from "lucide-react";

export default function Home() {
  const router = useRouter();
  function handleSignIn() {
    router.push("/signin");
  }
  return (
    <div className="bg-black h-full w-full min-h-screen flex flex-col justify-center items-center">
      <div className="p-4 border-b-[0.5px] border-white/10 flex justify-between items-center w-full">
        <Logo></Logo>
        <button className="button" onClick={handleSignIn}>SignIn</button>
      </div>

      <div className="flex justify-center items-center mt-8 space-y-4 flex-col">

        <div className="flex flex-col items-center justfiy-center h-full w-[80%] md:w-[50%] lg:w-[50%] text-center mt-1 p-4">
          <h1 className="text-white/80 font-semibold text-5xl leading-tight">Easier Way To <span className="text-blue-400">Monitor Website's</span> Performance.</h1>
          <p className="text-white/30 font-normal text-md mt-3">Monitor user behavior, traffic sources, and engagement</p>
        </div>

        <div className="flex gap-5">
          <button className="button rounded-lg" onClick={handleSignIn}><span>Get Started</span></button>
        </div>

      </div>
      <div className="w-[70%] h-full border border-white/10 mt-12 m-4 shadow-sm shadow-gray-700">
        <img src="/home2.png"></img>

      </div>
      
    </div>
  );
}
