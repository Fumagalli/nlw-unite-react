import { ComponentProps } from "react"

interface TabletRowProps extends ComponentProps<'tr'> {}

export function TableRow(props: TabletRowProps) {
    return (
        <tr {...props} className='border-b border-white/10 hover:bg-white/5'/>
    )
}