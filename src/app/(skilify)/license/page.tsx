import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function License() {
    return (
        <>
            <div className="relative h-auto py-32 text-center">
                <div className="flex flex-col items-center h-72 md:h-auto content-center justify-center">
                    <h1 className="text-4xl text-center p-4 font-bold">
                        License
                    </h1>
                    <p className="m-5 text-slate-400 text-center text-base font-sans sm:text-lg mb-3 sm:mb-6 md:w-1/2 mx-10 md:mx-0">
                        <Link
                            className={cn(buttonVariants({ size: "lg" }))}
                            href="//github.com/skilify/skilify/blob/main/LICENSE"
                        >
                            GPL-3.0-or-later
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
