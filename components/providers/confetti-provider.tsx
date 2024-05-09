"use client"

import ReactConfetti from "react-confetti"
import { useWindowSize } from 'react-use'
import { useConfettiStore } from "@/hooks/use-confetti-store"

export default function ConfettiProvider() {
    const { height, width } = useWindowSize()

    const confetti = useConfettiStore()

    if (!confetti.isOpen) return null

    return (
        <ReactConfetti
            drawShape={ctx => {
                ctx.beginPath()
                for (let i = 0; i < 22; i++) {
                    const angle = 0.35 * i
                    const x = (0.2 + (1.5 * angle)) * Math.cos(angle)
                    const y = (0.2 + (1.5 * angle)) * Math.sin(angle)
                    ctx.lineTo(x, y)
                }
                ctx.stroke()
                ctx.closePath()
            }}
            className="pointer-events-none z-[100]"
            numberOfPieces={600}
            recycle={false}
            width={width}
            height={height}
            onConfettiComplete={() => {
                confetti.onClose()
            }}
        />
    )
}
