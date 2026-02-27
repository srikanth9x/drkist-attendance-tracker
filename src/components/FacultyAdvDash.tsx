'use client';

import { useState } from 'react';
import { Spinner } from '@/components/Spinner';
import { MessageBox } from '@/components/MessageBox';

export default function FacultyAdvDash() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const handleUpload = async() => {
    if(!file) {
      setError('Please select a file');
      return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/update-attendence', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if(!response.ok) {
        throw new Error(data.error);
      }
      
      setMessage(data.message);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }
  
    return(
      <main className='w-full flex flex-col gap-4'>
        <section className='w-full p-2 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-500 border-t border-t-neutral-400 dark:border-t-neutral-600'>
          <h1 className='text-3xl text-center font-bold text-neutral-950 dark:text-neutral-50'>
                    Faculty Advisor Dashboard
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
            Update attendence
          </h2>
          <input 
          type='file'
          accept='.xlsx'
          onChange={(e) =>
                        setFile(e.target.files ? e.target.files[0] : null)}
          />
          <button className='w-full flex justify-center p-2 rounded text-2xl font-bold text-neutral-50 bg-red-500 hover:bg-red-700'
          onClick={handleUpload}
          disabled={loading}
                >
            {loading ?
              <Spinner /> :
              'Update'
            }
          </button>
            
        </section>
      </main>
      
      );
}
