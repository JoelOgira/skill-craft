"use-client"

import { LucideIcon } from "lucide-react"

type IconTypes = {
    icon: LucideIcon;
    label: string;
    href: string;
}

export default function SidebarItem({ icon: Icon, label, href }: IconTypes) {
    return (
        <div>SidebarItem</div>
    )
}
