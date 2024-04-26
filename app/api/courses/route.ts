import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import { db } from "@/lib/db"

export async function POST(
    req: Request
) {
    try {
        const authUser = auth()

        if (!authUser || !authUser.userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { userId } = authUser
        const { title } = await req.json()

        const course = await db.course.create({
            data: {
                userId,
                title
            }
        })

        return NextResponse.json(course)
    } catch (error) {
        console.log("[COURSES]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
