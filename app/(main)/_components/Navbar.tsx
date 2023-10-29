"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { MenuIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { Title } from "./Title";
import { Banner } from "./Banner";
import { Menu } from "./Menu";

interface NavbarProps{
    isCollapsed: boolean;
    onResizeWith: () => void;
}

export const Navbar = ( {isCollapsed, onResizeWith} : NavbarProps) => {
    const params = useParams();
    const document = useQuery(api.documents.getById,{
        documentId : params.documentId as Id<"documents">
    })

    if(document === undefined){
        return (
            <nav className="bg-background dark:bg-[#1ff1f] px-3 py-2 w-full flex justify-between items-center gap-x-4">
                <Title.Skeleton />
                <div className="flex items-center gap-x-2">
                    <Menu.Skeleton/>
                </div>
            </nav>
        )
    }

    if(document === null) {
        return null;
    }
    return (
        <>
            <nav className="bg-background dark:bg-[#1ff1f] px-3 py-2 w-full flex items-center gap-x-4">
                {
                    isCollapsed && (
                        <MenuIcon
                            role="button"
                            onClick={onResizeWith}
                            className="h-6 w-6 text-muted-foreground"
                        />
                    )
                    }
                    <div className="w-full flex items-center justify-between">
                        <Title initialData={document}/>
                        <Menu documentId={document._id}/>
                    </div>
            </nav>

            {document.isArchived && (
                <Banner documentId={document._id} />
            )}

        </>
    )
}

