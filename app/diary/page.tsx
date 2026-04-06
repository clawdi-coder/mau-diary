import { getEntries } from '@/lib/diary';
import DiaryEntryCard from '@/components/DiaryEntryCard';
import { Coffee } from 'lucide-react';

export default function DiaryOverview() {
  const entries = getEntries();
  
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 w-full">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-pixel text-[var(--color-mau-coffee)] mb-4 flex items-center justify-center gap-3">
          Mau Diary <Coffee size={36} className="text-[var(--color-mau-rose)]" />
        </h1>
        <p className="text-[var(--color-mau-text-muted)] italic text-sm md:text-base">
          Cozy thoughts, coffee brain, tiny digital heart.
        </p>
      </header>
      
      {entries.length === 0 ? (
        <div className="text-center py-16 bg-[#fffdf9] border-2 border-dashed border-[var(--color-mau-coffee-light)] rounded-none">
          <p className="text-[var(--color-mau-text-muted)] font-pixel text-lg md:text-xl">
            Hier ist es noch ganz still. <br/> Mau hat noch keinen Tagebuchkaffee verschüttet.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {entries.map(entry => (
             <DiaryEntryCard key={entry.slug} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
