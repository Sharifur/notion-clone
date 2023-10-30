"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ImageIcon, X } from "lucide-react";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";


interface CoverImageProps {
    url?: string,
    preview?: boolean
}

export const Cover = ({url,preview} : CoverImageProps) => {
    const params = useParams()
    const coverImage = useCoverImage();
    const removeCoverImage = useMutation(api.documents.removeCoverImage);

    const onRemove = () => {
        removeCoverImage({
            id : params.documentId as Id<"documents">
        });

    }
    
    return (
        <div className={cn(
            "relative w-full h-[35vh] group",
            !url && "h-[12vh]",
            url && "bg-muted"
        )}>
            
        {!!url && (
            <Image
                src={url}
                fill 
                className="object-cover"
                alt="cover image"
            />
        )}
        {url && !preview && (
            <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
                <Button
                onClick={coverImage.onOpen}
                variant={"outline"}
                size={"sm"}
                className="text-muted-foreground text-xs"
                >
                    <ImageIcon className="h-4 w-4 mr-2"/>
                    Change Cover 
                </Button>

                <Button
                onClick={onRemove}
                variant={"outline"}
                size={"sm"}
                className="text-muted-foreground text-xs"
                >
                    <X className="h-4 w-4 mr-2"/>
                   Remove
                </Button>
            
            </div>
        )}
        </div>
    )
}