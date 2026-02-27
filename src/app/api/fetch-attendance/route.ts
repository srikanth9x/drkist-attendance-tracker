import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({cookies});
    
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
    
    const { data: student, error: studentError } = await supabase
    .from('students')
    .select('ht_num')
    .eq('email', user.email)
    .single();
    
    if (studentError || !student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }
    
    const { data: latestRow, error: latestError } = await supabase
    .from('attendance')
    .select('academic_year_start, sem')
    .eq('ht_num', student.ht_num)
    .order('academic_year_start', {ascending: false})
    .order('sem', {ascending: false})
    .limit(1);
    
    if (latestError) {
  return NextResponse.json(
    { error: latestError.message },
    { status: 500 }
  );
}
     if (!latestRow || latestRow.length === 0) {
      return NextResponse.json(
        { error: "No attendance records found" },
        { status: 404 }
      );
    }
    
    const { academic_year_start, sem } = latestRow[0];
    
    const { data: attendance, error: attendanceError } = await supabase
    .from('attendance')
    .select('sub, total_held, total_attended, last_updated_on, last_updated_by')
    .eq('ht_num', student.ht_num)
    .eq('academic_year_start', academic_year_start)
    .eq('sem', sem)
    .order('sub', {ascending: true});
    
    if (attendanceError) {
      return NextResponse.json(
        { error: attendanceError.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      academic_year_start,
      sem,
      attendance,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
      );
  }
}