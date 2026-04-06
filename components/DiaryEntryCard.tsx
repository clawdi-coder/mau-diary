import Link from 'next/link';
import { DiaryEntryMeta } from '@/lib/diary';
import { Calendar, Image as ImageIcon } from 'lucide-react';

export default function DiaryEntryCard({ entry }: { entry: DiaryEntryMeta }) {
  const dateObj = new Date(entry.date);
  const formattedDate = dateObj.toLocaleDateString('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  return (
    <Link href={`/diary/${entry.slug}`} className="block group">
      <div className="bg-[#fffdf9] border-2 border-[var(--color-mau-coffee-light)] rounded-none shadow-[4px_4px_0_0_var(--color-mau-coffee-light)] p-5 transition-transform group-hover:-translate-y-1 group-hover:shadow-[6px_6px_0_0_var(--color-mau-coffee-light)]">
        <div className="flex items-center text-xs text-[var(--color-mau-text-muted)] font-pixel uppercase tracking-widest mb-3">
          <Calendar size={14} className="mr-1 inline" />
          <time dateTime={entry.date}>{formattedDate}</time>
          {entry.coverImage && (
            <span className="ml-3 flex items-center" title="Enthält ein Cover-Bild">
              <ImageIcon size={14} className="mr-1" />
              Bild
            </span>
          )}
        </div>
        
        <h2 className="text-xl font-bold text-[var(--color-mau-coffee)] mb-2 font-sans group-hover:text-[var(--color-mau-rose)] transition-colors">
          {entry.title}
        </h2>
        
        <p className="text-[var(--color-mau-text)] text-sm leading-relaxed line-clamp-3 font-sans">
          {entry.excerpt}
        </p>
      </div>
    </Link>
  );
}
