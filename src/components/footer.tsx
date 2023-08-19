import * as React from "react";

export function SiteFooter() {
    return (
        <footer className="py-6 md:px-8 md:py-0">
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                    © 2023{" "}
                    <a href="/" className="hover:underline">
                        Skilify
                    </a>
                    . All Rights Reserved.
                </span>
                <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                    <li>
                        <a
                            href="/about"
                            className="mr-4 hover:underline md:mr-6"
                        >
                            About
                        </a>
                    </li>
                    <li>
                        <a
                            href="/privacy"
                            className="mr-4 hover:underline md:mr-6"
                        >
                            Privacy Policy
                        </a>
                    </li>
                    <li>
                        <a
                            href="/license"
                            className="mr-4 hover:underline md:mr-6"
                        >
                            Licensing
                        </a>
                    </li>
                </ul>
            </div>
        </footer>
    );
}
