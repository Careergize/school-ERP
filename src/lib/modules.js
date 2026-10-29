export const navigation = [
  ['Workspace', ['dashboard', 'admissions', 'students', 'parents', 'enrollments']],
  ['Academics', ['courses', 'academic_years', 'classes', 'subjects', 'attendance', 'timetable', 'exams', 'results', 'assignments', 'submissions']],
  ['Finance & people', ['fees', 'payments', 'staff', 'payroll', 'reviews']],
  ['Campus services', ['books', 'loans', 'transport', 'transport_allocations', 'hostels', 'hostel_allocations', 'rooms', 'activities']],
  ['Communication', ['notices', 'messages']],
  ['Insights & settings', ['reports', 'audit', 'school_settings', 'settings']],
];

export const resourceScreens = {
  admissions: {description: 'Review applications and turn accepted applicants into enrolled students.', columns: ['name','class_id','email','phone','status'], filters: ['status']},
  students: {description: 'Student profiles, guardians, current classes, and enrollment status.', columns: ['name','roll','class_id','parent_id','phone','status'], filters: ['class_id','status']},
  parents: {description: 'Keep parent and guardian contact information up to date.', columns: ['name','relationship','email','phone']},
  enrollments: {description: 'Follow each student’s academic history and class transfers.', columns: ['student_id','class_id','from_date','to_date','status'], filters: ['class_id','status']},
  courses: {description: 'Organize your institution’s course offerings.', columns: ['name','code','description']},
  academic_years: {description: 'Define the academic calendar for your school.', columns: ['name','start_date','end_date']},
  classes: {description: 'Connect courses, academic years, faculty, and classrooms.', columns: ['name','year','course_id','teacher_id','room_id','capacity']},
  subjects: {description: 'Assign subject codes, classes, and teaching faculty.', columns: ['name','code','class_id','teacher_id'], filters: ['class_id']},
  attendance: {description: 'Record and review student attendance by date and class.', columns: ['student_id','date','status','note'], filters: ['date','status']},
  timetable: {description: 'Schedule lessons with teacher, room, and class conflict checks.', columns: ['name','class_id','subject_id','teacher_id','day','start','end','room_id'], filters: ['class_id','day']},
  exams: {description: 'Plan exams and define maximum marks and passing thresholds.', columns: ['name','class_id','subject_id','date','max_marks','pass_marks'], filters: ['class_id','date']},
  results: {description: 'Record evaluations and review student exam outcomes.', columns: ['student_id','exam_id','marks','percentage','outcome','remarks']},
  assignments: {description: 'Publish class assignments, instructions, and due dates.', columns: ['name','class_id','subject_id','due','description'], filters: ['class_id']},
  submissions: {description: 'Review student work and record teacher feedback.', columns: ['student_id','assignment_id','content','feedback']},
  fees: {description: 'Issue invoices and track collected and outstanding fees.', columns: ['name','student_id','amount','paid_amount','balance','payment_status','due']},
  payments: {description: 'Record cash, bank-transfer, or cheque receipts against invoices.', columns: ['invoice_id','amount','date','method','reference'], filters: ['method','date']},
  staff: {description: 'Manage faculty and staff contact, employment, and salary details.', columns: ['name','designation','department','email','salary','joined']},
  payroll: {description: 'Prepare monthly payroll with allowances and deductions.', columns: ['staff_id','month','basic','allowances','deductions','net_pay','status'], filters: ['status']},
  reviews: {description: 'Record staff performance assessments and review notes.', columns: ['staff_id','date','rating','description']},
  books: {description: 'Catalog books and monitor available lending copies.', columns: ['name','author','isbn','copies','available_copies','shelf']},
  loans: {description: 'Issue books, monitor due dates, and record returns.', columns: ['book_id','student_id','issued','due','returned','loan_status']},
  transport: {description: 'Manage bus routes, drivers, pickup stops, and capacity.', columns: ['name','vehicle','driver','phone','capacity','stops']},
  transport_allocations: {description: 'Assign students to transport routes and pickup stops.', columns: ['student_id','route_id','stop']},
  hostels: {description: 'Manage hostel buildings, room capacities, and wardens.', columns: ['name','building','capacity','warden']},
  hostel_allocations: {description: 'Allocate beds by date while checking overlapping stays.', columns: ['student_id','hostel_id','from_date','to_date']},
  rooms: {description: 'Keep an inventory of classrooms and shared facilities.', columns: ['name','building','capacity','type'], filters: ['type']},
  activities: {description: 'Plan school activities and events.', columns: ['name','date','location','description']},
  notices: {description: 'Publish school announcements to the right audience.', columns: ['name','date','audience','description'], filters: ['audience']},
  messages: {description: 'Share updates with staff, parents, and students.', columns: ['name','date','audience','description'], filters: ['audience']},
  school_settings: {description: 'Maintain your school’s identity, contact details, and regional preferences.', columns: ['name','email','phone','currency','timezone']},
};

export const computedFields = {
  enrolled_student_id: {label:'Enrolled student',type:'ref:students'},
  paid_amount: {label: 'Collected', type:'money'}, balance: {label:'Outstanding',type:'money'},
  payment_status: {label:'Payment status',type:'status'}, net_pay: {label:'Net pay',type:'money'},
  percentage: {label:'Percentage',type:'percentage'}, outcome: {label:'Outcome',type:'status'},
  available_copies: {label:'Available copies',type:'number'}, loan_status: {label:'Loan status',type:'status'},
};

export function localDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
}
export const money = value => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(value||0));
export function queryPath(path, values={}) {
  const query = new URLSearchParams(Object.entries(values).filter(([,value])=>value!==''&&value!==undefined&&value!==null));
  return path + (query.size ? '?' + query.toString() : '');
}
export function initialValues(config, record) {
  return Object.fromEntries(config.fields.map(field => [field.key, record?.[field.key] ?? field.default ?? '']));
}
export function formBody(config, values, record) {
  const body = Object.fromEntries(config.fields.map(field => {
    const value=values[field.key]??'';
    if(field.type.startsWith('ref:')) return [field.key,value===''?null:Number(value)];
    if(field.type==='number') return [field.key,value===''?null:Number(value)];
    if(field.type==='date'||field.type==='time') return [field.key,value||null];
    return [field.key,value];
  }));
  if(record?.id) body.version=record.version;
  return body;
}
