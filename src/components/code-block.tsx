import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  className?: string;
}

export function CodeBlock({ code, className }: CodeBlockProps) {
  return (
    <pre
      className={cn(
        "font-code text-sm bg-muted/80 dark:bg-muted/20 p-4 rounded-md overflow-x-auto w-full",
        className
      )}
    >
      <code>{code}</code>
    </pre>
  );
}
