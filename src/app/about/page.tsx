export default function AboutPage() {
  return (
    <main className='w-full flex flex-col items-center gap-4'>

      <section className='p-2 w-full rounded text-4xl text-center bg-neutral-100 dark:bg-neutral-900 border border-neutral-500 border-t border-t-neutral-400 dark:border-t-neutral-600 text-neutral-950 dark:text-neutral-50'>
        About
      </section>

      <section className='w-full p-4 rounded flex flex-col gap-4 bg-neutral-100 dark:bg-neutral-900 border border-neutral-500 border-t border-t-neutral-400 dark:border-t-neutral-600'>

        <p className='text-neutral-950 dark:text-neutral-50 text-lg font-medium'>
          Attendance Tracker for DRK Institute of Science and Technology Students
        </p>

        <p className='text-neutral-800 dark:text-neutral-200'>
          This Attendance Tracker is a web-based system designed to provide students with clear visibility of their academic attendance while allowing faculty advisors to efficiently manage attendance records using structured Excel templates.
        </p>

        <div className='flex flex-col gap-2'>
          <h2 className='text-xl font-semibold text-neutral-950 dark:text-neutral-50'>
            How It Works
          </h2>

          <p className='text-neutral-800 dark:text-neutral-200'>
            Students securely sign up using their institutional email and log in to view their latest semester attendance data. The system automatically retrieves subject-wise attendance details including total classes held, classes attended, and last updated information.
          </p>

          <p className='text-neutral-800 dark:text-neutral-200'>
            Faculty advisors update attendance records by downloading the official Excel template, entering the required data, and uploading it through the dashboard. The system processes and stores this data securely in the database.
          </p>
        </div>

        <div className='flex flex-col gap-2'>
          <h2 className='text-xl font-semibold text-neutral-950 dark:text-neutral-50'>
            Roles & Access Control
          </h2>

          <p className='text-neutral-800 dark:text-neutral-200'>
            • Students can only access their own attendance records.  <br/>
            • Faculty advisors can upload and update attendance data.  
            <br/>
            • Administrators can manage templates and oversee system operations.
          </p>
          <p className='text-neutral-800 dark:text-neutral-200'>
            The system uses secure authentication and role-based access control to ensure data privacy and integrity.
          </p>
        </div>

        <div className='flex flex-col gap-2'>
          <h2 className='text-xl font-semibold text-neutral-950 dark:text-neutral-50'>
            Technology Stack
          </h2>

          <p className='text-neutral-800 dark:text-neutral-200'>
            Built using Next.js (React framework) for frontend and backend integration, and Supabase for authentication, database management, and row-level security. The architecture is designed to ensure scalability, performance, and secure data handling.
          </p>
        </div>

        <div className='flex flex-col gap-2'>
          <h2 className='text-xl font-semibold text-neutral-950 dark:text-neutral-50'>
            Built & Maintained By
          </h2>

          <p className='text-neutral-800 dark:text-neutral-200'>
            This project was designed and developed by Srikanth as a structured and secure solution for institutional attendance management.
          </p>

          <a
            href="https://srikanth9x.pages.dev"
            target="_blank"
            rel="noopener noreferrer"
            className='text-red-500 underline'
          >
            Visit Personal Webpage
          </a>
        </div>

      </section>

    </main>
  )
}