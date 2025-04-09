"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GoHomeButton() {
  return (
    <Button asChild className="w-full md:w-1/4">
      <Link href="/">Home</Link>
    </Button>
  );
}
