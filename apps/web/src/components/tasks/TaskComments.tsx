import { useState } from 'react';
import { Send, User } from 'lucide-react';
import { TaskComment } from '../../mocks/taskMockData';

interface TaskCommentsProps {
  comments: TaskComment[];
  onAddComment: (body: string) => void;
}

export function TaskComments({ comments, onAddComment }: TaskCommentsProps) {
  const [newComment, setNewComment] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(newComment.trim());
    setNewComment('');
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
      <div className="border-b border-zinc-150 pb-4">
        <h3 className="text-base font-bold text-zinc-950">Discussion Thread</h3>
        <p className="text-xs text-zinc-500">Log task discussions and supervisor remarks</p>
      </div>

      {/* List of comments */}
      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <p className="text-xs text-zinc-400 italic">No comments posted yet. Start the thread below.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 text-xs">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 border border-zinc-250 text-zinc-600">
                <User className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 bg-zinc-50/50 border border-zinc-150 rounded-lg p-2.5 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                  <span className="font-bold text-zinc-800">{comment.authorName}</span>
                  <span className="text-[10px] text-zinc-400 font-semibold">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-zinc-650 leading-relaxed text-[11px] break-words">{comment.body}</p>
                <span className="mt-1 block text-[9px] font-bold text-brand-650 uppercase tracking-wider">{comment.authorRole}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <hr className="border-zinc-150" />

      {/* Input box */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Write a comment or post updates..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 rounded-lg border border-zinc-250 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-500"
        />
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm transition-colors hover:bg-brand-700 disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
