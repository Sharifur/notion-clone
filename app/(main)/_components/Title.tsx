"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useRef, useState } from "react";

interface TitleProps{
    initialData : Doc<"documents">
}
export const Title = ({initialData} : TitleProps) => {

    const inputRef = useRef<HTMLInputElement>(null)
    const update = useMutation(api.documents.update);
    const [editing,setEditing] = useState(false);
    const [title,setTitle] = useState(initialData.title || "Untitled");

    const enableInput = () => {
        setTitle(initialData.title);
        setEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.setSelectionRange(0,inputRef.current.value.length)
        },0)
    }

    const disableInput = () => {
        setEditing(false);
    }

    const onChange = (
        event : React.ChangeEvent<HTMLInputElement>
    ) => {
        setTitle(event.target.value);

        update( {
            id: initialData._id,
            title : event.target.value || "Untitled"
        })
    }

    const onKeyDown = (event : React.KeyboardEvent<HTMLInputElement>) => {
        if(event.key === 'Enter'){
            disableInput();
        }
    }

    return (
        <div className="flex items-center gap-x-1">
            {!!initialData.icon && (
                <p>{initialData.icon}</p>
            )}
            {editing ? (
                <Input
                    ref={inputRef}
                    onClick={enableInput}
                    onBlur={disableInput}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    value={title}
                    className="h-7 px-2 focus-visible:ring-transparent"
                />
            ) : (
                <Button variant="ghost" size="sm" onClick={enableInput} className="font-normal h-auto p-1">
                    {initialData.title}
                </Button>
            )}
        </div>
    )
}


Title.Skeleton = function TItleSkeleton(){
    return (
        <Skeleton className="h-3 w-20 rounded-md"/>
    )
}