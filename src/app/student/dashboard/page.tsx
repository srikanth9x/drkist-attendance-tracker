'use client';

import { useState, useEffect } from "react";

type Attendance = {
  sub: string;
  total_held: number;
  total_attended: number;
  last_updated_on: string;
  last_updated_by: string;
};

export default function StudentDashPage() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  
  const [academicYearStart, setAcademicYearStart] = useState<number | null>(null);
  const [sem, setSem] = useState<number | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch('/api/fetch-attendance');
        const data = await response.json();
        
        if(!response.ok) {
          throw new Error(data.error);
        }
        
        setAttendance(data.attendance);
        setAcademicYearStart(data.academic_year_start);
        setSem(data.sem);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);
  
  if (loading) return <main className="p-4">Loading...</main>;
  if (error) return <main className="p-4">{error}</main>;
  if (attendance.length === 0)
    return <main className="p-4">No attendance records found.</main>;

let allTotalHeld = 0;
let allTotalAttended = 0;

attendance.forEach((row) => {
  allTotalHeld += row.total_held;
  allTotalAttended += row.total_attended;
});

  const overallPercentage = allTotalHeld > 0 ? ((allTotalAttended / allTotalHeld) * 100).toFixed(2) : "0.00";
  
  const lastUpdatedOn = attendance.reduce((latest, row) => 
  new Date(row.last_updated_on) > new Date(latest) ? row.last_updated_on : latest , attendance[0].last_updated_on);
  
  const lastUpdatedBy = attendance[0].last_updated_by;
  
    return (
        <main className='w-full flex flex-col items-center gap-4'>
            <section
                id='percentage'
                className='p-2 w-full rounded text-4xl text-center  bg-neutral-100 dark:bg-neutral-900 border border-neutral-500 border-t border-t-neutral-400 dark:border-t-neutral-600 text-neutral-950 dark:text-neutral-50'
            >
              {overallPercentage}%
            </section>
            <section
                id='grid'
                className='grid grid-cols-2 sm:grid-cols-5 gap-4'
            >{
              attendance.map((subGrid) => (
              <div 
              key={subGrid.sub}
              className='p-4 rounded text-center bg-neutral-100 dark:bg-neutral-900 border border-neutral-500 border-t border-t-neutral-400 dark:border-t-neutral-600 text-neutral-950 dark:text-neutral-50'>
                <p className='text-2xl'>
                  {subGrid.sub}
                </p>
                <h1 className='text-3xl'>
                  {subGrid.total_attended}/{subGrid.total_held}
                </h1>
                </div>
              ))
            }
          </section>
      
          <section
                className='p-2 w-full rounded text-1xl text-center  bg-neutral-100 dark:bg-neutral-900 border border-neutral-500 border-t border-t-neutral-400 dark:border-t-neutral-600 text-neutral-950 dark:text-neutral-50'
            >Last updated on: <span className='text-red-500'>{new Date(lastUpdatedOn).toLocaleDateString()}</span>
            <br/>
              by <span className='text-red-500'>{lastUpdatedBy}</span>
            </section>
        </main>
    );
}