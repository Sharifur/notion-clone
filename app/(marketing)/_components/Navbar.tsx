"use client";

import { useScrolTop } from "@/hooks/user-scroll-top";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { ModeToggle } from "@/components/mode-toggle";
import { useConvexAuth } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/spinner";
import Link from "next/link";

export const Navbar = () => {
    const scrolled = useScrolTop();
    const {isAuthenticated,isLoading} = useConvexAuth();

    return (
        <div className={cn(
            "z-50 bg-background dark:bg-[#1f1f1f] fixed top-0 flex items-center w-full p-6",
        scrolled && "border-b shadow-sm")}>
            <Logo/>
            <div className="md:ml-auto md:justify-end justify-beween w-full flex items-center gap-x-2">
                {isLoading && (
                    <Spinner/>
                )}

                {!isAuthenticated && !isLoading && (
                    <>
                    <SignInButton mode="modal">
                        <Button variant="ghost" size="sm">Log In</Button>
                    </SignInButton>
                    <SignInButton mode="modal">
                        <Button size="sm">Join Jotion Free</Button>
                    </SignInButton>
                    </>
                )}
                {isAuthenticated && !isLoading && (
                    <>
                        <Button variant="ghost" size="sm">
                            <Link href="/documents">
                                Enter Jotion
                            </Link>
                        </Button>
                        <UserButton afterSignOutUrl="/" />
                    </>
                )}
                <ModeToggle/>
            </div>
        </div>
    )
}