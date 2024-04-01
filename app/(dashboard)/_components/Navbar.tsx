import NavbarRoutes from "@/components/NavbarRoutes"
import MobileSidebar from "./MobileSidebar"

export default function Navbar() {
    return (
        <nav className="p-4 h-full flex items-center bg-white border-b shadow-sm">
            <MobileSidebar />
            <NavbarRoutes />
        </nav>
    )
}
