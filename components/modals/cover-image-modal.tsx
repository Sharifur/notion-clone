"use client";


import {
    DialogContent,
    Dialog,
    DialogHeader
} from "@/components/ui/dialog";
import { useCoverImage } from "@/hooks/use-cover-image";
import { SingleImageDropzone } from "@/components/single-image-dropzone";
import { useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";

export const CoverImageModal = () => {
    const coverImage = useCoverImage();
    const [file, setFile] = useState<File>();
    const [isSubmitting,setIsSubmitting] = useState(false);
    const {edgestore} = useEdgeStore();

    const onChange =async (file?:File) => {
        if(file){
            setIsSubmitting(true);
            setFile(file);
            const res = await edgestore.publicFiles.upload({
                file
            })

        }
    }

    return (
        <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
            <DialogContent>
                <DialogHeader>
                    <h2 className="text-center text-lg font-semibold">Cover Image</h2>
                </DialogHeader>
                <div>
                    TODO:: Upload image
                </div>
            </DialogContent>
        </Dialog>
    )
}
