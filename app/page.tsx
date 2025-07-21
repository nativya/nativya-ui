// -----------------------------------------------------------------------------
// Nativya: Data DAO Landing Page
// File: app/page.tsx
// Stack: Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion
// Author: Gemini AI
// Description: Updated with a more dynamic and interactive hero section.
// -----------------------------------------------------------------------------

"use client";

import React, { useState, useEffect, useRef, FC, ReactNode } from "react";
import {
  ArrowRight,
  Bot,
  KeyRound,
  Mic,
  Award,
  Blocks,
  Users,
  Lock,
  Share2,
  BrainCircuit,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

// --- Custom Hook for Mouse Position ---
const useMousePosition = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const updateMouse = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    window.addEventListener("mousemove", updateMouse);
    return () => window.removeEventListener("mousemove", updateMouse);
  }, [x, y]);

  // Use spring for smoother motion
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  return { x: springX, y: springY };
};

// --- Animated Wrapper Component ---
const AnimatedSection: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const variants = {
    hidden: { opacity: 0, scale: 0.85, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// -----------------------------------------------------------------------------
// MAIN LANDING PAGE COMPONENT
// -----------------------------------------------------------------------------

export default function NativyaLandingPage() {
  return (
    <div className="bg-[#F9FAFB] text-slate-800 font-sans antialiased">
      <style>{`html { scroll-behavior: smooth; }`}</style>

      <Header />
      <main>
        <HeroSection />
        <MissionSection />
        <HowItWorksSection />
        <VanaTechSection />
        <CallToActionSection />
      </main>
      <Footer />
    </div>
  );
}

// -----------------------------------------------------------------------------
// SECTION: HEADER
// -----------------------------------------------------------------------------

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-lg border-b border-slate-200/80 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
            <Bot className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold text-slate-900">Nativya</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#mission"
              className="text-slate-600 hover:text-blue-500 transition-colors duration-300"
            >
              Mission
            </a>
            <a
              href="#howitworks"
              className="text-slate-600 hover:text-blue-500 transition-colors duration-300"
            >
              How It Works
            </a>
            <a
              href="#security"
              className="text-slate-600 hover:text-blue-500 transition-colors duration-300"
            >
              Security
            </a>
          </nav>
          <a
            href="#join"
            className="hidden md:inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-base font-medium rounded-full text-white bg-blue-500 hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
          >
            Start Contributing
          </a>
        </div>
      </div>
    </header>
  );
};

// -----------------------------------------------------------------------------
// SECTION: HERO (ENHANCED)
// -----------------------------------------------------------------------------

