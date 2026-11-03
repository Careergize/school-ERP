// Form metadata only; no school records or credentials.
export default {
  "admissions": {
    "model": "admissions.Application",
    "app": "admissions",
    "label": "Admissions",
    "singular": "Application",
    "roles": [
      "admin"
    ],
    "endpoint": "v1/admissions/",
    "export_endpoint": "v1/admissions/export/",
    "fields": [
      {
        "key": "name",
        "label": "Applicant name",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      },
      {
        "key": "class_id",
        "label": "Requested class",
        "type": "ref:classes",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "email",
        "label": "Guardian email",
        "type": "email",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 254,
        "min": null
      },
      {
        "key": "phone",
        "label": "Phone",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 32,
        "min": null
      },
      {
        "key": "dob",
        "label": "Date of birth",
        "type": "date",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "status",
        "label": "Status",
        "type": "select",
        "required": false,
        "options": [
          "Applied",
          "Under review",
          "Accepted",
          "Rejected"
        ],
        "default": "Applied",
        "max_length": 32,
        "min": null
      }
    ],
    "can_write": true,
    "can_read": true
  },
  "students": {
    "model": "students.Student",
    "app": "students",
    "label": "Students",
    "singular": "Student",
    "roles": [
      "admin"
    ],
    "endpoint": "v1/students/",
    "export_endpoint": "v1/students/export/",
    "fields": [
      {
        "key": "name",
        "label": "Full name",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      },
      {
        "key": "roll",
        "label": "Admission number",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      },
      {
        "key": "class_id",
        "label": "Class",
        "type": "ref:classes",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "parent_id",
        "label": "Parent",
        "type": "ref:parents",
        "required": false,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "dob",
        "label": "Date of birth",
        "type": "date",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "gender",
        "label": "Gender",
        "type": "select",
        "required": false,
        "options": [
          "Female",
          "Male",
          "Other"
        ],
        "default": "Female",
        "max_length": 32,
        "min": null
      },
      {
        "key": "email",
        "label": "Email",
        "type": "email",
        "required": false,
        "options": null,
        "default": "",
        "max_length": 254,
        "min": null
      },
      {
        "key": "phone",
        "label": "Phone",
        "type": "text",
        "required": false,
        "options": null,
        "default": "",
        "max_length": 32,
        "min": null
      },
      {
        "key": "address",
        "label": "Address",
        "type": "textarea",
        "required": false,
        "options": null,
        "default": "",
        "max_length": null,
        "min": null
      },
      {
        "key": "status",
        "label": "Status",
        "type": "select",
        "required": false,
        "options": [
          "Active",
          "Graduated",
          "Withdrawn"
        ],
        "default": "Active",
        "max_length": 32,
        "min": null
      }
    ],
    "can_write": true,
    "can_read": true
  },
  "parents": {
    "model": "students.Guardian",
    "app": "students",
    "label": "Parents & guardians",
    "singular": "Guardian",
    "roles": [
      "admin"
    ],
    "endpoint": "v1/students/guardians/",
    "export_endpoint": "v1/students/guardians/export/",
    "fields": [
      {
        "key": "name",
        "label": "Full name",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      },
      {
        "key": "email",
        "label": "Email",
        "type": "email",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 254,
        "min": null
      },
      {
        "key": "phone",
        "label": "Phone",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 32,
        "min": null
      },
      {
        "key": "relationship",
        "label": "Relationship",
        "type": "select",
        "required": false,
        "options": [
          "Mother",
          "Father",
          "Guardian"
        ],
        "default": "Mother",
        "max_length": 32,
        "min": null
      },
      {
        "key": "address",
        "label": "Address",
        "type": "textarea",
        "required": false,
        "options": null,
        "default": "",
        "max_length": null,
        "min": null
      }
    ],
    "can_write": true,
    "can_read": true
  },
  "classes": {
    "model": "academics.Batch",
    "app": "academics",
    "label": "Classes & batches",
    "singular": "Class",
    "roles": [
      "admin"
    ],
    "endpoint": "v1/academics/classes/",
    "export_endpoint": "v1/academics/classes/export/",
    "fields": [
      {
        "key": "name",
        "label": "Class / section",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      },
      {
        "key": "year",
        "label": "Academic year",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      },
      {
        "key": "teacher_id",
        "label": "Class teacher",
        "type": "ref:staff",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "capacity",
        "label": "Capacity",
        "type": "number",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": 1
      },
      {
        "key": "room_id",
        "label": "Classroom",
        "type": "ref:rooms",
        "required": false,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "course_id",
        "label": "Course",
        "type": "ref:courses",
        "required": false,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "academic_year_id",
        "label": "Academic year record",
        "type": "ref:academic_years",
        "required": false,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      }
    ],
    "can_write": true,
    "can_read": true
  },
  "subjects": {
    "model": "academics.Subject",
    "app": "academics",
    "label": "Subjects",
    "singular": "Subject",
    "roles": [
      "admin"
    ],
    "endpoint": "v1/academics/subjects/",
    "export_endpoint": "v1/academics/subjects/export/",
    "fields": [
      {
        "key": "name",
        "label": "Subject name",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      },
      {
        "key": "code",
        "label": "Subject code",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      },
      {
        "key": "class_id",
        "label": "Class",
        "type": "ref:classes",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "teacher_id",
        "label": "Faculty",
        "type": "ref:staff",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      }
    ],
    "can_write": true,
    "can_read": true
  },
  "assignments": {
    "model": "academics.Assignment",
    "app": "academics",
    "label": "Assignments",
    "singular": "Assignment",
    "roles": [
      "admin",
      "teacher"
    ],
    "endpoint": "v1/academics/assignments/",
    "export_endpoint": "v1/academics/assignments/export/",
    "fields": [
      {
        "key": "name",
        "label": "Assignment title",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      },
      {
        "key": "class_id",
        "label": "Class",
        "type": "ref:classes",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "subject_id",
        "label": "Subject",
        "type": "ref:subjects",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "due",
        "label": "Due date",
        "type": "date",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "description",
        "label": "Instructions",
        "type": "textarea",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      }
    ],
    "can_write": true,
    "can_read": true
  },
  "submissions": {
    "model": "academics.Submission",
    "app": "academics",
    "label": "Submissions",
    "singular": "Submission",
    "roles": [
      "admin",
      "teacher",
      "student"
    ],
    "endpoint": "v1/academics/submissions/",
    "export_endpoint": "v1/academics/submissions/export/",
    "fields": [
      {
        "key": "student_id",
        "label": "Student",
        "type": "ref:students",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "assignment_id",
        "label": "Assignment",
        "type": "ref:assignments",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "content",
        "label": "Submission text / link",
        "type": "textarea",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "feedback",
        "label": "Teacher feedback",
        "type": "text",
        "required": false,
        "options": null,
        "default": "",
        "max_length": 255,
        "min": null
      }
    ],
    "can_write": true,
    "can_read": true
  },
  "rooms": {
    "model": "academics.Classroom",
    "app": "academics",
    "label": "Classrooms & facilities",
    "singular": "Room",
    "roles": [
      "admin"
    ],
    "endpoint": "v1/academics/rooms/",
    "export_endpoint": "v1/academics/rooms/export/",
    "fields": [
      {
        "key": "name",
        "label": "Room name",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      },
      {
        "key": "building",
        "label": "Building",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      },
      {
        "key": "capacity",
        "label": "Capacity",
        "type": "number",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": 1
      },
      {
        "key": "type",
        "label": "Type",
        "type": "select",
        "required": false,
        "options": [
          "Classroom",
          "Laboratory",
          "Sports",
          "Auditorium"
        ],
        "default": "Classroom",
        "max_length": 32,
        "min": null
      }
    ],
    "can_write": true,
    "can_read": true
  },
  "activities": {
    "model": "academics.Activity",
    "app": "academics",
    "label": "Activities & events",
    "singular": "Activity",
    "roles": [
      "admin",
      "teacher"
    ],
    "endpoint": "v1/academics/activities/",
    "export_endpoint": "v1/academics/activities/export/",
    "fields": [
      {
        "key": "name",
        "label": "Activity name",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      },
      {
        "key": "date",
        "label": "Date",
        "type": "date",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "location",
        "label": "Location",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      },
      {
        "key": "description",
        "label": "Description",
        "type": "textarea",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      }
    ],
    "can_write": true,
    "can_read": true
  },
  "exams": {
    "model": "examinations.Exam",
    "app": "examinations",
    "label": "Examinations",
    "singular": "Exam",
    "roles": [
      "admin",
      "teacher"
    ],
    "endpoint": "v1/examinations/exams/",
    "export_endpoint": "v1/examinations/exams/export/",
    "fields": [
      {
        "key": "name",
        "label": "Exam title",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      },
      {
        "key": "class_id",
        "label": "Class",
        "type": "ref:classes",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "subject_id",
        "label": "Subject",
        "type": "ref:subjects",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "date",
        "label": "Exam date",
        "type": "date",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "max_marks",
        "label": "Maximum marks",
        "type": "number",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": 0
      },
      {
        "key": "pass_marks",
        "label": "Pass marks",
        "type": "number",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": 0
      }
    ],
    "can_write": true,
    "can_read": true
  },
  "results": {
    "model": "examinations.Result",
    "app": "examinations",
    "label": "Results",
    "singular": "Result",
    "roles": [
      "admin",
      "teacher"
    ],
    "endpoint": "v1/examinations/results/",
    "export_endpoint": "v1/examinations/results/export/",
    "fields": [
      {
        "key": "student_id",
        "label": "Student",
        "type": "ref:students",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "exam_id",
        "label": "Exam",
        "type": "ref:exams",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "marks",
        "label": "Marks",
        "type": "number",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": 0
      },
      {
        "key": "remarks",
        "label": "Remarks",
        "type": "text",
        "required": false,
        "options": null,
        "default": "",
        "max_length": 255,
        "min": null
      }
    ],
    "can_write": true,
    "can_read": true
  },
  "fees": {
    "model": "finance.Invoice",
    "app": "finance",
    "label": "Fees & invoices",
    "singular": "Invoice",
    "roles": [
      "admin",
      "accountant"
    ],
    "endpoint": "v1/finance/invoices/",
    "export_endpoint": "v1/finance/invoices/export/",
    "fields": [
      {
        "key": "name",
        "label": "Invoice title",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      },
      {
        "key": "student_id",
        "label": "Student",
        "type": "ref:students",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "amount",
        "label": "Amount (INR)",
        "type": "money",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": "0"
      },
      {
        "key": "due",
        "label": "Due date",
        "type": "date",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      }
    ],
    "can_write": true,
    "can_read": true
  },
  "payments": {
    "model": "finance.Receipt",
    "app": "finance",
    "label": "Manual receipts",
    "singular": "Receipt",
    "roles": [
      "admin",
      "accountant"
    ],
    "endpoint": "v1/finance/receipts/",
    "export_endpoint": "v1/finance/receipts/export/",
    "fields": [
      {
        "key": "invoice_id",
        "label": "Invoice",
        "type": "ref:fees",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "amount",
        "label": "Amount received (INR)",
        "type": "money",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": "0"
      },
      {
        "key": "date",
        "label": "Received on",
        "type": "date",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "method",
        "label": "Method",
        "type": "select",
        "required": false,
        "options": [
          "Cash",
          "Bank transfer",
          "Cheque"
        ],
        "default": "Cash",
        "max_length": 32,
        "min": null
      },
      {
        "key": "reference",
        "label": "Reference / cheque number",
        "type": "text",
        "required": false,
        "options": null,
        "default": "",
        "max_length": 255,
        "min": null
      }
    ],
    "can_write": true,
    "can_read": true
  },
  "attendance": {
    "model": "attendance.Attendance",
    "app": "attendance",
    "label": "Attendance",
    "singular": "Attendance record",
    "roles": [
      "admin",
      "teacher"
    ],
    "endpoint": "v1/attendance/",
    "export_endpoint": "v1/attendance/export/",
    "fields": [
      {
        "key": "student_id",
        "label": "Student",
        "type": "ref:students",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "date",
        "label": "Date",
        "type": "date",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "status",
        "label": "Status",
        "type": "select",
        "required": false,
        "options": [
          "Present",
          "Absent",
          "Late",
          "Excused"
        ],
        "default": "Present",
        "max_length": 32,
        "min": null
      },
      {
        "key": "note",
        "label": "Note",
        "type": "text",
        "required": false,
        "options": null,
        "default": "",
        "max_length": 255,
        "min": null
      }
    ],
    "can_write": true,
    "can_read": true
  },
  "timetable": {
    "model": "timetable.Lesson",
    "app": "timetable",
    "label": "Timetable",
    "singular": "Lesson",
    "roles": [
      "admin"
    ],
    "endpoint": "v1/timetable/",
    "export_endpoint": "v1/timetable/export/",
    "fields": [
      {
        "key": "name",
        "label": "Lesson title",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      },
      {
        "key": "class_id",
        "label": "Class",
        "type": "ref:classes",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "subject_id",
        "label": "Subject",
        "type": "ref:subjects",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "teacher_id",
        "label": "Teacher",
        "type": "ref:staff",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "day",
        "label": "Day",
        "type": "select",
        "required": false,
        "options": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        "default": "Monday",
        "max_length": 32,
        "min": null
      },
      {
        "key": "start",
        "label": "Start time",
        "type": "time",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "end",
        "label": "End time",
        "type": "time",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "room_id",
        "label": "Room",
        "type": "ref:rooms",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      }
    ],
    "can_write": true,
    "can_read": true
  },
  "books": {
    "model": "library.Book",
    "app": "library",
    "label": "Library catalog",
    "singular": "Book",
    "roles": [
      "admin",
      "librarian"
    ],
    "endpoint": "v1/library/books/",
    "export_endpoint": "v1/library/books/export/",
    "fields": [
      {
        "key": "name",
        "label": "Book title",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      },
      {
        "key": "isbn",
        "label": "ISBN",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      },
      {
        "key": "copies",
        "label": "Total copies",
        "type": "number",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": 0
      },
      {
        "key": "shelf",
        "label": "Shelf",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      }
    ],
    "can_write": true,
    "can_read": true
  },
  "loans": {
    "model": "library.Loan",
    "app": "library",
    "label": "Library lending",
    "singular": "Loan",
    "roles": [
      "admin",
      "librarian"
    ],
    "endpoint": "v1/library/loans/",
    "export_endpoint": "v1/library/loans/export/",
    "fields": [
      {
        "key": "book_id",
        "label": "Book",
        "type": "ref:books",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "student_id",
        "label": "Student",
        "type": "ref:students",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "issued",
        "label": "Issue date",
        "type": "date",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "due",
        "label": "Return due",
        "type": "date",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "returned",
        "label": "Returned on",
        "type": "date",
        "required": false,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      }
    ],
    "can_write": true,
    "can_read": true
  },
  "transport": {
    "model": "transport.Route",
    "app": "transport",
    "label": "Transport routes",
    "singular": "Route",
    "roles": [
      "admin"
    ],
    "endpoint": "v1/transport/routes/",
    "export_endpoint": "v1/transport/routes/export/",
    "fields": [
      {
        "key": "name",
        "label": "Route name",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      },
      {
        "key": "vehicle",
        "label": "Vehicle number",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      },
      {
        "key": "driver",
        "label": "Driver name",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      },
      {
        "key": "phone",
        "label": "Driver phone",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 32,
        "min": null
      },
      {
        "key": "capacity",
        "label": "Capacity",
        "type": "number",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": 1
      },
      {
        "key": "stops",
        "label": "Stops",
        "type": "textarea",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      }
    ],
    "can_write": true,
    "can_read": true
  },
  "transport_allocations": {
    "model": "transport.TransportAllocation",
    "app": "transport",
    "label": "Transport allocations",
    "singular": "Transport allocation",
    "roles": [
      "admin"
    ],
    "endpoint": "v1/transport/allocations/",
    "export_endpoint": "v1/transport/allocations/export/",
    "fields": [
      {
        "key": "student_id",
        "label": "Student",
        "type": "ref:students",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "route_id",
        "label": "Route",
        "type": "ref:transport",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "stop",
        "label": "Pickup stop",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      }
    ],
    "can_write": true,
    "can_read": true
  },
  "hostels": {
    "model": "hostel.HostelRoom",
    "app": "hostel",
    "label": "Hostel rooms",
    "singular": "Hostel room",
    "roles": [
      "admin"
    ],
    "endpoint": "v1/hostel/rooms/",
    "export_endpoint": "v1/hostel/rooms/export/",
    "fields": [
      {
        "key": "name",
        "label": "Room name",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      },
      {
        "key": "building",
        "label": "Hostel building",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      },
      {
        "key": "capacity",
        "label": "Beds",
        "type": "number",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": 1
      },
      {
        "key": "warden",
        "label": "Warden",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      }
    ],
    "can_write": true,
    "can_read": true
  },
  "hostel_allocations": {
    "model": "hostel.HostelAllocation",
    "app": "hostel",
    "label": "Hostel allocations",
    "singular": "Hostel allocation",
    "roles": [
      "admin"
    ],
    "endpoint": "v1/hostel/allocations/",
    "export_endpoint": "v1/hostel/allocations/export/",
    "fields": [
      {
        "key": "student_id",
        "label": "Student",
        "type": "ref:students",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "hostel_id",
        "label": "Room",
        "type": "ref:hostels",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "from_date",
        "label": "From date",
        "type": "date",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "to_date",
        "label": "Until",
        "type": "date",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      }
    ],
    "can_write": true,
    "can_read": true
  },
  "notices": {
    "model": "communication.Notice",
    "app": "communication",
    "label": "Notice board",
    "singular": "Notice",
    "roles": [
      "admin",
      "teacher"
    ],
    "endpoint": "v1/communication/notices/",
    "export_endpoint": "v1/communication/notices/export/",
    "fields": [
      {
        "key": "name",
        "label": "Title",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      },
      {
        "key": "date",
        "label": "Date",
        "type": "date",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "audience",
        "label": "Audience",
        "type": "select",
        "required": false,
        "options": [
          "Everyone",
          "Staff",
          "Parents",
          "Students"
        ],
        "default": "Everyone",
        "max_length": 32,
        "min": null
      },
      {
        "key": "description",
        "label": "Message",
        "type": "textarea",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      }
    ],
    "can_write": true,
    "can_read": true
  },
  "messages": {
    "model": "communication.Message",
    "app": "communication",
    "label": "Messages",
    "singular": "Message",
    "roles": [
      "admin",
      "teacher"
    ],
    "endpoint": "v1/communication/messages/",
    "export_endpoint": "v1/communication/messages/export/",
    "fields": [
      {
        "key": "name",
        "label": "Subject",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      },
      {
        "key": "date",
        "label": "Date",
        "type": "date",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "audience",
        "label": "Audience",
        "type": "select",
        "required": false,
        "options": [
          "Everyone",
          "Staff",
          "Parents",
          "Students"
        ],
        "default": "Everyone",
        "max_length": 32,
        "min": null
      },
      {
        "key": "description",
        "label": "Message",
        "type": "textarea",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      }
    ],
    "can_write": true,
    "can_read": true
  },
  "staff": {
    "model": "hr.Staff",
    "app": "hr",
    "label": "Faculty & staff",
    "singular": "Staff member",
    "roles": [
      "admin"
    ],
    "endpoint": "v1/hr/staff/",
    "export_endpoint": "v1/hr/staff/export/",
    "fields": [
      {
        "key": "name",
        "label": "Full name",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      },
      {
        "key": "email",
        "label": "Email",
        "type": "email",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 254,
        "min": null
      },
      {
        "key": "phone",
        "label": "Phone",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 32,
        "min": null
      },
      {
        "key": "designation",
        "label": "Designation",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      },
      {
        "key": "department",
        "label": "Department",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      },
      {
        "key": "salary",
        "label": "Monthly salary",
        "type": "money",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": "0"
      },
      {
        "key": "joined",
        "label": "Joining date",
        "type": "date",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      }
    ],
    "can_write": true,
    "can_read": true
  },
  "payroll": {
    "model": "hr.Payslip",
    "app": "hr",
    "label": "Payroll",
    "singular": "Payslip",
    "roles": [
      "admin",
      "accountant"
    ],
    "endpoint": "v1/hr/payroll/",
    "export_endpoint": "v1/hr/payroll/export/",
    "fields": [
      {
        "key": "staff_id",
        "label": "Staff",
        "type": "ref:staff",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "month",
        "label": "Month (YYYY-MM)",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      },
      {
        "key": "basic",
        "label": "Basic pay",
        "type": "money",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": "0"
      },
      {
        "key": "allowances",
        "label": "Allowances",
        "type": "money",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": "0"
      },
      {
        "key": "deductions",
        "label": "Deductions",
        "type": "money",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": "0"
      },
      {
        "key": "status",
        "label": "Status",
        "type": "select",
        "required": false,
        "options": [
          "Draft",
          "Approved",
          "Paid"
        ],
        "default": "Draft",
        "max_length": 32,
        "min": null
      }
    ],
    "can_write": true,
    "can_read": true
  },
  "reviews": {
    "model": "hr.PerformanceReview",
    "app": "hr",
    "label": "Performance reviews",
    "singular": "Review",
    "roles": [
      "admin"
    ],
    "endpoint": "v1/hr/reviews/",
    "export_endpoint": "v1/hr/reviews/export/",
    "fields": [
      {
        "key": "staff_id",
        "label": "Staff",
        "type": "ref:staff",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "date",
        "label": "Review date",
        "type": "date",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "rating",
        "label": "Rating (0\u20135)",
        "type": "number",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": 0
      },
      {
        "key": "description",
        "label": "Review notes",
        "type": "textarea",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      }
    ],
    "can_write": true,
    "can_read": true
  },
  "courses": {
    "model": "academics.Course",
    "app": "academics",
    "label": "Courses",
    "singular": "Course",
    "roles": [
      "admin"
    ],
    "endpoint": "v1/academics/courses/",
    "export_endpoint": "v1/academics/courses/export/",
    "fields": [
      {
        "key": "name",
        "label": "Course name",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      },
      {
        "key": "code",
        "label": "Course code",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      },
      {
        "key": "description",
        "label": "Description",
        "type": "textarea",
        "required": false,
        "options": null,
        "default": "",
        "max_length": null,
        "min": null
      }
    ],
    "can_write": true,
    "can_read": true
  },
  "academic_years": {
    "model": "academics.AcademicYear",
    "app": "academics",
    "label": "Academic years",
    "singular": "Academic year",
    "roles": [
      "admin"
    ],
    "endpoint": "v1/academics/academic_years/",
    "export_endpoint": "v1/academics/academic_years/export/",
    "fields": [
      {
        "key": "name",
        "label": "Academic year",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      },
      {
        "key": "start_date",
        "label": "Starts",
        "type": "date",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "end_date",
        "label": "Ends",
        "type": "date",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      }
    ],
    "can_write": true,
    "can_read": true
  },
  "enrollments": {
    "model": "students.Enrollment",
    "app": "students",
    "label": "Academic history",
    "singular": "Enrollment",
    "roles": [
      "admin"
    ],
    "endpoint": "v1/students/enrollments/",
    "export_endpoint": "v1/students/enrollments/export/",
    "fields": [
      {
        "key": "student_id",
        "label": "Student",
        "type": "ref:students",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "class_id",
        "label": "Class",
        "type": "ref:classes",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "from_date",
        "label": "From date",
        "type": "date",
        "required": true,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "to_date",
        "label": "Until",
        "type": "date",
        "required": false,
        "options": null,
        "default": null,
        "max_length": null,
        "min": null
      },
      {
        "key": "status",
        "label": "Status",
        "type": "select",
        "required": false,
        "options": [
          "Active",
          "Completed",
          "Transferred",
          "Withdrawn"
        ],
        "default": "Active",
        "max_length": 32,
        "min": null
      }
    ],
    "can_write": true,
    "can_read": true
  },
  "school_settings": {
    "model": "configuration.SchoolSettings",
    "app": "configuration",
    "label": "School settings",
    "singular": "School settings",
    "roles": [
      "admin"
    ],
    "endpoint": "v1/configuration/school_settings/",
    "export_endpoint": "v1/configuration/school_settings/export/",
    "fields": [
      {
        "key": "name",
        "label": "School name",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      },
      {
        "key": "email",
        "label": "Contact email",
        "type": "email",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 254,
        "min": null
      },
      {
        "key": "phone",
        "label": "Phone",
        "type": "text",
        "required": false,
        "options": null,
        "default": "",
        "max_length": 32,
        "min": null
      },
      {
        "key": "address",
        "label": "Address",
        "type": "textarea",
        "required": false,
        "options": null,
        "default": "",
        "max_length": null,
        "min": null
      },
      {
        "key": "currency",
        "label": "Currency",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      },
      {
        "key": "timezone",
        "label": "Timezone",
        "type": "text",
        "required": true,
        "options": null,
        "default": null,
        "max_length": 255,
        "min": null
      }
    ],
    "can_write": true,
    "can_read": true
  }
};
