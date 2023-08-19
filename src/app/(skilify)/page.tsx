import {
    ShuffleIcon,
    MagnifyingGlassIcon,
    ChatBubbleIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
    return (
        <>
            <section className="relative h- py-24 mx-auto text-center">
                <h1 className="text-6xl text-center p-4 font-bold">
                    Exchange Skill for Skill
                </h1>
                <p className="m-5 text-slate-400 text-center text-xl">
                    Exchange your skills for other skills. No money involved.
                </p>
                <Link
                    href="/explore"
                    className={cn(buttonVariants({ size: "lg" }))}
                >
                    Get Started
                </Link>
            </section>
            <section
                id="features"
                className=" space-y-6 px-0 mx-0 py-8 md:py-12 lg:py-24 w-full"
            >
                <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
                    <h2 className="font-bold text-4xl leading-[1.1]">
                        Features
                    </h2>
                    <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                        Skilify is a platform for students to exchange their
                        skills for other skills.
                    </p>
                </div>
                <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
                    <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                        <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                            <MagnifyingGlassIcon className="h-12 w-12 fill-center" />
                            <div className="space-y-2">
                                <h3 className="font-bold">Explore</h3>
                                <p className="text-sm text-muted-foreground">
                                    Find other students to exchange skills with
                                    quickly and efficiently.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                        <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                            <ShuffleIcon className="h-12 w-12 fill-center" />
                            <div className="space-y-2">
                                <h3 className="font-bold">Exchange</h3>
                                <p className="text-sm text-muted-foreground">
                                    Exchange skills with other students easily,
                                    safely and securely.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                        <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                            <ChatBubbleIcon className="h-12 w-12 fill-center" />
                            <div className="space-y-2">
                                <h3 className="font-bold">Communicate</h3>
                                <p className="text-sm text-muted-foreground">
                                    Leave feedback for other students and chat
                                    with them.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mx-auto text-center md:max-w-[58rem]">
                    <p className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                        Exchange your skills for other skills easily with no
                        money involved.
                    </p>
                </div>
            </section>
        </>
    );
}
