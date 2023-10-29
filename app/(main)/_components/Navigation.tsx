"use client";

import { ChevronsLeft, MenuIcon, Plus, PlusCircle, Search, Settings, Trash } from "lucide-react";
import { useRef,ElementRef, useState, useEffect } from "react";
import {useMediaQuery} from "usehooks-ts";
import { usePathname,useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import UserItem from "./UserItem";
import { useMutation} from "convex/react";
import { api } from "@/convex/_generated/api";
import Item from "./Item";
import { toast } from "sonner";
import { DocumentList } from "./DocumentList";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import TrashBox from "./TrashBox";
import { useSettings } from "@/hooks/use-settings";
import { useSearch } from "@/hooks/user-search";
import { Navbar } from "./Navbar";

const Navigation = () => {
    const pathname = usePathname();
    const isMobile = useMediaQuery("(max-width: 768px)")
    const settings = useSettings();
    const search = useSearch();
    const isResizingRef = useRef(false);
    const sidebarRef = useRef<ElementRef<"aside">>(null);
    const navbarRef = useRef<ElementRef<"div">>(null);
    const params = useParams();

    const [isResettings,setIsResettings] = useState(false);
    const [isCollapsed,setIsCollapsed] = useState(isMobile);


    const create = useMutation(api.documents.create);

    useEffect(() => {
        if(isMobile){
            collapse();
        }else {
            resetWidth()
        }
    },[isMobile]);

    useEffect(() => {
        if(isMobile){
            collapse();
        }
    },[pathname,isMobile]);

    const handleMouseMove = (event: MouseEvent) => {
        if(!isResizingRef.current){
            return;
        }

        let newWidth = event.clientX;

        if(newWidth < 240){
            newWidth = 240;
        }
        if(newWidth > 480){
            newWidth = 480;
        }

        if(sidebarRef.current && navbarRef.current){
            sidebarRef.current.style.width = `${newWidth}px`;
            navbarRef.current.style.setProperty("left",`${newWidth}px`);
            navbarRef.current.style.setProperty("width",`calc(100% - ${newWidth}px)`);
        }


    }
    const handleMouseUp = () => {
        isResizingRef.current = false;
        document.removeEventListener("mousemove",handleMouseMove);
        document.removeEventListener("mouseup",handleMouseUp);

    }

    const handleMouseDown = (event:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        event.stopPropagation();
        isResizingRef.current = true;
        document.addEventListener("mousemove",handleMouseMove);
        document.addEventListener("mouseup",handleMouseUp);
    }


    const resetWidth = () => {
        if(sidebarRef.current && navbarRef.current){
            setIsResettings(false);
            setIsResettings(true);


            sidebarRef.current.style.width = isMobile ? '100%' : "240px";
            navbarRef.current.style.setProperty(
                "width",
                isMobile ? "0" : "calc(100% - 240px)"
            );
            navbarRef.current.style.setProperty(
                "left",
                isMobile ? "100%" : "240px"
            );

            setTimeout( () => setIsResettings(false),300)
        }
    }

    const collapse = () => {
        if(sidebarRef.current && navbarRef.current){
            setIsCollapsed(true);
            setIsResettings(true);

            sidebarRef.current.style.width = "0";
            navbarRef.current.style.setProperty("width" , '100%');
            navbarRef.current.style.setProperty("left" , "0");
            setTimeout( () => setIsResettings(false),300)
        }
    }

    const handleClick = () => {
        const promise = create({title : "Untitled"});
        toast.promise(promise,{
            loading: "creating a new note",
            success : "New note created",
            error : "Failed to create note"
        })
    }

    return (
        <>
            <aside ref={sidebarRef}
             className={
                cn("group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
                    isResettings && "transition-all ease-in-out duration-300",
                    isMobile && "w-0" 
                )
             }
             >
                <div 
                onClick={collapse}
                className={cn("h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
                isMobile && "opacity-100",
                )} 
                 role="button">
                    <ChevronsLeft/>
                </div>
                <div>
                    <UserItem/>
                    <Item
                    label="Search"
                    icon={Search}
                    isSearch
                    onClick={search.onOpen}
                    />
                    <Item
                    label="Settings"
                    icon={Settings}
                    onClick={settings.onOpen}
                    />
                    <Item
                        onClick={handleClick}
                        label="New Page"
                        icon={PlusCircle}
                    />
                </div>
                <div className="mt-4">
                   <DocumentList/>
                   <Item
                        onClick={handleClick}
                        label="Add a page"
                        icon={Plus}
                    />
                    <Popover>
                        <PopoverTrigger className="w-full mt-4">
                        <Item
                            label="Trash"
                            icon={Trash}
                        />
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-72" side={isMobile ? "bottom" : "right"}>
                            <TrashBox/>
                        </PopoverContent>
                    </Popover>
                </div>
                <div 
                onMouseDown={handleMouseDown}
                onClick={resetWidth}
                className="opacity-0 group-hover/sidebar:opacity-100 transition 
                cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"/>
            </aside>
            <div
            onClick={resetWidth}
             className={
                cn("absolute top-0 z-[99999] left-60 w-[calc(100% - 240px)]",
                isResettings && "transition-all ease-in-out duration-300",
                isMobile && "left-0 w-full"
                )
            } ref={navbarRef}> 
                {!!params.documentId  ? (
                    <Navbar
                    isCollapsed={isCollapsed}
                    onResizeWith={resetWidth}
                    />
                ) : (
                <nav className="bg-transparent px-3 py-2 w-full">
                    {isCollapsed && <MenuIcon role="button" className="h-6 w-6 text-muted-foreground"/>}
                </nav>
                )}
            </div>
        </>
    )
}

export default Navigation;