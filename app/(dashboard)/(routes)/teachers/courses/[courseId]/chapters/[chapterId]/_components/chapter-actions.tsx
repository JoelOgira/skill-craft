"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ConfirmModal from '@/components/modals/confirm-modal'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'

type ChapterActionsProps = {
    disabled: boolean,
    courseId: string,
    chapterId: string,
    isPublished: boolean
}

export default function ChapterActions({
    disabled, courseId, chapterId, isPublished
}: ChapterActionsProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const onClick = async () => {
        try {
            setIsLoading(true)
            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`)
                toast.success("Chapter Unpublished")
                router.refresh()
            } else {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`)
                toast.success("Chapter Published")
                router.refresh()
            }

        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setIsLoading(true)
            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`)
            toast.success("Chapter deleted")
            router.refresh()
            router.push(`/teachers/courses/${courseId}`)
        } catch {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='flex items-center gap-x-2'>
            <Button
                onClick={onClick}
                disabled={disabled || isLoading}
                variant={'outline'}
                size={'sm'}
            >
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size={'sm'} disabled={isLoading}>
                    <Trash className='h-4 w-4' />
                </Button>
            </ConfirmModal>
        </div>
    )
}