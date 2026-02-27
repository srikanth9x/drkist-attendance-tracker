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
    try {
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

        const adminEmail = user.email;

        const formData = await req.formData();
        const file = formData.get('file') as File;
        const type = formData.get('type') as string;

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
        const rows = XLSX.utils.sheet_to_json(sheet);

        if (!rows || rows.length === 0) {
            return NextResponse.json(
                { error: 'Excel file is empty.' },
                { status: 400 }
            );
        }

        if (type === 'students') {
            const processedStudents = rows.map((row: any) => ({
                ht_num: row.ht_num,
                name: row.name,
                email: row.email,
                dept: row.dept,
                sem: row.sem,
                sec: row.sec,
                last_updated_by: adminEmail,
            }));

            const { error } = await supabaseAdmin
                .from('students')
                .upsert(processedStudents);

            if (error) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 500 }
                );
            }
        }

        if (type === 'facultyAdvs') {
            const processedFacultyAdvs = rows.map((row: any) => ({
                jntuh_id: row.jntuh_id,
                name: row.name,
                email: row.email,
                dept: row.dept,
                sem: row.sem,
                sec: row.sec,
                last_updated_by: adminEmail,
            }));

            const { error } = await supabaseAdmin
                .from('faculty_advisors')
                .upsert(processedFacultyAdvs);

            if (error) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 500 }
                );
            }
        }

        return NextResponse.json({
            message: 'Successfully updated!',
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
