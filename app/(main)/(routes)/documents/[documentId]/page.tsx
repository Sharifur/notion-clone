"use client";

import { Toolbar } from "@/components/Toolbar";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

interface DocumentPageIdProps {
    params: {
        documentId : Id<"documents">
    }
}

const DocumentPageId = ({params} : DocumentPageIdProps) => {

    const document = useQuery(api.documents.getById,{
        documentId : params.documentId
    });

    if(document === undefined) {
        return (
            <p>Loading...</p>
        )
    }

    return ( 
        <div className="pb-40">
            <div className="h-[35vh]"/>
            <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
                <Toolbar initialData={document}/>
            </div>
        </div>
     );
}
 
export default DocumentPageId;