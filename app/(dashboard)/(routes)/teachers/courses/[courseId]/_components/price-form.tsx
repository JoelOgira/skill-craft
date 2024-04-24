"use client"

import { useState } from 'react'
import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Pencil } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from "next/navigation"
import { cn } from '@/lib/utils'
import { Course } from '@prisma/client'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/format'

type PriceFormProps = {
    initialData: Course,
    courseId: string
}

const formSchema = z.object({
    price: z.coerce.number()
})

export default function PriceForm({ initialData, courseId }: PriceFormProps) {
    const router = useRouter()

    const [ isEditing, setIsEditing ] = useState(false)

    const toggleEdit = () => {
        setIsEditing(!isEditing)
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            price: initialData?.price || undefined
        }
    })

    const { isSubmitting, isValid } = form.formState

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values)
            toast.success("Course Price Updated")
            toggleEdit()
            router.refresh()
        } catch {
            toast.error("Something went wrong!")
        }
    }

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className="flex items-center justify-between font-medium">
                <h3>Course Price</h3>
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-6 w-6 pr-2" />
                            Edit Price
                        </>
                    )}
                </Button>
            </div>

            {!isEditing && (
                <p className={cn(
                    "text-sm pt-2",
                    !initialData.price && "text-slate-500 italic"
                )}>
                    {initialData.price ? (
                        formatPrice(initialData.price)
                    ) : (
                        "No price"
                    )}
                </p>
            )}

            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-4 pt-2"
                    >
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            step="0.01"
                                            disabled={isSubmitting}
                                            placeholder='Set a price for your course'
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
