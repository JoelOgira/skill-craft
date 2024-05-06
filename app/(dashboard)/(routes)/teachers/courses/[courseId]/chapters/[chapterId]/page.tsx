import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import Link from "next/link";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import ChapterTitleForm from "./_components/chapter-title-form"
import ChapterDescriptionForm from "./_components/chapter-description-form"

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
        <main className="p-6 h-[100vh]">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div className="space-y-4">
                    <div className="flex items-center gap-x-2">
                        <IconBadge size={"default"} icon={LayoutDashboard} />
                        <h2 className="text-lg">
                            Customize your chapter
                        </h2>
                    </div>
                    <ChapterTitleForm
                        initialData={chapter}
                        chapterId={params.chapterId}
                        courseId={params.courseId}
                    />
                    <ChapterDescriptionForm
                        initialData={chapter}
                        chapterId={params.chapterId}
                        courseId={params.courseId}
                    />
                    {/* <ImageForm
                        initialData={course}
                        courseId={course.id}
                    /> */}
                    {/* <CategoryForm
                        initialData={course}
                        courseId={course.id}
                        options={categories.map((category) => ({
                            label: category.name, value: category.id
                        }))}
                    /> */}
                </div>

                {/* <div className="space-y-6" >
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge size={"default"} icon={ListChecks} />
                            <h2 className="text-lg">
                                Course Chapters
                            </h2>
                        </div>
                        <ChaptersForm
                            initialData={course}
                            courseId={course.id}
                        />
                    </div>

                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge size={"default"} icon={CircleDollarSign} />
                            <h2 className="text-lg">
                                Sell your course
                            </h2>
                        </div>
                        <PriceForm
                            initialData={course}
                            courseId={course.id}
                        />
                    </div>

                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge size={"default"} icon={File} />
                            <h2 className="text-lg">
                                Resources and Attachments
                            </h2>
                        </div>
                        <AttachmentForm
                            initialData={course}
                            courseId={course.id}
                        />
                    </div>
                </div> */}
            </div>
        </main>
    )
}
