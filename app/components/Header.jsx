import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import useUser from "@/hooks/useUser";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import Logo from "./Logo";
import { supabase } from "@/config/supabaseConfig";
import { redirect, usePathname } from "next/navigation";
export default function Header() {
    const [user] = useUser();
    const pathname = usePathname();

    const logOut = async () => {
        await supabase.auth.signOut();
        redirect("/signin");
    }

    if (user == "no user") return <></>
    return (
        <div className="w-full border-b border-white/5 sticky bg-black z-50 bg-opacity-20 filter backdrop-blur-lg flex items-center justify-between px-6 py-3">
            <Logo size="sm" />
            <div className="flex space-x-6">
                {pathname !== '/dashboard' && <div className="items-center flex space-x-4">
                    <p className="text-sm text-white/60 hover:text-white smooth">snippet</p>
                    <Link prefetch href={"/dashboard"} className="flex items-center justify-center space-x-2 group">
                        <button className="text-sm text-white/60 group-hover:text-white smooth">dashboard</button>
                    </Link>
                    <ArrowRightIcon className="h-4 w-4 stroke-white/60 group-hover:stroke-white smooth" />
                </div>}
                <DropdownMenu>
                    <DropdownMenuTrigger className="text-white outline-none p-0 m-0 border-none">
                        <div className="flex space-x-2 items-center justify-center hover:opacity-50">
                            {user && <p className="text-sm text-white/80">
                                {user?.user_metadata.full_name.split(" ")[0]}
                            </p>}
                            {user && <img
                                className="h-8 w-8 rounded-full"
                                src={user?.user_metadata.avatar_url}
                                alt="name"
                            />}
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#0a0a0a] border-white/5 outline-none text-white bg-opacity-20 backdrop-blur-md filter ">
                        <DropdownMenuLabel className="text-white">
                            settings
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-white/5"></DropdownMenuSeparator>
                        <Link href="/settings" prefetch>
                            <DropdownMenuItem className="text-white/60 smooth cursor-pointer rounded-md">
                                API
                            </DropdownMenuItem>
                        </Link>
                        <Link href="/settings" prefetch>
                            <DropdownMenuItem className="text-white/60 smooth cursor-pointer rounded-md">
                                Guide
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator className="bg-white/5"></DropdownMenuSeparator>

                        <DropdownMenuItem className="text-white/60 smooth cursor-pointer rounded-md" onClick={logOut}>
                            log out
                        </DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}