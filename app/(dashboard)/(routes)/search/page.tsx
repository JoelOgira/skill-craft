import { auth } from "@clerk/nextjs"
import { db } from "@/lib/db"
import Categories from "./_components/categories"
import SearchInput from "@/components/search-input"
import { getCourses } from "@/actions/get-courses"
import { redirect } from "next/navigation"
import CoursesList from "@/components/courses-list"

type SearchPageProps = {
    searchParams: {
        title: string;
        categoryId: string
    }
}

export default async function SearchPage({
    searchParams
}: SearchPageProps) {
    const { userId } = auth()

    if (!userId) {
        redirect("/")
    }

    const categories = await db.category.findMany({
        orderBy: {
            name: "asc"
        }
    })

    const courses = await getCourses({
        userId,
        ...searchParams
    })

    return (
        <>
            <div className="px-6 pt-6 md:hidden md:mb-0 block">
                <SearchInput />
            </div>
            <main className="p-6 space-y-4">
                <Categories
                    items={categories}
                />
                <CoursesList items={courses} />
            </main>
        </>
    )
}
