'use client';

import Image from 'next/image';
import Link from 'next/link';
import { SyntheticEvent, useMemo, useState } from 'react';
import { ArrowRight, Gift, Shuffle, Sparkles, Star } from 'lucide-react';
import type { StorefrontProduct } from '@/lib/products';
import { useCart } from './cart-provider';

const cravings = [
  { name: 'Sour', line: 'Pucker up', color: 'pink' },
  { name: 'Sweet', line: 'Pure happy', color: 'yellow' },
  { name: 'Spicy', line: 'Bring the heat', color: 'orange' },
  { name: 'Crunchy', line: 'Hear that snap', color: 'sky' },
];

export function HomeConversionSections({
  products,
}: {
  products: StorefrontProduct[];
}) {
  const { add } = useCart();
  const [box, setBox] = useState<string[]>([]);
  const [boxNotice, setBoxNotice] = useState('');
  const [email, setEmail] = useState('');
  const [signupMessage, setSignupMessage] = useState('');
  const [signupBusy, setSignupBusy] = useState(false);
  const builderProducts = products.slice(0, 6);
  const boxTotal = useMemo(
    () =>
      box.reduce(
        (sum, slug) =>
          sum +
          (products.find((product) => product.slug === slug)?.priceCents ?? 0),
        0,
      ),
    [box, products],
  );

  function surpriseMe() {
    const choices = products.filter((product) => product.slug);
    const choice = choices[Math.floor(Math.random() * choices.length)];
    if (choice) window.location.assign(`/product/${choice.slug}`);
  }

  function toggleBox(slug: string) {
    setBoxNotice('');
    setBox((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : current.length < 4
          ? [...current, slug]
          : current,
    );
  }

  function addBox() {
    if (box.length !== 4) {
      setBoxNotice(
        `Pick ${4 - box.length} more ${box.length === 3 ? 'treat' : 'treats'} first.`,
      );
      return;
    }
    const selected = box.map((slug) =>
      products.find((product) => product.slug === slug),
    );
    const readyToAdd = selected.filter(
      (product): product is StorefrontProduct & { variantSku: string } =>
        Boolean(product?.variantSku),
    );
    readyToAdd.forEach((product) => add(product.variantSku));
    setBoxNotice(
      readyToAdd.length === 4
        ? 'Your candy box is in the bag!'
        : 'Your box looks good. Ordering opens soon.',
    );
  }

  async function subscribe(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setSignupBusy(true);
    setSignupMessage('');
    try {
      const response = await fetch('/api/v1/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'homepage' }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Signup failed.');
      setSignupMessage(
        'You’re in! Your first order BOGO will be added automatically at checkout.',
      );
      setEmail('');
    } catch (error) {
      setSignupMessage(
        error instanceof Error ? error.message : 'Signup failed.',
      );
    } finally {
      setSignupBusy(false);
    }
  }

  return (
    <>
      <section className="surprise-strip">
        <div>
          <Shuffle />
          <span>
            <b>CAN’T PICK?</b> Let candy fate decide.
          </span>
        </div>
        <button className="button secondary" type="button" onClick={surpriseMe}>
          Surprise me <Sparkles />
        </button>
      </section>

      <section className="craving-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SHOP BY MOOD</p>
            <h2>What sounds good?</h2>
          </div>
        </div>
        <div className="craving-grid">
          {cravings.map((craving) => (
            <Link
              className={`craving-tile ${craving.color}`}
              href={`/shop?craving=${craving.name.toLowerCase()}`}
              key={craving.name}
            >
              <small>{craving.line}</small>
              <strong>{craving.name}</strong>
              <ArrowRight />
            </Link>
          ))}
        </div>
      </section>

      <section className="box-builder-section">
        <div className="builder-copy">
          <p className="eyebrow">BUILD A CANDY BOX</p>
          <h2>Pick four. Claim the whole box.</h2>
          <p>Choose four treats for a stash made your way.</p>
          <div
            className="builder-meter"
            aria-label={`${box.length} of 4 treats selected`}
          >
            <span style={{ width: `${box.length * 25}%` }} />
          </div>
          <strong>{box.length} of 4 picked</strong>
        </div>
        <div className="builder-products">
          {builderProducts.map((product) => (
            <button
              type="button"
              onClick={() => toggleBox(product.slug)}
              className={
                box.includes(product.slug)
                  ? 'builder-product selected'
                  : 'builder-product'
              }
              key={product.slug}
            >
              <Image
                src={product.image}
                alt=""
                width={90}
                height={90}
                unoptimized
              />
              <span>{product.name}</span>
              <b>{box.includes(product.slug) ? 'Picked' : 'Pick me'}</b>
            </button>
          ))}
        </div>
        <div className="builder-total">
          <span>
            Box total <b>${(boxTotal / 100).toFixed(2)}</b>
          </span>
          <button className="button primary" type="button" onClick={addBox}>
            Add my box
          </button>
          {boxNotice && <output>{boxNotice}</output>}
        </div>
      </section>

      <section className="flavor-meter-section">
        <div>
          <p className="eyebrow">CHECK THE VIBES</p>
          <h2>Know your candy.</h2>
          <p>Our flavor meter makes the big decisions easy.</p>
        </div>
        <div className="flavor-meter-card">
          <span>Sweet</span>
          <div>
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <b>5</b>
          <span>Sour</span>
          <div>
            <i />
            <i />
            <i />
            <i />
            <i className="off" />
          </div>
          <b>4</b>
          <span>Heat</span>
          <div>
            <i />
            <i />
            <i className="off" />
            <i className="off" />
            <i className="off" />
          </div>
          <b>2</b>
          <span>Crunch</span>
          <div>
            <i />
            <i />
            <i className="off" />
            <i className="off" />
            <i className="off" />
          </div>
          <b>2</b>
        </div>
      </section>

      <section className="candy-wall-section">
        <div className="candy-wall-copy">
          <p className="eyebrow">CANDY IN THE WILD</p>
          <h2>Your photo could live here.</h2>
          <p>
            Tag CandyRama when your order lands. We’ll fill this wall with real
            candy people after launch.
          </p>
        </div>
        <div className="candy-wall-grid">
          <Image
            src="/generated/candy-picnic.png"
            alt="Friends sharing candy outside"
            width={700}
            height={700}
          />
          <Image
            src="/generated/workshop.png"
            alt="Candy being packed in the workshop"
            width={700}
            height={700}
          />
          <div>
            <Star />
            <strong>
              REAL REVIEWS
              <br />
              COMING AFTER
              <br />
              THE FIRST BITE
            </strong>
          </div>
        </div>
      </section>

      <section className="packing-section">
        <div className="packing-image">
          <Image
            src="/generated/workshop.png"
            alt="CandyRama team packing colorful candy"
            fill
            sizes="50vw"
          />
        </div>
        <div className="packing-copy">
          <p className="eyebrow">BEHIND THE BAG</p>
          <h2>Picked. Checked. Packed.</h2>
          <ol>
            <li>
              <b>01</b>
              <span>
                <strong>Pick the good stuff</strong>Every candy gets a look
                before it reaches your bag.
              </span>
            </li>
            <li>
              <b>02</b>
              <span>
                <strong>Seal it fresh</strong>Your treats stay covered and ready
                to travel.
              </span>
            </li>
            <li>
              <b>03</b>
              <span>
                <strong>Send the drama</strong>Your box leaves Rosenberg on its
                way to you.
              </span>
            </li>
          </ol>
          <Link href="/freshness-promise" className="text-link">
            See our freshness promise <ArrowRight />
          </Link>
        </div>
      </section>

      <section className="gifting-section">
        <Gift />
        <div>
          <p className="eyebrow">SEND SOMETHING SWEET</p>
          <h2>Gifts with good taste.</h2>
          <p>
            Add a personal note at checkout. We’ll tuck it into the box for
            birthdays, thank you moments, or no reason at all.
          </p>
        </div>
        <Link href="/shop" className="button secondary">
          Pick a gift <ArrowRight />
        </Link>
      </section>

      <section className="rewards-section">
        <div>
          <p className="eyebrow">SUGAR POINTS</p>
          <h2>Candy now. Credit later.</h2>
          <p>
            Earn one point for every dollar. Every 100 points takes $5 off a
            future order.
          </p>
        </div>
        <div className="rewards-cards">
          <article>
            <b>01</b>
            <strong>Shop</strong>
            <span>Use the same email at checkout.</span>
          </article>
          <article>
            <b>02</b>
            <strong>Earn</strong>
            <span>Your paid order adds Sugar Points.</span>
          </article>
          <article>
            <b>03</b>
            <strong>Share</strong>
            <span>
              You and a friend get 100 points after their first order.
            </span>
          </article>
        </div>
      </section>

      <section className="signup-section">
        <div>
          <p className="eyebrow">JOIN THE SUGAR RUSH</p>
          <h2>New drops. First dibs.</h2>
          <p>
            Get launch news, fresh flavors, and buy one, get one free on your
            first order.
          </p>
        </div>
        <form onSubmit={subscribe}>
          <label htmlFor="candy-email">Email address</label>
          <div>
            <input
              id="candy-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
            <button className="button primary" disabled={signupBusy}>
              {signupBusy ? 'Joining…' : 'Join the list'}
            </button>
          </div>
          {signupMessage && <output>{signupMessage}</output>}
          <small>
            By signing up, you agree to receive CandyRama emails. Unsubscribe
            anytime.
          </small>
        </form>
      </section>
    </>
  );
}
