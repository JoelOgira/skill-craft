import { UserButton } from "@clerk/nextjs"

export default function Home() {
  return (
    <div className="md:hidden">
      <UserButton
        afterSignOutUrl="/"
      />
    </div>
  )
}
