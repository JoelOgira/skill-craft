"use client"

import { useState } from 'react'
import * as z from 'zod'
import axios from 'axios'
import { Pencil, PlusCircle, Video } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from "next/navigation"
import { Chapter, MuxData } from '@prisma/client'
import { Button } from '@/components/ui/button'
import FileUpload from '@/components/FileUpload'
import MuxPlayer from "@mux/mux-player-react"

type ChapterVideoFormProps = {
    initialData: Chapter & { muxData?: MuxData | null },
    courseId: string,
    chapterId: string
}

const formSchema = z.object({
    videoUrl: z.string().min(1)
})

export default function ChapterVideoForm({ initialData, courseId, chapterId }: ChapterVideoFormProps) {
    const router = useRouter()

    const [isEditing, setIsEditing] = useState(false)

    const toggleEdit = () => {
        setIsEditing(!isEditing)
    }

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
            toast.success("Chapter Video Updated")
            toggleEdit()
            router.refresh()
        } catch {
            toast.error("Something went wrong!")
        }
    }

    return (
        <div className='mt-4 border bg-slate-100 rounded-md p-4'>
            <div className="flex items-center justify-between font-medium">
                Chapter Video
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData?.videoUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a video
                        </>
                    )}
                    {!isEditing && initialData?.videoUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Change Video
                        </>
                    )}
                </Button>
            </div>

            {!isEditing && (
                !initialData?.videoUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <Video className='h-10 w-10 text-slate-500' />
                    </div>
                ) : (
                    <div className='relative aspect-video mt-2 '>
                        <MuxPlayer
                            playbackId={initialData?.muxData?.playbackId || ""}
                            streamType="on-demand"
                        />
                    </div>
                )
            )}

            {isEditing && (
                <div>
                    <FileUpload
                        endpoint='chapterVideo'
                        onChange={(url) => {
                            if (url) {
                                handleSubmit({ videoUrl: url })
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-3">
                        Upload this chapter&apos;s video
                    </div>
                </div>
            )}
            {initialData.videoUrl && !isEditing && (
                <div className='text-xs text-muted-foreground mt-2'>
                    Videos can take a few minutes to process. Refresh the page if video does not appear.
                </div>
            )}
        </div>
    )
}
