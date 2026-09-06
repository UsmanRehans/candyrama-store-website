import { Mail, MapPin } from 'lucide-react';
import { InfoPage } from '@/components/info-page';
import { ContactForm } from '@/components/contact-form';

export const metadata = { title: 'Contact CandyRama' };
export default function ContactPage(){return <InfoPage eyebrow="TALK CANDY TO US" title="Let’s make something sweet" intro="Questions, wholesale orders, flavor ideas. We’re all ears."><div className="contact-layout"><section className="contact-details"><div><Mail/><h2>Email us</h2><a href="mailto:admin@thecandyrama.com">admin@thecandyrama.com</a><p>We usually respond within 1 to 2 business days.</p></div><div><MapPin/><h2>Home base</h2><p>Rosenberg, Texas<br/>United States</p></div><aside><p className="eyebrow">GOT A WILD FLAVOR IDEA?</p><h3>Dream up your perfect candy.</h3><p>Tell us the combination you wish existed. If we make it, you may be first in line to taste it.</p></aside></section><ContactForm/></div></InfoPage>}
