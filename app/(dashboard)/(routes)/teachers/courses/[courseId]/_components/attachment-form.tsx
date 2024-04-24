"use client"

import { useState } from 'react'
import * as z from 'zod'
import axios from 'axios'
import { PlusCircle, File, Loader2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from "next/navigation"
import { Attachment, Course } from '@prisma/client'
import { Button } from '@/components/ui/button'
import FileUpload from '@/components/FileUpload'

type AttachmentFormProps = {
    initialData: Course & { attachments: Attachment[] },
    courseId: string
}

const formSchema = z.object({
    url: z.string().min(1)
})

export default function AttachmentForm({ initialData, courseId }: AttachmentFormProps) {
    const router = useRouter()

    const [ isEditing, setIsEditing ] = useState(false)
    const [ deletingId, setDeletingId ] = useState<string | null>(null)

    const toggleEdit = () => {
        setIsEditing(!isEditing)
    }

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/attachments`, values)
            toast.success("Course File Updated")
            toggleEdit()
            router.refresh()
        } catch {
            toast.error("Something went wrong!")
        }
    }

    const handleDelete = async (id: string) => {
        try {
            setDeletingId(id)
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`)
            toast.success("Attachment Deleted")
            router.refresh()
        } catch {
            toast.error("Something went wrong!")
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className="flex items-center justify-between font-medium">
                Course Attachments
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add File
                        </>
                    )}
                </Button>
            </div>

            {!isEditing && (
                <>
                    {initialData.attachments.length === 0 && (
                        <p className='text-sm pt-2 text-slate-500 italic' >
                            No attachments yet
                        </p>
                    )}
                    {initialData.attachments.length > 0 && (
                        <div className="space-y-2">
                            {initialData.attachments.map((attachment) => (
                                <div
                                    key={attachment.id}
                                    className="flex items-center justify-between p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                                >
                                    <div className='flex items-center space-x-2'>
                                        <File className='h-4 w-4 flex-shrink-0' />
                                        <p className='text-xs line-clamp-1' > {attachment.name} </p>
                                    </div>
                                    <div>
                                        {deletingId === attachment.id && (
                                            <div className="">
                                                <Loader2 className='h-4 w-4 animate-spin' />
                                            </div>
                                        )}
                                        {deletingId !== attachment.id && (
                                            <button onClick={() => handleDelete(attachment.id)}>
                                                <X className='h-4 w-4' />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {isEditing && (
                <>
                    <div>
                        <FileUpload
                            endpoint='courseAttachment'
                            onChange={(url) => {
                                if (url) {
                                    handleSubmit({ url: url })
                                }
                            }}
                        />
                        <div className="text-xs text-muted-foreground mt-3">
                            Add any material your students may need to complete the course.
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
