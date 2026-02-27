'use client';

import { useState } from 'react';
import { Spinner } from '@/components/Spinner';
import { MessageBox } from '@/components/MessageBox';

export default function AdminDashPage() {
    const [studentsFile, setStudentsFile] = useState<File | null>(null);
    const [facultyAdvsFile, setFacultyAdvsFile] = useState<File | null>(null);

    const [confirmIncrement, setConfirmIncrement] = useState(false);
    const [confirmTimer, setConfirmTimer] = useState<ReturnType<
        typeof setTimeout
    > | null>(null);

    const [loading, setLoading] = useState(false);
    const [studentsLoading, setStudentsLoading] = useState(false);
    const [facultyAdvsLoading, setFacultyAdvsLoading] = useState(false);

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleUpload = async (type: 'students' | 'facultyAdvs') => {
        const file = type === 'students' ? studentsFile : facultyAdvsFile;

        if (!file) {
            setError('Please select a file');
            return;
        }

        if (type === 'students') {
            setStudentsLoading(true);
        } else {
            setFacultyAdvsLoading(true);
        }
        setError('');
        setMessage('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        try {
            const response = await fetch('/api/manage-users', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            setMessage(data.message);
        } catch (error: any) {
            setError(error.message);
        } finally {
            if (type === 'students') {
                setStudentsLoading(false);
            } else {
                setFacultyAdvsLoading(false);
            }
        }
    };

    const handleIncrement = async () => {
        if (!confirmIncrement) {
            setMessage(
                'Click again within 5 seconds to confirm semester increment'
            );

            setConfirmIncrement(true);

            const timer = setTimeout(() => {
                setConfirmIncrement(false);
                setMessage('');
            }, 5000);

            setConfirmTimer(timer);
            return;
        }

        if (confirmTimer) {
            clearTimeout(confirmTimer);
        }

        setConfirmIncrement(false);

        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await fetch('/api/increment-semester', {
                method: 'POST',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }
            setMessage(data.message);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className='w-full flex flex-col gap-4'>
            <section className='w-full p-2 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-500 border-t border-t-neutral-400 dark:border-t-neutral-600'>
                <h1 className='text-3xl text-center font-bold text-neutral-950 dark:text-neutral-50'>
                    Admin Dashboard
                </h1>
            </section>
            <MessageBox
                type='error'
                message={error}
            />
            <MessageBox
                type='success'
                message={message}
            />
            <section className='w-full flex flex-col gap-2 p-2 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-500 border-t border-t-neutral-400 dark:border-t-neutral-600'>
                <h2 className='text-2xl font-bold text-neutral-950 dark:text-neutral-50'>
                    Manage students
                </h2>

                <input
                    type='file'
                    accept='.xlsx'
                    onChange={e => {
                        if (e.target.files) {
                            setStudentsFile(e.target.files[0]);
                        }
                    }}
                />

                <button
                    onClick={() => handleUpload('students')}
                    disabled={studentsLoading}
                    className='w-full flex justify-center p-2 rounded text-2xl font-bold text-neutral-50 bg-red-500 hover:bg-red-700'
                >
                    {studentsLoading ? <Spinner /> : 'Update'}
                </button>
            </section>

            <section className='w-full flex flex-col gap-2 p-2 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-500 border-t border-t-neutral-400 dark:border-t-neutral-600'>
                <h2 className='text-2xl font-bold text-neutral-950 dark:text-neutral-50'>
                    Manage faculty advisors
                </h2>
                <input
                    type='file'
                    accept='.xlsx'
                    onChange={e => {
                        if (e.target.files) {
                            setFacultyAdvsFile(e.target.files[0]);
                        }
                    }}
                />

                <button
                    onClick={() => handleUpload('facultyAdvs')}
                    disabled={facultyAdvsLoading}
                    className='w-full flex justify-center p-2 rounded text-2xl font-bold text-neutral-50 bg-red-500 hover:bg-red-700'
                >
                    {facultyAdvsLoading ? <Spinner /> : 'Update'}
                </button>
            </section>

            <button
                onClick={handleIncrement}
                disabled={loading}
                className='w-full flex justify-center p-2 rounded text-2xl font-bold text-neutral-50 bg-red-500 hover:bg-red-700'
            >
                {loading ? (
                    <Spinner />
                ) : confirmIncrement ? (
                    'click again to confirm'
                ) : (
                    'Increment semester'
                )}
            </button>
        </main>
    );
}
