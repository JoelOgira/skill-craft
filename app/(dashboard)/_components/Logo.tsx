import Image from "next/image"
import logo from '../../../public/logoipsum.svg'
import Link from "next/link"

export default function Logo() {
    return (
        <Link href="/">
            <Image
                alt="Skill Craft Logo"
                src={logo}
                width={130}
                height={130}
            />
        </Link>
    )
}
