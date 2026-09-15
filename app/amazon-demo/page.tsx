import type { Metadata } from 'next';
import Image from 'next/image';
import { hasDemoSession } from '@/lib/server/amazon-demo-auth';
import { redirect } from 'next/navigation';
import styles from './studio.module.css';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Amazon Creative Preview | CandyRama',
  robots: { index: false, follow: false, nocache: true },
};

export default async function AmazonDemo({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await hasDemoSession()) redirect('/amazon-demo/preview');
  const { error } = await searchParams;
  return (
    <main className={`${styles.studio} ${styles.login}`}>
      <section
        className={styles.loginWelcome}
        aria-label="Candy Rama Amazon creative preview"
      >
        <Image
          className={`${styles.loginCandy} ${styles.loginCandyRainbow}`}
          src="/generated/rainbow-sour-cutout.png"
          alt=""
          aria-hidden="true"
          width={1254}
          height={1254}
          priority
        />
        <Image
          className={`${styles.loginCandy} ${styles.loginCandyBlue}`}
          src="/generated/blue-sour-cutout.png"
          alt=""
          aria-hidden="true"
          width={1254}
          height={1254}
          priority
        />
        <div className={styles.loginLogoFrame}>
          <Image
            src="/brand/amazon-preview-logo.png"
            alt="Candy Rama — Candy Shop"
            width={712}
            height={500}
            priority
          />
        </div>
        <p>Private Amazon creative studio</p>
      </section>
      <section className={styles.loginCard}>
        <span className={styles.loginEdition}>CREATIVE DIRECTION / 08</span>
        <h1>
          Come see what
          <br />
          we’re cooking up.
        </h1>
        <p>
          Sign in to review Candy Rama’s private Amazon Store and A+ concepts.
        </p>
        <form action="/amazon-demo/session" method="post">
          <label htmlFor="demo-username">Username</label>
          <input
            id="demo-username"
            name="username"
            autoComplete="username"
            required
            maxLength={100}
          />
          <label htmlFor="demo-password">Password</label>
          <input
            id="demo-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            maxLength={256}
          />
          {error && (
            <p role="alert" className={styles.error}>
              {error === 'unavailable'
                ? 'The preview is being prepared. Please try again shortly.'
                : 'That username or password wasn’t right. Please try again.'}
            </p>
          )}
          <button className={styles.primary} type="submit">
            Enter the creative studio <span aria-hidden="true">↗</span>
          </button>
        </form>
        <small>PRIVATE CONCEPT · NOT PUBLISHED TO AMAZON</small>
      </section>
    </main>
  );
}
