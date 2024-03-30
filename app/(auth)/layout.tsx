export default function AuthLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-[100svh] flex justify-center items-center">
            {children}
        </div>
    )
}
