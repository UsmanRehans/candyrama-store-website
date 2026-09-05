import { ReactNode } from 'react';
import { StoreFooter, StoreHeader } from '@/components/store-chrome';

export function InfoPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return <main><StoreHeader /><section className="info-hero"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></section><div className="info-content">{children}</div><StoreFooter /></main>;
}

export function InfoSection({ title, children }: { title: string; children: ReactNode }) {
  return <section className="info-section"><h2>{title}</h2><div>{children}</div></section>;
}
