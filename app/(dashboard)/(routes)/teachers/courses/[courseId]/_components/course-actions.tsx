"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ConfirmModal from '@/components/modals/confirm-modal'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useConfettiStore } from '@/hooks/use-confetti-store'

type CourseActionsProps = {
    disabled: boolean,
    courseId: string,
    isPublished: boolean
}

export default function CourseActions({
    disabled, courseId, isPublished
}: CourseActionsProps) {
    const router = useRouter()
    const confetti = useConfettiStore()
    const [isLoading, setIsLoading] = useState(false)

    const onClick = async () => {
        try {
            setIsLoading(true)
            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/unpublish`)
                toast.success("Course Unpublished")
            } else {
                await axios.patch(`/api/courses/${courseId}/publish`)
                toast.success("Course Published")
                confetti.onOpen()
            }
            router.refresh()
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setIsLoading(true)
            await axios.delete(`/api/courses/${courseId}`)
            toast.success("Chapter deleted")
            router.push(`/teachers/courses`)
            router.refresh()
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
