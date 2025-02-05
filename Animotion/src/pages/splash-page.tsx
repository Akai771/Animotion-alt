import { Menu, Play, Film, Newspaper, Clock, ShieldCheck, Monitor } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { AuroraText } from "@/components/ui/aurora-text";
import { Github, Twitter, Youtube, Instagram } from 'lucide-react';
import { BlurFade } from '@/components/ui/blur-fade';
import { TextAnimate } from '@/components/ui/text-animate';

const Splash = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full bg-black text-white">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] animate-pulse transition-transform hover:translate-y-1"
          style={{ animationDuration: '10s' }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] animate-pulse transition-transformhover:-translate-y-1"
          style={{ animationDuration: '15s' }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 mx-auto flex w-full items-center justify-between p-5 sm:px-10">
        {/* Backdrop Blur Sections */}
        <div className="pointer-events-none absolute inset-0 z-[1] h-[20vh] backdrop-blur-[0.0625px] [mask-image:linear-gradient(0deg,transparent_0%,#000_12.5%,#000_25%,transparent_37.5%)]"></div>
        <div className="pointer-events-none absolute inset-0 z-[2] h-[20vh] backdrop-blur-[0.125px] [mask-image:linear-gradient(0deg,transparent_12.5%,#000_25%,#000_37.5%,transparent_50%)]"></div>
        <div className="pointer-events-none absolute inset-0 z-[3] h-[20vh] backdrop-blur-[0.25px] [mask-image:linear-gradient(0deg,transparent_25%,#000_37.5%,#000_50%,transparent_62.5%)]"></div>
        <div className="pointer-events-none absolute inset-0 z-[4] h-[20vh] backdrop-blur-[0.5px] [mask-image:linear-gradient(0deg,transparent_37.5%,#000_50%,#000_62.5%,transparent_75%)]"></div>
        <div className="pointer-events-none absolute inset-0 z-[5] h-[20vh] backdrop-blur-[1px] [mask-image:linear-gradient(0deg,transparent_50%,#000_62.5%,#000_75%,transparent_87.5%)]"></div>
        <div className="pointer-events-none absolute inset-0 z-[6] h-[20vh] backdrop-blur-[2px] [mask-image:linear-gradient(0deg,transparent_62.5%,#000_75%,#000_87.5%,transparent_100%)]"></div>
        <div className="pointer-events-none absolute inset-0 z-[7] h-[20vh] backdrop-blur-[4px] [mask-image:linear-gradient(0deg,transparent_75%,#000_87.5%,#000_100%,transparent_112.5%)]"></div>

        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <img
            className="w-16 z-[10]"
            src="Animotion_Light.svg"
            alt="Animotion Logo"
          />

          {/* Desktop Nav */}
          <nav className="hidden z-[10] md:flex items-center">
            <Button
              className="z-[10]"
              variant="secondary"
              onClick={handleClick}
            >
              Login
            </Button>
          </nav>

          {/* Mobile Nav Trigger */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-black text-white">
                <nav className="flex flex-col gap-4 mt-8">
                  <Button className="w-full bg-purple-400 text-white" onClick={handleClick}>Login</Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pb-24 h-[90dvh]">
        <div className="mx-auto px-4 h-full max-h-[90dvh] flex flex-col items-center justify-center">
          <div className="max-w-3xl mx-auto text-center">
            <Button variant="outline" className="mb-6 rounded-full">
              Free Anime Streaming
            </Button>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Where Fans Unite For 
              <AuroraText>
                Endless Anime.
              </AuroraText>
            </h1>
            <TextAnimate animation="blurIn" by="character" className="text-lg md:text-xl text-gray-400 mb-12 font-light max-w-xl mx-auto">
              Stream thousands of anime series & movies in top-notch quality, 
              anytime, anywhere — completely free and ad-free. Join a global 
              community of fans & celebrate your passion for anime!
            </TextAnimate>
            <Button onClick={handleClick} size="lg">
              <Play className="mr-2" /> Start Watching
            </Button>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-24 bg-white/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
            Key Features
          </h2>
          <BlurFade delay={0.25} inView>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { title: "1080p HD Streaming", desc: "Crystal-clear anime viewing with zero buffering.", icon: <Monitor size={32} /> },
              { title: "Dub & Sub Options", desc: "Watch anime in your preferred language.", icon: <Film size={32} /> },
              { title: "Ad-Free Experience", desc: "Zero interruptions. Just pure anime enjoyment.", icon: <ShieldCheck size={32} /> },
              { title: "On-Time Episodes", desc: "Never miss a release! Episodes arrive on time.", icon: <Clock size={32} /> },
              { title: "Latest Anime News", desc: "Stay updated with the latest anime industry news.", icon: <Newspaper size={32} /> },
              { title: "Anime Schedule", desc: "Plan your anime watching with up-to-date schedules.", icon: <Clock size={32} /> }
            ].map((feature, i) => (
              <Card
                key={i}
                className="bg-white/5 border-white/10 hover:bg-white/10 transition-all p-6 flex flex-col items-center text-center"
              >
                <div className="mb-4 text-purple-400">{feature.icon}</div>
                <h3 className="text-xl font-light mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </Card>
            ))}
          </div>
          </BlurFade>
        </div>
      </section>

      {/* Why Choose Animotion? */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
            Why Choose Animotion?
          </h2>
          <BlurFade delay={0.25} inView>
          <ul className="space-y-6 max-w-3xl mx-auto">
            {[
              { icon: <ShieldCheck />, title: "Trustworthy & Secure", desc: "We prioritize secure streaming so you can enjoy anime without any risk or unwanted pop-ups." },
              { icon: <Clock />, title: "Fast Releases", desc: "New episodes arrive soon after they air in Japan, keeping you up to date with the latest story arcs." },
              { icon: <Film />, title: "Massive Library", desc: "From classic hits to the newest titles, access the broadest selection of anime, all in one place." },
              { icon: <Monitor />, title: "Cross-Platform Support", desc: "Enjoy seamless streaming on any device—PC, mobile, or smart TV." }
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <div className="text-purple-400 mt-1">{item.icon}</div>
                <div>
                  <span className="font-semibold">{item.title}:</span>
                  <span className="ml-2 font-light text-gray-300">{item.desc}</span>
                </div>
              </li>
            ))}
          </ul>
          </BlurFade>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
            How It Works
          </h2>
          <BlurFade delay={0.25} inView>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: <ShieldCheck size={40} />, title: "1. Create Free Account", desc: "Sign up in seconds and access our entire anime library without any subscription fees." },
              { icon: <Film size={40} />, title: "2. Browse & Discover", desc: "Explore thousands of titles, or use our categories and recommendations to find your new favorite anime." },
              { icon: <Monitor size={40} />, title: "3. Start Streaming", desc: "Watch instantly on any device—no annoying ads, no hidden costs, just pure anime enjoyment!" }
            ].map((step, i) => (
              <Card key={i} className="bg-white/5 border-white/10 p-8 flex flex-col items-center">
                <div className="text-purple-400 mb-4">{step.icon}</div>
                <h3 className="text-xl mb-2 font-light">{step.title}</h3>
                <p className="text-gray-400 text-center">{step.desc}</p>
              </Card>
            ))}
          </div>
          </BlurFade>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
            Frequently Asked Questions
          </h2>
          <BlurFade delay={0.25} inView>
          <div className="max-w-2xl mx-auto">
            <Accordion 
              type="single" 
              defaultValue="item-0" 
              collapsible 
              className="space-y-4"
            >
              {[
                { q: "Is Animotion free?", a: "Yes! Animotion is a free anime streaming platform with no ads." },
                { q: "Are new episodes uploaded on time?", a: "Yes, we ensure timely episode releases for ongoing anime." },
                { q: "Does Animotion offer Dub/Sub options?", a: "Absolutely! You can choose between Dubbed and Subbed anime." }
              ].map((faq, i) => (
                <AccordionItem 
                  key={i} 
                  value={`item-${i}`} 
                  className="bg-white/5 rounded-lg border-white/10"
                >
                  <AccordionTrigger className="px-4 hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 text-gray-400">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          </BlurFade>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="py-16 bg-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="space-y-4">
              <img
                className="w-16 mb-4"
                src="Animotion_Light.svg"
                alt="Animotion Logo"
              />
              <p className="text-gray-400 text-sm">
                Your gateway to endless anime entertainment. Free, ad-free, and built for fans.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                    Browse Anime
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                    Latest Episodes
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                    Release Schedule
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                    News & Updates
                  </Button>
                </li>
              </ul>
            </div>

            {/* Help & Support */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Help & Support</h3>
              <ul className="space-y-2">
                <li>
                  <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                    FAQ
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                    Contact Us
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                    Terms of Service
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                    Privacy Policy
                  </Button>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Connect With Us</h3>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                  <Youtube className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                  <Github className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-400">
                Join our community for the latest updates and announcements
              </p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © 2025 Animotion. All rights reserved.
              </p>
              <div className="flex gap-4 text-sm">
                <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                  Accessibility
                </Button>
                <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                  Cookie Policy
                </Button>
                <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                  Legal Notices
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Splash;