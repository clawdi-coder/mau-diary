import Link from 'next/link';
import { DiaryEntryMeta } from '@/lib/diary';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Props {
  prevEntry: DiaryEntryMeta | null; // Older
  nextEntry: DiaryEntryMeta | null; // Newer
}

export default function DiaryNavigation({ prevEntry, nextEntry }: Props) {
  return (
    <nav className="flex items-center justify-between mt-12 py-6 border-t-2 border-dashed border-[var(--color-mau-border)]">
      <div className="flex-1 max-w-[45%]">
        {prevEntry && (
          <Link href={`/diary/${prevEntry.slug}`} className="group flex flex-col">
            <span className="text-[var(--color-mau-text-muted)] text-xs font-pixel uppercase flex items-center mb-1">
              <ArrowLeft size={12} className="mr-1 group-hover:-translate-x-1 transition-transform" /> Vorheriger Tag
            </span>
            <span className="font-sans font-bold text-[var(--color-mau-coffee)] group-hover:text-[var(--color-mau-rose)] text-sm md:text-base truncate">
              {prevEntry.title}
            </span>
          </Link>
        )}
      </div>
      
      <div className="flex-1 max-w-[45%] text-right">
        {nextEntry && (
          <Link href={`/diary/${nextEntry.slug}`} className="group flex flex-col items-end">
            <span className="text-[var(--color-mau-text-muted)] text-xs font-pixel uppercase flex items-center mb-1">
              Nächster Tag <ArrowRight size={12} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="font-sans font-bold text-[var(--color-mau-coffee)] group-hover:text-[var(--color-mau-rose)] text-sm md:text-base truncate">
              {nextEntry.title}
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
