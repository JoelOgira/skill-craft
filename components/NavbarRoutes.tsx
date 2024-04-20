"use client"

import { UserButton } from "@clerk/nextjs"
import { usePathname } from "next/navigation"
import { Button } from "../components/ui/button"
import { LogOut } from "lucide-react"
import Link from "next/link"

export default function NavbarRoutes() {
    const pathname = usePathname()

    const isTeacherPage = pathname?.startsWith("/teacher")
    const isPlayerPage = pathname?.includes("/chapter")

    return (
        <nav className="flex items-center space-x-2 ml-auto">
            {isTeacherPage || isPlayerPage ? (
                <Link href="/">
                    <Button size="sm" variant="outline">
                        <LogOut className="w-4 h-4 mr-2" />
                        Exit
                    </Button>
                </Link>
            ) : (
                <Link href="/teachers/courses" >
                    <Button size="sm" variant="outline" >
                        Teacher Mode
                    </Button>
                </Link>
            )}

            <UserButton
                afterSignOutUrl="/"
            />

        </nav>
    )
}
