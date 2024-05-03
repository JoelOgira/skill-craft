import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ChapterIdPage({
    params
}: {
    params: { courseId: string; chapterId: string }
}) {
    const { userId } = auth()

    if (!userId) {
        redirect('/')
    }

    const chapter = await db.chapter.findUnique({
        where: {
            id: params.chapterId,
            courseId: params.courseId
        },
        include: {
            muxData: true
        }
    })

    if (!chapter) {
        return redirect(`/`)
    }

    const requiredFields = [
        chapter.title,
        chapter.description,
        chapter.muxData
    ]

    const totalFields = requiredFields.length
    const completedFields = requiredFields.filter(Boolean).length
    const completionText = `(${completedFields}/${totalFields})`

    return (
        <main className="p-6">
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <Link
                        href={`/teachers/courses/${params.courseId}`}
                        className="flex items-center space-x-2 text-sm hover:opacity-75 transition mb-6"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to course setup</span>
                    </Link>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col space-y-2">
                            <h1 className="text-2xl font-medium">
                                Chapter Creation
                            </h1>
                            <span className="text-sm text-slate-700">
                                Complete all fields {completionText}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
