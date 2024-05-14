import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { IconBadge } from '@/components/icon-badge'
import { BookOpen } from 'lucide-react'
import { formatPrice } from '@/lib/format'

type CourseCardProps = {
    id: string,
    title: string,
    imageUrl: string,
    chaptersLength: number,
    price: number,
    progress: number | null,
    category: string
}

export default function CourseCard({
    id,
    title,
    imageUrl,
    chaptersLength,
    price,
    progress,
    category
}: CourseCardProps) {
    return (
        <Link href={`/courses/${id}`}>
            <div className="group transition overflow-hidden border rounded-lg p-3 h-full hover:shadow-sm">
                <div className="relative w-full aspect-video rounded-md overflow-hidden">
                    <Image
                        fill
                        className='object-cover'
                        alt={title}
                        src={imageUrl}
                        placeholder='blur'
                        blurDataURL={imageUrl}
                    />
                </div>
                <div className="flex flex-col space-y-2 pt-2">
                    <div>
                        <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
                            {title}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {category}
                        </p>
                    </div>
                    <div className="pt-2 flex items-center gap-x-2 text-sm md:text-xs">
                        <div className="flex items-center gap-x-1 text-slate-500">
                            <IconBadge size={"small"} icon={BookOpen} />
                            <span>
                                {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
                            </span>
                        </div>
                    </div>
                    {progress !== null ? (
                        <div>
                            TODO: Progress
                        </div>
                    ) : (
                        <p className='text-md pt-1 text-slate-700 font-medium md:text-sm'>
                            {formatPrice(price)}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    )
}
