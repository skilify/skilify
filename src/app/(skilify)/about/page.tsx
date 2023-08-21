import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function About() {
    return (
        <>
            <div className="relative h-auto py-32 text-center">
                <div className="flex flex-col items-center h-72 md:h-auto content-center justify-center">
                    <h1 className="text-4xl text-center p-4 font-bold">
                        About
                    </h1>
                    <p className="m-5 text-slate-400 text-left text-base font-sans sm:text-lg mb-3 sm:mb-6 md:w-1/2 mx-10 md:mx-0">
                        Skilify is a platform for students to network, exchange
                        skills, and tutor. A student whose strong suit is math
                        could need help peer reviewing their essay, and in
                        exchange for their math skills, someone else who needs
                        math tutoring could help them out in writing. Skilify
                        makes it easy for students to find others to exchange
                        skills with and tutor, efficiently and at no cost.
                        <div className="w-full flex justify-center mt-4">
                            <Link
                                href="//github.com/skilify/skilify/blob/main/README.md"
                                className={cn(
                                    buttonVariants({ variant: "default" }),
                                    ""
                                )}
                            >
                                Read More
                            </Link>
                        </div>
                    </p>
                </div>
            </div>
        </>
    );
}
