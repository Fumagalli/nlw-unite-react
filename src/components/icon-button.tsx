import { twMerge } from "tailwind-merge"

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    transparent?: boolean
}

export function IconButton({transparent, ...props}: IconButtonProps) {
    return (
        <button
            {...props}
            className={twMerge(
                "border border-white/10 rounded-md p-1.5",
                transparent ? "bg-black/20" : "bg-white/10",
                props.disabled && "opacity-50 cursor-not-allowed"
            )}
        />
    )
}