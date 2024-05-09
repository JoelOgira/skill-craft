import { auth } from "@clerk/nextjs"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { courseId } = params

        const { userId } = auth()
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            },
            include: {
                chapters: {
                    include: {
                        muxData: true
                    }
                }
            }
        })

        if (!course) {
            return new NextResponse("Course not found", { status: 404 })
        }

        const hasPublishedChapter = await course.chapters.some((chapter) => chapter.isPublished)

        if (!course.title || !course.description || !course.imageUrl || !course.categoryId || !hasPublishedChapter) {
            return new NextResponse("Missing required field(s)).", { status: 401 })
        }

        const publishedCourse = await db.course.update({
            where: {
                id: courseId,
                userId
            },
            data: {
                isPublished: true
            }
        })

        return NextResponse.json(publishedCourse)

    } catch (error) {
        console.log("COURSE_PUBLISH", error)
        return new NextResponse("Internal server error", { status: 500 })
    }
}
