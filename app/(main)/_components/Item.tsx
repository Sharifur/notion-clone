"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
    } from "@/components/ui/dropdown-menu";
import { useMutation } from "convex/react";
import { ChevronDown, ChevronRight, LucideIcon, MoreHorizontal, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";

interface ItemProps{
    id?:Id<"documents">,
    documentIcon?:  string,
    active?: boolean,
    expanded? : boolean,
    isSearch? : boolean,
    level? : number,
    onExpand?: () => void;
    label: string;
    onClick ?: () => void;
    icon: LucideIcon
}

const Item = ({
    label,
    onClick,
    icon : Icon,
    id,documentIcon,active,expanded,isSearch,
    level = 0, 
    onExpand

} : ItemProps) => {
    const create = useMutation(api.documents.create);
    const router = useRouter()
    const CheronIcon = expanded ? ChevronDown : ChevronRight;

    const {user} = useUser();

    const archive = useMutation(api.documents.archive);

    const onArchive = (event : React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.stopPropagation();


        if(!id) return;

        const promise  = archive({id});

        toast.promise(promise, {
            success : "Note Moved to trash!",
            error : `Note moved to trash failed`,
            loading : `Moving to trash...`
        });
    }


    const handleExpand = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        onExpand?.();
    }

    const onCreate = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {

        event.stopPropagation();

        if(!id) return;

        const promise = create({title : "Untitled",parentDocument: id})
        .then( (documentId) =>{
            if(!expanded){
                onExpand?.();
            }
            // router.push(`/documents/${documentId}`);
        });

        toast.promise(promise,{
            loading : `Creating new note...`,
            success : `Note created`,
            error: `Note create failed`
        })

    }


    return (
        <div
         className={cn("group min-h[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
        active && "bg-primary/5 text-primary"
         )}
        onClick={onClick}
        role="button"
        style={{paddingLeft: level ? `${level * 12 + 12}px` : "12px"}}
        >
            {!!id && (
                <div role="button"
                onClick={handleExpand}
                className="h-full rounded-sm hove:bg-neutral-300 dark:bg-neutral-600 mr-1">
                    <CheronIcon
                        className="h-4 w-4 shrink-0 text-muted-foreground/50"
                    />
                </div>
            )}
            {documentIcon ? (
                <div>
                    {documentIcon}
                </div>
            ):(
                <Icon className="shirk--0 h-[18px] mr-2 text-muted-foreground"/>    
            )}  
            
            <span className="truncate">
                {label}
            </span>
            {isSearch && (
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span>⌘</span>K
                </kbd>
            )}
            {!!id && (
                <div 
                className="ml-auto flex items-center gap-x-2"
                >
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild
                        onClick={(e) => e.stopPropagation()}>
                            <div role="button"
                            className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hvoer:bg-neutral-600">
                                <MoreHorizontal
                                className="h-4 w-4 text-muted-foreground"/>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                        className="w-60"
                        align="start"
                        side="right"
                        forceMount
                        >
                            <DropdownMenuItem onClick={onArchive}>
                                <Trash className="w-4 h-4 mr-2"/>
                                Delete
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <div className="text-xs p-2">
                                Last edited by: {user?.fullName}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div    
                    role="button"
                    onClick={onCreate}
                    className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hvoer:bg-neutral-600"
                    >
                        <Plus className="h-4 w-4 text-muted-foreground"/>
                    </div>
                </div>
            )}
        </div>
    )
}

Item.Skeleton = function ItemSkeleton ({level} : {level?: number}) {
    return (
        <div
        className="flex gap-x-2 py-[3px]"
        style={{
            paddingLeft: level ? `${(level * 12) + 25}px` : "12px"
        }}
        >
            <Skeleton className="w-4 h-4"/>
            <Skeleton className="w-[30%]] h-4"/>
        </div>
    )
}

export default Item;