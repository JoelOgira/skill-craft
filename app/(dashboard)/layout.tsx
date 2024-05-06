import Navbar from "./_components/Navbar"
import Sidebar from "./_components/Sidebar"

export default function DashBoardLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <main className="min-h-full">
            <div className="h-[80px] fixed inset-y-0 w-full z-50 md:pl-56 md:z-0 ">
                <Navbar />
            </div>

            <div className="hidden h-full w-56 flex-col fixed inset-y-0 md:flex">
                <Sidebar />
            </div>

            <main className="h-full pt-[80px] md:pl-56">
                {children}
            </main>
        </main>
    )
}
