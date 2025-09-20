import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton = ({ className, ...props }: SkeletonProps) => {
  return (
    <div
      className={cn(
        "animate-skeleton bg-skeleton-gradient bg-[length:200px_100%] rounded-md",
        className
      )}
      style={{
        backgroundImage: "var(--skeleton-gradient)",
      }}
      {...props}
    />
  )
}

export { Skeleton }