export function formatDate(dateString?: string): string {
  if (!dateString) return 'No date set';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatRelativeDays(dateString?: string): { text: string; isUrgent: boolean; isPast: boolean } {
  if (!dateString) return { text: 'No date', isUrgent: false, isPast: false };
  try {
    const target = new Date(dateString);
    const now = new Date();
    target.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)}d ago`, isUrgent: false, isPast: true };
    }
    if (diffDays === 0) {
      return { text: 'Today', isUrgent: true, isPast: false };
    }
    if (diffDays === 1) {
      return { text: 'Tomorrow', isUrgent: true, isPast: false };
    }
    return {
      text: `in ${diffDays} days`,
      isUrgent: diffDays <= 3,
      isPast: false,
    };
  } catch {
    return { text: dateString, isUrgent: false, isPast: false };
  }
}

export function getCategoryBadgeClass(category: string): string {
  switch (category) {
    case 'Coding':
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60';
    case 'System Design':
      return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60';
    case 'Behavioral':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60';
    case 'Resume':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60';
    case 'Mock Interview':
      return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60';
    case 'Company Research':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
  }
}

export function getPriorityBadgeClass(priority: string): string {
  switch (priority) {
    case 'urgent':
      return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/60';
    case 'high':
      return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800/60';
    case 'medium':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60';
    case 'low':
      return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
  }
}

export function getStageBadgeClass(stage: string): string {
  switch (stage) {
    case 'Wishlist':
      return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    case 'Applied':
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60';
    case 'Screening':
      return 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800/60';
    case 'Technical':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60';
    case 'Onsite':
      return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60';
    case 'Offer':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60';
    case 'Rejected':
      return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
  }
}
