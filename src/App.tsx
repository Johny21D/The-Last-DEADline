import { useEffect, useState } from 'react'
import { useAuth } from './lib/useAuth'
import { Auth } from './lib/Auth'
import { supabase } from './lib/supabase'
import { getUrgency } from './lib/GetUrgency'
import type { Assignment, Urgency } from './lib/Types'
import { CanvasSettings } from './lib/CanvasSettings'
import { usePushNotifications } from './lib/usePushNotifications'

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

type Tab = 'overdue' | 'upcoming' | 'completed';

function AssignmentCard({
  assignment,
  onToggleComplete,
}: {
  assignment: Assignment;
  onToggleComplete: (id: string, completed: boolean) => void;
}) {
  const urgency = getUrgency(assignment.due_at);

  return (
    <div className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={assignment.completed}
          onChange={(e) => onToggleComplete(assignment.id, e.target.checked)}
          className="h-4 w-4"
        />
        <div>
          <h3 className={`font-semibold ${assignment.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
            {assignment.title}
          </h3>
          <p className="text-sm text-gray-500">{assignment.course_name}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        {!assignment.completed && (
          <span className={`rounded-full border px-3 py-1 text-xs font-medium ${urgencyStyles[urgency]}`}>
            {urgencyLabels[urgency]}
          </span>
        )}
        <span className="text-xs text-gray-400">
          {new Date(assignment.due_at).toLocaleString()}
        </span>
      </div>
    </div>
  );
}

function App() {
  const { user, loading } = useAuth();
  const { subscribed, loading: pushLoading, error: pushError, subscribe } = usePushNotifications();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [fetching, setFetching] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('overdue');

  async function fetchAssignments() {
    setFetching(true);
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .order('due_at', { ascending: true });

    if (!error && data) {
      setAssignments(data as Assignment[]);
    }
    setFetching(false);
  }

  useEffect(() => {
    if (user) {
      fetchAssignments();
    }
  }, [user]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <Auth />;

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  async function handleSync() {
    setSyncing(true);
    setSyncMessage(null);

    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;

    const { data, error } = await supabase.functions.invoke('sync-canvas-assignments', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (error) {
      setSyncMessage(`Sync failed: ${error.message}`);
    } else {
      setSyncMessage(`Synced ${data.synced} assignments.`);
      fetchAssignments();
    }

    setSyncing(false);
  }

  async function handleToggleComplete(id: string, completed: boolean) {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed } : a))
    );
    const { error } = await supabase
      .from('assignments')
      .update({ completed })
      .eq('id', id);

    if (error) {
      console.error('Failed to update completed:', error);
    } else {
      console.log('Updated completed successfully for id:', id);
    }
  }

  const now = Date.now();
  const overdueAndSoon = assignments.filter(
    (a) => !a.completed && new Date(a.due_at).getTime() <= now + 1000 * 60 * 60 * 72
  );
  const upcoming = assignments.filter(
    (a) => !a.completed && new Date(a.due_at).getTime() > now + 1000 * 60 * 60 * 72
  );
  const completed = assignments.filter((a) => a.completed);

  const tabData: Record<Tab, Assignment[]> = {
    overdue: overdueAndSoon,
    upcoming: upcoming,
    completed: completed,
  };

  const tabLabels: Record<Tab, string> = {
    overdue: `Overdue & Soon (${overdueAndSoon.length})`,
    upcoming: `Upcoming (${upcoming.length})`,
    completed: `Completed (${completed.length})`,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">The Last Deadline</h1>
          <p className="text-gray-500">Your Canvas assignments, sorted by urgency.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {syncing ? 'Syncing...' : 'Sync from Canvas'}
          </button>
          <button
            onClick={handleSignOut}
            className="rounded-md border px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      </header>

      {!subscribed && (
        <div className="mb-4 rounded-lg border bg-white p-4 shadow-sm">
          <p className="mb-2 text-sm text-gray-700">
            Enable push notifications to get alerts when assignments are due.
          </p>
          <button
            onClick={subscribe}
            disabled={pushLoading}
            className="rounded-md bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {pushLoading ? 'Enabling...' : 'Enable Notifications'}
          </button>
          {pushError && <p className="mt-2 text-sm text-red-600">{pushError}</p>}
        </div>
      )}
      {subscribed && (
        <p className="mb-4 text-sm text-green-600">✓ Push notifications enabled</p>
      )}

      {syncMessage && <p className="mb-4 text-sm text-gray-600">{syncMessage}</p>}

      <main className="mx-auto flex max-w-2xl flex-col gap-3">
        <CanvasSettings />

        <div className="flex gap-1 border-b">
          {(['overdue', 'upcoming', 'completed'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>

        {fetching && <p className="text-sm text-gray-500">Loading assignments...</p>}
        {!fetching && tabData[activeTab].length === 0 && (
          <p className="text-sm text-gray-500">Nothing here.</p>
        )}

        {tabData[activeTab].map((assignment) => (
          <AssignmentCard
            key={assignment.id}
            assignment={assignment}
            onToggleComplete={handleToggleComplete}
          />
        ))}
      </main>
    </div>
  );
}

export default App;