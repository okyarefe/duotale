/**
 * v0 by Vercel.
 * @see https://v0.dev/t/IuUYP5ndFe7
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import VideoWalkthrough from "@/components/VideoWalkthrough";
import Link from "next/link";

export default function Component() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link
          href="#"
          className="flex items-center justify-center"
          prefetch={false}
        ></Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/contact"
            className="text-lg font-medium underline-offset-4 text-foreground transition duration-300 ease-in-out"
            prefetch={false}
          >
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1 ">
        <section className="w-full py-12 sm:py-24 lg:py-32 ">
          <div className="container mx-auto p-6 md:px-12 text-white">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
              <div className="flex flex-col flex-1 justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-2xl lg:text-5xl xl:text-6xl text-foreground ">
                    Learn languages the fun way!
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Create your own stories with our AI-driven app and unlock a
                    new world where you learn languages through fun and engaging
                    stories in dual language format.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Link
                    href="/chat"
                    className="border border-blue-500 px-4 py-2 rounded-full transition duration-300 ease-in-out hover:bg-blue-500 hover:text-white"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
              <div className="flex-2 lg:flex-2">
                <VideoWalkthrough />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
