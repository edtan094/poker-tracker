"use client";

import { cn } from "@/lib/utils";
import { Fredoka } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";

const fredoka = Fredoka({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function Nav({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <nav className=" bg-primary-foreground text-secondary-foreground flex justify-around px-8 sm:px-0">
      <div className="flex justify-center px-4">{children}</div>
    </nav>
  );
}

export function NavLink(props: ComponentProps<typeof Link>) {
  const pathName = usePathname();
  return (
    <Link
      {...props}
      className={cn(
        "p-4 hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground",
        pathName === props.href && "bg-background text-foreground"
      )}
    />
  );
}
