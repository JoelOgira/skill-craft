"use client"

import { useState } from 'react'
import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Pencil, PlusCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from "next/navigation"
import { cn } from '@/lib/utils'
import { Chapter } from '@prisma/client'
import { Button } from '@/components/ui/button'
import Editor from '@/components/ui/editor'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from '@/components/ui/form'
import Preview from '@/components/ui/preview'


type ChapterDescriptionFormProps = {
    initialData: Chapter,
    chapterId: string,
    courseId: string
}

const formSchema = z.object({
    description: z.string().min(1)
})

export default function ChapterDescriptionForm({ initialData, chapterId, courseId }: ChapterDescriptionFormProps) {
    const router = useRouter()

    const [isEditing, setIsEditing] = useState(false)

    const toggleEdit = () => {
        setIsEditing(!isEditing)
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.description || ""
        }
    })

    const { isSubmitting, isValid } = form.formState

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
            toast.success("Chapter description Updated")
            toggleEdit()
            router.refresh()
        } catch {
            toast.error("Something went wrong!")
        }
    }

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className="flex items-center justify-between font-medium">
                Chapter Description
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}

                    {!isEditing && !initialData.description && (
                        <>
                            <PlusCircle className="h-6 w-6 pr-2" />
                            Add Description
                        </>
                    )}

                    {!isEditing && initialData.description && (
                        <>
                            <Pencil className="h-6 w-6 pr-2" />
                            Edit Description
                        </>
                    )}
                </Button>
            </div>

            {!isEditing && (
                <div className={cn(
                    "text-sm pt-2",
                    !initialData.description && "text-slate-500 italic"
                )}>
                    {!initialData.description && "No Description"}
                    {initialData.description && (
                        <Preview
                            value={initialData.description}
                        />
                    )}
                </div>
            )}

            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-4 pt-2"
                    >
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Editor
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex items-center">
                            <Button
                                type='submit'
                                size="sm"
                                disabled={!isValid || isSubmitting}
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}
