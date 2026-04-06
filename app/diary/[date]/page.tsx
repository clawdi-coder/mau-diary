import { getEntryBySlug, getEntries } from '@/lib/diary';
import { notFound } from 'next/navigation';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import DiaryNavigation from '@/components/DiaryNavigation';
import Link from 'next/link';
import { Calendar, ArrowLeft } from 'lucide-react';

export async function generateStaticParams() {
   const entries = getEntries();
   return entries.map(entry => ({ date: entry.slug }));
}

export default async function DiaryEntryPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const entry = getEntryBySlug(date);
  
  if (!entry) {
    notFound();
  }

  const entries = getEntries();
  const currentIndex = entries.findIndex(e => e.slug === date);
  // entries are sorted descending (newest first, index 0 is newest)
  // so nextEntry (newer date) is currentIndex - 1
  // prevEntry (older date) is currentIndex + 1
  const nextEntry = currentIndex > 0 ? entries[currentIndex - 1] : null; 
  const prevEntry = currentIndex < entries.length - 1 ? entries[currentIndex + 1] : null;

  const dateObj = new Date(entry.date);
  const formattedDate = dateObj.toLocaleDateString('de-DE', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 w-full">
      <Link href="/diary" className="inline-flex items-center text-[var(--color-mau-text-muted)] hover:text-[var(--color-mau-coffee)] transition-colors font-pixel text-sm mb-8 uppercase tracking-wider">
        <ArrowLeft size={16} className="mr-2" /> Zurück zur Übersicht
      </Link>
      
      <article className="bg-[#fffdf9] border-2 border-[var(--color-mau-coffee-light)] p-8 md:p-12 shadow-[8px_8px_0_0_var(--color-mau-coffee-light)] relative mb-8">
        {/* Pixel tape detail */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-[var(--color-mau-rose)] opacity-80 -rotate-2 border-2 border-[var(--color-mau-coffee)]"></div>
        
        <header className="mb-10 pb-8 text-center border-b-[3px] border-dotted border-[var(--color-mau-border)]">
          <div className="flex items-center justify-center text-[var(--color-mau-rose)] text-sm font-pixel uppercase tracking-widest mb-4">
             <Calendar size={14} className="mr-2" />
             <time dateTime={entry.date}>{formattedDate}</time>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-sans text-[var(--color-mau-coffee)] leading-tight">
            {entry.title}
          </h1>
        </header>

        <div className="prose prose-stone prose-img:rounded-none prose-h2:text-[var(--color-mau-coffee)] prose-h3:text-[var(--color-mau-coffee)] prose-a:text-[var(--color-mau-rose)] prose-a:font-bold prose-p:text-[var(--color-mau-text)] prose-p:leading-relaxed prose-li:text-[var(--color-mau-text)] prose-strong:text-[var(--color-mau-coffee)] mx-auto max-w-none font-sans">
          <MarkdownRenderer content={entry.content} />
        </div>
      </article>

      <DiaryNavigation prevEntry={prevEntry} nextEntry={nextEntry} />
    </div>
  );
}