const HeroSection = () => {
  const [stateIndex, setStateIndex] = useState(0);
  const { x, y } = useMousePosition();

  // Create parallax transformations
  const rotateX = useTransform(y, [0, window.innerHeight], [5, -5]);
  const rotateY = useTransform(x, [0, window.innerWidth], [-5, 5]);

  const heroStates = [
    { type: "text", content: "What did you eat for lunch today?" },
    { type: "text", content: "आज आपने दोपहर के भोजन में क्या खाया?" },
    { type: "icon", content: <Blocks className="h-16 w-16 text-blue-400" /> },
    { type: "button", content: "Become a Data Contributor" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStateIndex((prevIndex) => (prevIndex + 1) % heroStates.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [heroStates.length]);

  const currentItem = heroStates[stateIndex];

  return (
    <section className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Background Orbs with Parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        <motion.div
          className="absolute top-[10%] left-[10%] w-64 h-64 bg-blue-200 rounded-full opacity-30 filter blur-2xl"
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-[15%] right-[15%] w-72 h-72 bg-indigo-200 rounded-full opacity-30 filter blur-2xl"
          animate={{ x: [0, -30, 0], y: [0, 25, 0] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      </motion.div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Your Language.
            <br />
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-transparent bg-clip-text">
              Your Data. Your Reward.
            </span>
          </h1>
        </motion.div>

        <motion.p
          className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-slate-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          Empower a more inclusive AI by contributing your regional language.
          Nativya gives you ownership, security, and rewards for your linguistic
          data.
        </motion.p>

        <div className="mt-12 h-24 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={stateIndex}
              initial={{ opacity: 0, y: 20, x: -20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: -20, x: 20 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="flex items-center justify-center"
            >
              {currentItem.type === "text" && (
                <p className="text-2xl md:text-3xl font-medium text-slate-700 p-4 rounded-lg bg-white/50 border border-slate-200/70 shadow-sm backdrop-blur-sm">
                  {currentItem.content}
                </p>
              )}
              {currentItem.type === "icon" && (
                <div className="p-4 rounded-lg bg-white/50 border border-slate-200/70 shadow-sm backdrop-blur-sm">
                  {currentItem.content}
                </div>
              )}
              {currentItem.type === "button" && (
                <motion.a
                  href="#join"
                  className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-xl font-bold rounded-full text-white bg-blue-500 shadow-lg"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 10px 30px -10px rgba(59, 130, 246, 0.5)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {currentItem.content} <ArrowRight className="ml-3 h-6 w-6" />
                </motion.a>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

// -----------------------------------------------------------------------------
// SECTION: MISSION ("What Nativya Is Doing")
// -----------------------------------------------------------------------------

const MissionSection = () => {
  const features = [
    {
      icon: <Mic className="h-8 w-8 text-blue-500" />,
      title: "Contribute Your Voice",
      description:
        "Answer simple prompts in your native dialect. Your unique linguistic patterns are invaluable for creating unbiased AI.",
    },
    {
      icon: <Lock className="h-8 w-8 text-green-500" />,
      title: "Secure & Anonymize",
      description:
        "Your data is encrypted and stored decentrally. You maintain full ownership and control, deciding who can access it.",
    },
    {
      icon: <BrainCircuit className="h-8 w-8 text-purple-500" />,
      title: "Power Inclusive AI",
      description:
        "Your contributions train AI models to understand the rich diversity of human language, breaking down digital barriers.",
    },
    {
      icon: <Award className="h-8 w-8 text-amber-500" />,
      title: "Earn Fair Rewards",
      description:
        "As the AI ecosystem uses your data, you are compensated directly. Your knowledge is an asset, and you earn from it.",
    },
  ];

  return (
    <section id="mission" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center">
          <h2 className="text-base font-semibold text-blue-500 tracking-wider uppercase">
            The Mission
          </h2>
          <p className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            From Your Voice to a Fairer AI
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
            We are turning the tide on data monopolies. By putting the power
            back in your hands, we can build artificial intelligence that serves
            everyone, not just a select few.
          </p>
        </AnimatedSection>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-slate-100">
                  {feature.icon}
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-base text-slate-600">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// -----------------------------------------------------------------------------
// SECTION: HOW IT WORKS
// -----------------------------------------------------------------------------

const HowItWorksSection = () => {
  const steps = [
    {
      name: "Sign Up & Create Your Data Vault",
      description:
        "Quickly create an account. This generates your personal, encrypted Data Vault on the Vana Network, which only you can control with your private key.",
    },
    {
      name: "Respond to Prompts",
      description:
        "Browse available data requests and contribute by answering prompts in your language. The more you contribute, the more valuable your vault becomes.",
    },
    {
      name: "Data is Secured on IPFS",
      description:
        "Your encrypted contributions are pinned to the InterPlanetary File System (IPFS), a decentralized network, ensuring it is tamper-proof and not controlled by any single entity.",
    },
    {
      name: "Get Rewarded",
      description:
        "When companies or researchers license your data through the DAO, you receive direct payment in tokens to your wallet. The entire process is transparent on-chain.",
    },
  ];

  return (
    <section id="howitworks" className="py-20 lg:py-32 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center">
          <h2 className="text-base font-semibold text-blue-500 tracking-wider uppercase">
            How It Works
          </h2>
          <p className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            A Simple Path to Data Monetization
          </p>
        </AnimatedSection>

        <div className="relative mt-16">
          <div
            className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-slate-200 hidden md:block"
            aria-hidden="true"
          ></div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <AnimatedSection key={step.name}>
                <div className="md:flex items-center md:space-x-8">
                  <div
                    className={`md:w-1/2 ${
                      index % 2 === 0 ? "md:pr-8" : "md:pl-8 md:order-2"
                    }`}
                  >
                    <div className="p-8 bg-white rounded-2xl shadow-lg border border-slate-100 backdrop-blur-sm bg-white/60">
                      <span className="text-5xl font-black text-slate-200">
                        0{index + 1}
                      </span>
                      <h3 className="mt-4 text-2xl font-bold text-slate-900">
                        {step.name}
                      </h3>
                      <p className="mt-2 text-slate-600">{step.description}</p>
                    </div>
                  </div>
                  <div className="md:w-1/2 hidden md:block"></div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// -----------------------------------------------------------------------------
// SECTION: VANA TECHNOLOGY (SECURITY)
// -----------------------------------------------------------------------------

const VanaTechSection = () => {
  const techPillars = [
    {
      icon: <KeyRound className="h-8 w-8 text-blue-500" />,
      title: "True Data Ownership",
      description:
        "Built on Vana, a user-owned data network. Your data is associated with your private key, meaning you have final say over it—always. No one can access or use it without your permission.",
    },
    {
      icon: <Share2 className="h-8 w-8 text-blue-500" />,
      title: "Decentralized & Secure",
      description:
        "We use IPFS for storage, eliminating central points of failure. Your encrypted data lives on a distributed network, making it resilient to censorship and attacks.",
    },
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: "Community Governed DAO",
      description:
        "Nativya is a Data DAO. This means the community of contributors governs the platform, voting on data pricing, access rights, and treasury management.",
    },
  ];

  return (
    <section id="security" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center">
          <h2 className="text-base font-semibold text-blue-500 tracking-wider uppercase">
            Powered by Vana
          </h2>
          <p className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Your Data, Your Rules. Guaranteed by Code.
          </p>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-slate-600">
            We don't just promise security and ownership; we build on a
            foundation that enforces it. The Vana Protocol provides the
            cryptographic guarantees for a new, user-centric data economy.
          </p>
        </AnimatedSection>

        <div className="mt-16 grid gap-10 md:grid-cols-1 lg:grid-cols-3">
          {techPillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              className="text-center p-8 bg-slate-50/50 rounded-2xl border border-slate-200 h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-white shadow-md mx-auto">
                {pillar.icon}
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-900">
                {pillar.title}
              </h3>
              <p className="mt-2 text-slate-600">{pillar.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// -----------------------------------------------------------------------------
// SECTION: FINAL CALL TO ACTION
// -----------------------------------------------------------------------------

const CallToActionSection = () => {
  return (
    <section id="join" className="relative py-20 lg:py-32">
      <div className="absolute inset-0 bg-white" aria-hidden="true">
        <div className="absolute inset-0 bg-slate-50 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)]"></div>
      </div>

      <div className="relative max-w-2xl mx-auto text-center px-4">
        <AnimatedSection>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Ready to Shape the Future of AI?
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Join a global movement of contributors. Your voice matters. Your
            data has value. Start your journey with Nativya today.
          </p>
          <motion.a
            href="#"
            className="mt-8 inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-full text-white bg-blue-500 shadow-lg"
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 10px 30px -10px rgba(59, 130, 246, 0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            Become a Data Contributor
            <ArrowRight className="ml-3 h-5 w-5" />
          </motion.a>
        </AnimatedSection>
      </div>
    </section>
  );
};

// -----------------------------------------------------------------------------
// SECTION: FOOTER
// -----------------------------------------------------------------------------
const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
          <div className="flex items-center space-x-3">
            <Bot className="h-7 w-7 text-blue-400" />
            <span className="text-xl font-bold text-white">Nativya</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Discord
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Docs
            </a>
          </div>
        </div>
        <div className="mt-8 text-center text-sm border-t border-slate-800 pt-8">
          <p>
            &copy; {new Date().getFullYear()} Nativya Data DAO. All Rights
            Reserved.
          </p>
          <p className="mt-1">
            Empowering individuals to build a more equitable AI.
          </p>
        </div>
      </div>
    </footer>
  );
};
