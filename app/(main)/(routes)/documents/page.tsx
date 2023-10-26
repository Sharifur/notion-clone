"use client";

import { Button } from "@/components/ui/Button";
import { useConvexAuth } from "convex/react";
import Image from "next/image";
import {useUser} from "@clerk/clerk-react";
import { PlusCircle } from "lucide-react";

const DocumentsPage = () => {
const  {user} = useUser();

    return (
        <div className="h-full flex items-center justify-center flex-col space-y-4">
            <Image
                src="/empty.png"
                alt="empty"
                width="300"
                height="300"
                className="dark:hidden"
            />
             <Image
                src="/empty-dark.png"
                alt="empty"
                width="300"
                height="300"
                className="dark:block hidden"
            />
            <h2 className="text-lg font-medium">
                Welcome To {user?.firstName}&apos;s Jotion
            </h2>
            <Button>
                <PlusCircle  className="h-4 w-4 mr-2"/>
                Create a note
            </Button>
        </div>
    )
}

export default DocumentsPage;

