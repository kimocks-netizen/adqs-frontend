import { useEffect } from 'react';

interface PageMetaProps {
  title: string;
  description?: string;
}

const SITE = 'Adequate Strategies (Pty) Ltd';

export default function PageMeta({ title, description }: PageMetaProps) {
  useEffect(() => {
    document.title = `${title} | ${SITE}`;

    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    if (description) meta.content = description;

    return () => {
      document.title = SITE;
    };
  }, [title, description]);

  return null;
}
