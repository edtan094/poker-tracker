export default function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-muted rounded-md ${className || "h-4 w-full"}`}
    />
  );
}
