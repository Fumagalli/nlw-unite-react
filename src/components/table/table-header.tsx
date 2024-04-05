import { ComponentProps } from "react"

interface TabletHeaderProps extends ComponentProps<'th'> {}

export function TableHeader(props: TabletHeaderProps) {
    return (
        <th className="py-3 px-4 text-sm font-semibold text-left" {...props} />
    )
}