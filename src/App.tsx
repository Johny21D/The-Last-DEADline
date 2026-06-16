type Urgency = "overdue" | "critical" | "soon" | "upcoming" | "later";

type Assignment = {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  urgency: Urgency;
};

const fakeAssignments: Assignment[] = [
  {
    id: "1",
    title: "Mindfulness Program - Inheritance Lab",
    course: "CSE 210",
    dueDate: "2026-06-16",
    urgency: "overdue",
  },
  {
    id: "2",
    title: "Electricity Worksheet Ch. 5",
    course: "Physics 101",
    dueDate: "2026-06-17",
    urgency: "critical",
  },
  {
    id: "3",
    title: "Conflict Cycle Reflection Post",
    course: "Conflict Studies",
    dueDate: "2026-06-19",
    urgency: "soon",
  },
  {
    id: "4",
    title: "Spectrogram Lab Write-up",
    course: "Physics 101",
    dueDate: "2026-06-23",
    urgency: "upcoming",
  },
  {
    id: "5",
    title: "Final OOP Project Proposal",
    course: "CSE 210",
    dueDate: "2026-07-01",
    urgency: "later",
  },
];

const urgencyStyles: Record<Urgency, string> = {
  overdue: "bg-red-100 text-red-700 border-red-300",
  critical: "bg-orange-100 text-orange-700 border-orange-300",
  soon: "bg-yellow-100 text-yellow-700 border-yellow-300",
  upcoming: "bg-blue-100 text-blue-700 border-blue-300",
  later: "bg-gray-100 text-gray-700 border-gray-300",
};

const urgencyLabels: Record<Urgency, string> = {
  overdue: "Overdue",
  critical: "Due Tomorrow",
  soon: "Due Soon",
  upcoming: "Upcoming",
  later: "Later",
};

function AssignmentCard({ assignment }: { assignment: Assignment }) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
      <div>
        <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
        <p className="text-sm text-gray-500">{assignment.course}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span
          className={`rounded-full border px-3 py-1 text-xs font-medium ${urgencyStyles[assignment.urgency]}`}
        >
          {urgencyLabels[assignment.urgency]}
        </span>
        <span className="text-xs text-gray-400">{assignment.dueDate}</span>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">The Last Deadline</h1>
        <p className="text-gray-500">Your Canvas assignments, sorted by urgency.</p>
      </header>

      <main className="mx-auto flex max-w-2xl flex-col gap-3">
        {fakeAssignments.map((assignment) => (
          <AssignmentCard key={assignment.id} assignment={assignment} />
        ))}
      </main>
    </div>
  );
}

export default App;