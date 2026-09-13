import type { Metadata } from 'next';
import { hasDemoSession } from '@/lib/server/amazon-demo-auth';
import { DemoStudio } from './studio';
import styles from './studio.module.css';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Amazon Creative Preview | CandyRama',
  robots: { index: false, follow: false, nocache: true },
};

export default async function AmazonDemo({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await hasDemoSession()) return <DemoStudio />;
  const { error } = await searchParams;
  return <main className={`${styles.studio} ${styles.login}`}>
    <div className={styles.loginBrand} aria-hidden="true">CANDY<br />RAMA<span>Taste the Twist.</span></div>
    <section className={styles.loginCard}>
      <p className={styles.kicker}>PRIVATE CREATIVE PREVIEW</p>
      <h1>A little taste of<br />what’s next.</h1>
      <p>Sign in to explore Candy Rama’s Amazon storefront and product graphics.</p>
      <form action="/amazon-demo/session" method="post">
        <label htmlFor="demo-username">Username</label>
        <input id="demo-username" name="username" autoComplete="username" required maxLength={100} />
        <label htmlFor="demo-password">Password</label>
        <input id="demo-password" name="password" type="password" autoComplete="current-password" required maxLength={256} />
        {error && <p role="alert" className={styles.error}>{error === 'unavailable' ? 'The preview is being prepared. Please try again shortly.' : 'That username or password wasn’t right. Please try again.'}</p>}
        <button className={styles.primary} type="submit">Enter the preview <span aria-hidden="true">↗</span></button>
      </form>
      <small>Candy Rama · Amazon creative concepts</small>
    </section>
  </main>;
}
