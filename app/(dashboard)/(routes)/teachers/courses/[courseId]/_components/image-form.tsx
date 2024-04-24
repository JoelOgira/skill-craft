"use client"

import { useState } from 'react'
import * as z from 'zod'
import axios from 'axios'
import { Pencil, PlusCircle, ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from "next/navigation"
import { Course } from '@prisma/client'
import Image from "next/image"
import { Button } from '@/components/ui/button'
import FileUpload from '@/components/FileUpload'

type ImageFormProps = {
    initialData: Course,
    courseId: string
}

const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message: "Image is required"
    })
})

export default function ImageForm({ initialData, courseId }: ImageFormProps) {
    const router = useRouter()

    const [ isEditing, setIsEditing ] = useState(false)

    const toggleEdit = () => {
        setIsEditing(!isEditing)
    }

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values)
            toast.success("Course Image Updated")
            toggleEdit()
            router.refresh()
        } catch {
            toast.error("Something went wrong!")
        }
    }

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className="flex items-center justify-between font-medium">
                Course Image
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData?.imageUrl && (
                        <>
                            <PlusCircle className="h-6 w-6 mr-2" />
                            Add an image
                        </>
                    )}
                    {!isEditing && initialData?.imageUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Change Image
                        </>
                    )}
                </Button>
            </div>

            {!isEditing && (
                !initialData?.imageUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <ImageIcon className='h-10 w-10 text-slate-500' />
                    </div>
                ) : (
                    <div className='relative aspect-video mt-2 '>
                        <Image
                            alt="Upload"
                            fill
                            className="object-cover rounded-md"
                            src={initialData.imageUrl}
                        />
                    </div>
                )
            )}

            {isEditing && (
                <>
                    <div>
                        <FileUpload
                            endpoint='courseImage'
                            onChange={(url) => {
                                if (url) {
                                    handleSubmit({ imageUrl: url })
                                }
                            }}
                        />
                        <div className="text-xs text-muted-foreground mt-3">
                            16:9 aspect ratio recommended
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
