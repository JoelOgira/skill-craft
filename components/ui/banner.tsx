import { AlertTriangle, CheckCircleIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const bannerVariants = cva(
    "flex items-center w-full border text-center p-4 text-sm",
    {
        variants: {
            variant: {
                warning: "bg-yellow-200/80 border-yellow-30 text-primary",
                success: "bg-emerald-700 border-emerald-800 text-secondary"
            }
        },
        defaultVariants: {
            variant: "warning"
        }
    }
)

interface BannerProps extends VariantProps<typeof bannerVariants> {
    label: string
}

const iconMap = {
    warning: AlertTriangle,
    success: CheckCircleIcon
}

export default function Banner({ label, variant }: BannerProps) {
    const Icon = iconMap[variant || "warning"]

    return (
        <div className={cn(bannerVariants({ variant }))}>
            <Icon className="h4 w-4 mr-2" />
            {label}
        </div>
    )
}
