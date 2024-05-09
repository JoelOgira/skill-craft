"use client"

import Link from "next/link"
import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import toast from 'react-hot-toast'

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormLabel,
    FormMessage,
    FormItem
} from "@/components/ui/form"

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required"
    })
})

export default function CreateCoursePage() {
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        }
    })

    const { isSubmitting, isValid } = form.formState

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/courses", values)
            router.push(`/teachers/courses/${response.data.id}`)
            toast.success("Course Created")
        } catch {
            toast.error("Something went wrong!")
        }
    }

    return (
        <main className="h-full max-w-5xl mx-auto flex p-6 items-center justify-center">
            <div>
                <h1 className="text-xl md:text-2xl">
                    Name Your Course
                </h1>

                <p className="text-sm text-slate-600">
                    What would you like to name your course? Don&apos;t worry, you can change it later.
                </p>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-8 mt-8"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Course Title
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g 'The Dawn of a new Beginning'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        What will you teach in this course?
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex items-center gap-x-2">
                            <Link href={"/"}>
                                <Button
                                    type='button'
                                    variant={"destructive"}
                                >
                                    Cancel
                                </Button>
                            </Link>

                            <Button
                                type='submit'
                                disabled={!isValid || isSubmitting}
                            >
                                Continue
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </main>
    )
}