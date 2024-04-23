import { IconBadge } from "@/components/icon-badge"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { LayoutDashboard } from "lucide-react"
import TitleForm from "./_components/title-form"

export default async function CourseIdPage({ params }: { params: { courseId: string } }) {

    const { userId } = auth()

    if (!userId) {
        return redirect("/")
    }

    const course = await db.course.findUnique({
        where: {
            id: params.courseId
        }
    })

    if (!course) {
        return redirect("/")
    }

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId
    ]

    const totalFields: number = requiredFields.length
    const completedFields: number = requiredFields.filter(Boolean).length
    const completionText = `(${completedFields}/${totalFields})`

    return (
        <main className="p-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-2">
                    <h1 className="text-2xl font-medium">
                        Course Setup
                    </h1>
                    <span className="text-sm text-slate-700">
                        Complete all fields {completionText}
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge size={"default"} icon={LayoutDashboard} />
                        <h2 className="text-lg">
                            Customize your course
                        </h2>
                    </div>
                    <TitleForm
                        initialData={course}
                        courseId={course.id}
                    />
                </div>
            </div>
        </main>
    )
}