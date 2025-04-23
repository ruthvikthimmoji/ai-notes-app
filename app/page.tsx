import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start text-center sm:text-left">
        <Image
          className="dark:invert"
          src="/next.svg" // Change this to your actual logo if available
          alt="AI Notes Logo"
          width={120}
          height={40}
          priority
        />
        

        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Welcome to AI Notes 🧠✍️
        </h1>
        <p className="max-w-lg text-base text-muted-foreground sm:text-lg">
          Create, manage, and summarize your thoughts effortlessly with AI. Built using Next.js, Supabase, and DeepSeek.
        </p>

        <div className="flex gap-4 items-center flex-col sm:flex-row mt-4">
          <Link
            href="/login"
            className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            Get Started
          </Link>
          <a
            href="https://github.com/your-username/ai-notes-app"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            View GitHub
          </a>
        </div>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} AI Notes App. Built with ❤️</p>
      </footer>
    </div>
  );
}
