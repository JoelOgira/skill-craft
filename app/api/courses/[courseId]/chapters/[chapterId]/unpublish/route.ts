import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH(
    res: Response,
    { params }: { params: { courseId: string, chapterId: string } }
) {
    try {
        const { courseId, chapterId } = params
        const { userId } = auth()

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        })

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const unPublishedChapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId
            },
            data: {
                isPublished: false
            }
        })

        return NextResponse.json(unPublishedChapter)

    } catch (error) {
        console.log("CHAPTER_PUBLISH", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
