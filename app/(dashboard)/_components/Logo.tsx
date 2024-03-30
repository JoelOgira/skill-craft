import Image from "next/image"
import logo from '../../../public/logoipsum.svg'

export default function Logo() {
    return (
        <Image
            alt="Skill Craft Logo"
            src={logo}
            width={130}
            height={130}
        />
    )
}
