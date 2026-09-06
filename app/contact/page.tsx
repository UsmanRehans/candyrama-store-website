import { Mail, MapPin } from 'lucide-react';
import { InfoPage } from '@/components/info-page';
import { ContactForm } from '@/components/contact-form';

export const metadata = { title: 'Contact CandyRama' };
export default function ContactPage(){return <InfoPage eyebrow="TALK CANDY TO US" title="Let’s make something sweet" intro="Questions, partnerships, wholesale, flavor ideas—we’re all ears."><div className="contact-layout"><section className="contact-details"><div><Mail/><h2>Email us</h2><a href="mailto:customercare@twistedtreatz.com">customercare@twistedtreatz.com</a><p>We usually respond within 1–2 business days.</p></div><div><MapPin/><h2>Home base</h2><p>9807 Harwin Dr, Suite R<br/>Houston, TX 77036<br/>United States</p></div><aside><p className="eyebrow">GOT A WILD FLAVOR IDEA?</p><h3>Dream up your perfect candy.</h3><p>Tell us the combination you wish existed. If we make it, you may be first in line to taste it.</p></aside></section><ContactForm/></div></InfoPage>}
