"use client"

import { useState } from 'react'
import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loader2, PlusCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from "next/navigation"
import { cn } from '@/lib/utils'
import { Chapter, Course } from '@prisma/client'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import ChaptersList from './chapters-list'

type ChaptersFormProps = {
    initialData: Course & { chapters: Chapter[] },
    courseId: string
}

const formSchema = z.object({
    title: z.string().min(1)
})

export default function ChaptersForm({ initialData, courseId }: ChaptersFormProps) {
    const router = useRouter()

    const [ isCreating, setIsCreating ] = useState(false)
    const [ isUpdating, setIsUpdating ] = useState(false)

    const toggleCreating = () => {
        setIsCreating(!isCreating)
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        }
    })

    const { isSubmitting, isValid } = form.formState

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/chapters`, values)
            toast.success("Course Chapter Created")
            toggleCreating()
            router.refresh()
        } catch {
            toast.error("Something went wrong!")
        }
    }

    const onReorder = async (updateData: { id: string, position: number }[]) => {
        try {
            setIsUpdating(true)
            await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
                list: updateData
            })
            toast.success("Chapters reordered")
            router.refresh()
        } catch {
            toast.error("Something went wrong")
        } finally {
            setIsUpdating(false)
        }
    }

    const onEdit = (id: string) => {
        router.push(`/teachers/courses/${courseId}/chapters/${id}`)
    }

    return (
        <div className={cn(
            "mt-6 border bg-slate-100 rounded-md p-4",
            isUpdating && "relative"
        )}>

            {isUpdating && (
                <div className='absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center'>
                    <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
                </div>
            )}

            <div className="flex items-center justify-between font-medium">
                Course Chapters
                <Button onClick={toggleCreating} variant="ghost">
                    {isCreating ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-6 w-6 pr-2" />
                            Add a Chapter
                        </>
                    )}
                </Button>
            </div>

            {isCreating && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-4 pt-2"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g 'Introduction to the course'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type='submit'
                            size="sm"
                            disabled={!isValid || isSubmitting}
                        >
                            Create
                        </Button>

                    </form>
                </Form>
            )}

            {!isCreating && (
                <div className={cn(
                    "text-sm pt-2",
                    !initialData.chapters.length && "text-slate-500 italic"
                )}>
                    {!initialData.chapters.length && "No Chapters"}
                    <ChaptersList
                        onEdit={onEdit}
                        onReorder={onReorder}
                        items={initialData.chapters || []}
                    />
                </div>
            )}
            {!isCreating && (
                <p className='mt-4 text-xs text-muted-foreground'>
                    Drag and drop to reorder the chapters
                </p>
            )}
        </div>
    )
}
