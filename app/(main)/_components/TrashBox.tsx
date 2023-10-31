"use client";

import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { Spinner } from "@/components/spinner";
import { Search, Trash, Undo } from "lucide-react";
import { Input } from "@/components/ui/input";
import ConfirmModal from "@/components/modals/confirm-modal";

const TrashBox = () => {

    const router = useRouter();
    const params = useParams();
    const documents = useQuery(api.documents.getTrash); 
    const restore = useMutation(api.documents.restore);
    const remove = useMutation(api.documents.remove);

    const [search, setSearch] = useState("");

    const filteredDocuments = documents?.filter((document) => {
        return document.title.toLocaleLowerCase().includes(search.toLocaleLowerCase());
    });

    const onClick = (documentId : string) => {
        router.push(`/documents/${documentId}`);
    }

    const onRestore = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        documentId: Id<"documents">
    ) => {
        event.stopPropagation();
        const promise = restore({id: documentId})

        toast.promise(promise,{
            success : `Restore note success`,
            error : `Restore note failed`,
            loading : `Restoring note....`,
        })
    }


    const onRemove = (
        documentId: Id<"documents">
    ) => {
        const promise = remove({id: documentId})

        toast.promise(promise,{
            success : `Deleted note`,
            error : `Delete note failed`,
            loading : `Deleting note....`,
        });
        
        if(params.documentId === documentId){
            router.push(`/documents`);
        }
    }


    if(documents === undefined){
        return (
            <div className="h-full flex items-center justify-center p-4">
                <Spinner size="lg"/>
            </div>
        )
    }


    return (
        <div className="text-sm shadow-md p-2 rounded-sm dark:bg-[#1f1f1f]">
            <div className="flex items-center gap-x-1 p-2">
                <Search className="h-4 w-4"/>
                <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
                    placeholder="Filter by page title...."
                />    
            </div> 
            <div className="mt-2 px-1 pb1 ">
                <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
                    No Documents found
                </p>
                {
                    filteredDocuments?.map((document) => (
                        <div
                        role="button"
                        key={document._id}
                        onClick={() => onClick(document._id)}
                            className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
                        >
                           <span className="truncate pl-2">{document.title}</span>
                           <div className="flex items-center">
                                <div 
                                role="button" 
                                onClick={(e) => onRestore(e,document._id)}
                                className="rounded-sm p-2 hover:bg-neutral-200  dark:hover:bg-neutral-600"
                                >
                                    <Undo className="h-4 w-4 text-muted-foreground"/>
                                </div>
                                <ConfirmModal onConfirm={() => onRemove(document._id)}>
                                    <div 
                                    role="button"
                                    className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                                    >
                                        <Trash className="h-4 w-4 text-muted-foreground" />    
                                    </div> 
                                </ConfirmModal>
                            </div> 
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default TrashBox;