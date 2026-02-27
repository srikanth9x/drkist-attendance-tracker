import Link from "next/link";

export default function HomePage() {
  return (
    <main className="w-full flex flex-col items-center gap-4">
      <section className="w-full p-2 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-500 border-t border-t-neutral-400 dark:border-t-neutral-600">
        <h1 className="text-3xl font-bold text-neutral-950 dark:text-neutral-50">Attendance tracker</h1>
        <p className="text-neutral-700 dark:text-neutral-300">for DRK Institute of Science & Technology Students</p>
      </section>
        <button className="w-full p-2 rounded text-2xl font-bold text-neutral-50 bg-red-500 hover:bg-red-700 SignBtn">
        <Link href="/auth/signup">Sign Up</Link>
      </button>
    </main>
  )
}
