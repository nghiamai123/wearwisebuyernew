import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children, image, className }) {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.1fr,0.9fr]">
      <div className="relative hidden md:block">
        <Image
          src={image || "/placeholder.svg"}
          alt="Auth background"
          className="object-cover"
          fill
          priority
          quality={100}
        />
        <div className="absolute left-8 top-8">
          <Link href="/">
            <h1 className="text-2xl font-bold">
              <span className="text-pink-600">W</span>EARWISE
            </h1>
          </Link>
        </div>
      </div>
      <main className={cn("flex items-center justify-center p-8", className)}>
        <div className="mx-auto w-full max-w-md space-y-8">{children}</div>
      </main>
    </div>
  );
}