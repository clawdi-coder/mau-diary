import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const entriesDirectory = path.join(process.cwd(), 'entries');

export interface DiaryEntryMeta {
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  coverImage?: string;
}

export interface DiaryEntry extends DiaryEntryMeta {
  content: string;
}

export function getEntries(): DiaryEntryMeta[] {
  if (!fs.existsSync(entriesDirectory)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(entriesDirectory);
  const allEntriesData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      // Slug is date without .md e.g. 2026-04-06
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(entriesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the metadata section if any
      const matterResult = matter(fileContents);
      const content = matterResult.content;
      
      let title = slug;
      let excerpt = '';
      let coverImage: string | undefined = undefined;
      
      const lines = content.split('\n');
      let foundTitle = false;
      let foundExcerpt = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Match title: first H1 heading
        if (!foundTitle && line.startsWith('# ')) {
          title = line.replace('# ', '').trim();
          foundTitle = true;
          continue;
        }

        // Match first image for cover
        if (!coverImage) {
          const imgMatch = line.match(/!\[.*?\]\((.*?)\)/);
          if (imgMatch && imgMatch[1]) {
            coverImage = imgMatch[1];
            // Fix asset path if they provided absolute or relative
            if (coverImage && !coverImage.startsWith('/')) {
               coverImage = '/' + coverImage;
            }
          }
        }
        
        // Extract a simple excerpt: first text paragraph
        if (foundTitle && !foundExcerpt && line.length > 0 && !line.startsWith('#') && !line.startsWith('![')) {
           // Replace Markdown formatting like bold, italic, links for the excerpt
           const cleanedText = line.replace(/(\*\*|__)(.*?)\1/g, '$2')
                                   .replace(/(\*|_)(.*?)\1/g, '$2')
                                   .replace(/\[(.*?)\]\(.*?\)/g, '$1')
                                   .replace(/<[^>]*>?/gm, ''); // simple html strip
           
           excerpt = cleanedText;
           if (excerpt.length > 150) {
             excerpt = excerpt.substring(0, 150) + '...';
           }
           foundExcerpt = true;
        }
      }

      // If no text found after title, just provide a fallback excerpt
      if (!excerpt) {
         excerpt = "Keine Vorschau verfügbar.";
      }

      return {
        slug,
        date: slug, // date is the slug for YYYY-MM-DD
        title,
        excerpt,
        coverImage,
      };
    });

  // Sort entries by date descending
  return allEntriesData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getEntryBySlug(slug: string): DiaryEntry | null {
  const fullPath = path.join(entriesDirectory, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  
  const allEntries = getEntries();
  const meta = allEntries.find(e => e.slug === slug);
  
  if (!meta) return null;

  return {
    ...meta,
    content: matterResult.content, // Return full markdown
  };
}
