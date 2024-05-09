import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"
import { redirect } from "next/navigation"

export default async function CoursesPage() {

    const { userId } = auth()

    if (!userId) {
        return redirect(`/`)
    }

    const courses = await db.course.findMany({
        where: {
            userId: userId
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    return (
        <main className="p-6">
            <div className="container">
                <DataTable columns={columns} data={courses} />
            </div>
        </main>
    )
}
