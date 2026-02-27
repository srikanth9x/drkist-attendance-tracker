import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import * as XLSX from 'xlsx';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try{
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
      );
  }
  
  const facultyAdvEmail = user.email;
  
  const { data: facultyData, error: facultyError } = await supabaseAdmin
  .from('faculty_advisors')
  .select('dept, sem, sec')
  .eq('email', facultyAdvEmail)
  .single();
  
  if (facultyError || !facultyData) {
    return NextResponse.json(
      { error: 'You are not assigned to any class.' },
      { status: 403 }
      );
  }
  
  const { dept, sem, sec } = facultyData;
  
  const formData = await req.formData();
  const file = formData.get('file') as File;
  
  if (!file) {
    return NextResponse.json(
      { error: 'No file uploaded.' },
      { status: 400 }
      );
  }
  
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  
  const rows: any[][] = XLSX.utils.sheet_to_json(sheet, {
            header: 1,
  });
  
  if (!rows || rows.length < 3) {
    return NextResponse.json(
      { error: 'Invalid Excel format.' },
      { status: 400 }
      );
  }
  
  const headerRow1 = rows[0];
  const headerRow2 = rows[1];
  
  const attendanceRecords: any[] = [];
  
  for(let i=2; i<rows.length; i++) {
    const row = rows[i];
    const ht_num = row[0];
    
    if (!ht_num) continue;
    
    const { data: studentData, error: studentError } = await supabaseAdmin
    .from('students')
    .select('dept, sem, sec')
    .eq('ht_num', ht_num)
    .single();
    
    if (studentError || !studentData) {
      return NextResponse.json(
        { error: `Student ${ht_num} not found.` },
        { status: 400 }
        );
  }
    
    if (studentData.dept !== dept || studentData.sem !== sem || studentData.sec !== sec) {
      return NextResponse.json(
        { error: `Student ${ht_num} not in your class.` },
        { status: 403 }
        );
    }
    
    for(let col =1; col<headerRow1.length; col++) {
      const subjectName = headerRow1[col];
      const totalHeld = headerRow2[col];
      const totalAttended = row[col];
      
      if (!subjectName) continue;
      
      const held = Number(totalHeld) || 0;
      const attended = Number(totalAttended) || 0;
      if (attended > held) {
  return NextResponse.json(
    { error: `Invalid attendance for ${ht_num} - ${subjectName}. Attended exceeds held.` },
    { status: 400 }
  );
}
      
      
      attendanceRecords.push({
        ht_num: ht_num,
        sub: subjectName,
        sem: sem,
        total_held: held,
        total_attended: attended,
        last_updated_by: facultyAdvEmail
      });
    }
  }
  
  const { error:insertError } = await supabaseAdmin
  .from('attendance')
  .upsert(attendanceRecords);
  
  if (insertError) {
    return NextResponse.json(
      { error: insertError.message },
      { status: 500 }
    );
  }
  
  return NextResponse.json({
    message: 'Attendance updated successfully!'
  });
} catch(error: any) {
  return NextResponse.json(
    { error: error.message },
    { status: 500 },
    );
}
}
