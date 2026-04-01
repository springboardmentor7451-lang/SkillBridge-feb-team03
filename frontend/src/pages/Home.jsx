import { Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import CounterCard from "../components/CounterCard";

export default function Home() {
  const { isAuthenticated, logout } = useAuth();

  const impactStats = [
    {
      label: "Active Volunteers",
      value: 200,
      bgClass: "from-sky-50 to-cyan-100/60",
      accentClass: "from-sky-200 to-cyan-100",
    },
    {
      label: "NGO Partners",
      value: 100,
      bgClass: "from-emerald-50 to-lime-100/60",
      accentClass: "from-emerald-200 to-lime-100",
    },
    {
      label: "Opportunities Created",
      value: 40,
      bgClass: "from-orange-50 to-amber-100/60",
      accentClass: "from-orange-200 to-amber-100",
    },
  ];

  const featureCards = [
    {
      title: "Role-Based Dashboards",
      body: "Volunteers and NGOs get personalized experiences with actions relevant to their goals.",
      accent: "from-orange-200 to-amber-100",
      bg: "from-orange-50 to-amber-50",
    },
    {
      title: "Smart Opportunity Discovery",
      body: "Filter by skills, mission type, and commitment level to quickly find a great fit.",
      accent: "from-sky-200 to-cyan-100",
      bg: "from-sky-50 to-cyan-50",
    },
    {
      title: "Application Tracking",
      body: "Follow your applications from submitted to accepted without losing context.",
      accent: "from-emerald-200 to-lime-100",
      bg: "from-emerald-50 to-lime-50",
    },
    {
      title: "In-App Messaging",
      body: "Coordinate with NGOs and volunteers instantly through integrated conversations.",
      accent: "from-rose-200 to-pink-100",
      bg: "from-rose-50 to-pink-50",
    },
  ];

  const howItWorksCards = [
    {
      step: "1",
      title: "Create Your Profile",
      body: "Sign up as a volunteer or NGO, define your focus areas, and showcase your strengths.",
      accent: "from-orange-200 to-amber-100",
      bg: "from-orange-50 to-amber-50",
    },
    {
      step: "2",
      title: "Find The Right Match",
      body: "Use smart filters to discover projects aligned with your skills, interests, and availability.",
      accent: "from-sky-200 to-cyan-100",
      bg: "from-sky-50 to-cyan-50",
    },
    {
      step: "3",
      title: "Collaborate And Deliver",
      body: "Apply, chat with teams, and track outcomes in one place from first message to final delivery.",
      accent: "from-rose-200 to-pink-100",
      bg: "from-rose-50 to-pink-50",
    },
    {
      step: "4",
      title: "Get Shortlisted Faster",
      body: "Receive timely updates and improve your profile with relevant skills to increase acceptance chances.",
      accent: "from-emerald-200 to-lime-100",
      bg: "from-emerald-50 to-lime-50",
    },
  ];

  const sectionAnim = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0 },
  };

  const creatorLinks = [
    {
      label: "Email",
      href: "mailto:kraman4578@gmail.com",
      colorClass: "from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600",
    },
    {
      label: "GitHub",
      href: "https://github.com/amankr4578",
      colorClass: "from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/amankr4578",
      colorClass: "from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600",
    },
    {
      label: "Portfolio",
      href: "https://portfolio-nine-steel-s2h9b2yyb3.vercel.app/",
      colorClass: "from-emerald-500 to-lime-500 hover:from-emerald-600 hover:to-lime-600",
    },
  ];

  // If a token exists when landing on home, clear it so user starts logged out
  useEffect(() => {
    if (isAuthenticated) logout();
  }, [isAuthenticated, logout]);

  // Add reveal animation as sections enter the viewport.
  useEffect(() => {
    const revealElements = document.querySelectorAll("[data-reveal]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
          }
        });
      },
      { threshold: 0.2 }
    );

    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <motion.section
        className="relative overflow-hidden"
        initial="hidden"
        animate="show"
        variants={sectionAnim}
        transition={{ duration: 0.45 }}
      >
        <div className="absolute -left-12 top-14 h-40 w-40 rounded-full bg-orange-300/30 blur-3xl" />
        <div className="absolute right-0 top-6 h-56 w-56 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-rose-200/40 blur-3xl" />

        <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-16 pt-14 md:grid-cols-2 md:items-center md:pb-24 md:pt-20">
          <div className="relative z-10 space-y-6">
            <span className="inline-flex items-center rounded-full border border-orange-300 bg-white/80 px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm backdrop-blur">
              Connecting skills with purpose
            </span>

            <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-6xl">
              Build impact with your
              <span className="bg-gradient-to-r from-orange-600 to-rose-500 bg-clip-text text-transparent"> professional skills</span>
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
              SkillBridge matches talented volunteers with NGOs tackling urgent social challenges.
              Discover meaningful projects, collaborate with purpose, and track your real-world impact.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Start Your Journey
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-slate-600 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-orange-400 hover:text-orange-700"
              >
                Sign In
              </Link>
            </div>
          </div>

          <div className="relative z-10 min-h-[520px] overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-orange-50/40 shadow-2xl shadow-slate-200 backdrop-blur">
            <div className="h-2 w-full bg-gradient-to-r from-orange-200 via-sky-200 to-emerald-200" />
            <div className="p-8 md:p-10">
              <p className="mb-6 text-sm font-medium uppercase tracking-wide text-slate-500">Live Community Snapshot</p>
              <div className="space-y-6">
              {impactStats.map((item) => (
                <CounterCard
                  key={item.label}
                  label={item.label}
                  endValue={item.value}
                  duration={2000}
                  bgClass={item.bgClass}
                  accentClass={item.accentClass}
                />
              ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        id="how"
        className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-orange-50/40 py-16 md:py-24"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={sectionAnim}
        transition={{ duration: 0.45 }}
      >
        <div className="absolute -left-12 top-8 h-44 w-44 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="absolute right-0 top-16 h-56 w-56 rounded-full bg-rose-200/35 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">How It Works</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              A clear flow for volunteers and NGOs to discover each other, collaborate faster, and deliver stronger outcomes.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            {howItWorksCards.map((item, index) => (
              <article
                key={item.step}
                data-reveal
                className={`w-full translate-y-8 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br ${item.bg} opacity-0 shadow-sm backdrop-blur transition-all duration-700 hover:-translate-y-1 hover:shadow-xl`}
                style={{ transitionDelay: `${index * 110}ms` }}
              >
                <div className={`h-1.5 w-full bg-gradient-to-r ${item.accent}`} />
                <div className="p-6">
                  <p className="mb-3 text-3xl">{item.step}</p>
                  <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                  <p className="text-slate-600">{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        id="features"
        className="relative overflow-hidden bg-gradient-to-b from-white via-sky-50/30 to-rose-50/30 py-16 md:py-24"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionAnim}
        transition={{ duration: 0.45 }}
      >
        <div className="absolute left-1/3 top-0 h-48 w-48 rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-56 w-56 rounded-full bg-pink-200/35 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Platform Features</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Designed to keep collaboration human while making discovery and coordination effortless.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {featureCards.map((feature, index) => (
              <article
                key={feature.title}
                data-reveal
                className={`group translate-y-8 overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br ${feature.bg} opacity-0 shadow-sm transition-all duration-700 hover:-translate-y-1 hover:shadow-xl`}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                <div className={`h-2 w-full bg-gradient-to-r ${feature.accent}`} />
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-semibold text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600">{feature.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </motion.section>

      <section id="impact" className="relative overflow-hidden bg-gradient-to-b from-rose-50/20 via-slate-50 to-white py-16 md:py-24">
        <div className="absolute -left-10 top-16 h-48 w-48 rounded-full bg-orange-200/30 blur-3xl" />
        <div className="absolute bottom-10 right-8 h-56 w-56 rounded-full bg-sky-200/30 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="grid gap-8 rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-100 via-green-100 to-lime-100 p-8 text-slate-900 md:grid-cols-2 md:p-12">
            <div data-reveal className="translate-y-8 opacity-0 transition-all duration-700">
              <h2 className="text-3xl font-bold md:text-4xl">Real Impact, Not Just Metrics</h2>
              <p className="mt-4 max-w-xl text-slate-700">
                Every match on SkillBridge helps NGOs move faster and lets volunteers apply their expertise to missions that matter.
              </p>
            </div>
            <div data-reveal className="translate-y-8 space-y-4 opacity-0 transition-all duration-700 delay-150">
              <blockquote className="rounded-2xl border border-emerald-200 bg-white/70 p-5 text-sm leading-relaxed text-slate-700">
                "We filled two critical project roles in less than a week and delivered our campaign ahead of schedule."
              </blockquote>
              <blockquote className="rounded-2xl border border-emerald-200 bg-white/70 p-5 text-sm leading-relaxed text-slate-700">
                "As a volunteer, SkillBridge helped me contribute my data skills to a cause I genuinely care about."
              </blockquote>
            </div>
          </div>

          <div id="for-ngos" className="mt-10 rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 p-8 md:p-12">
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">For NGOs: Build Your Dream Volunteer Team</h2>
            <p className="mt-4 max-w-3xl text-slate-700">
              Publish opportunities, define required skills, and connect with vetted volunteers ready to contribute immediately.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Register As NGO
              </Link>
              <a
                href="#features"
                className="rounded-xl border border-slate-600 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-orange-500"
              >
                Explore Features
              </a>
            </div>
          </div>
        </div>
      </section>

      <motion.section
        id="contact"
        className="relative overflow-hidden bg-gradient-to-b from-white via-orange-50/40 to-sky-50/50 py-16 md:py-20"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={sectionAnim}
        transition={{ duration: 0.45 }}
      >
        <div className="absolute -left-10 top-8 h-44 w-44 rounded-full bg-orange-300/40 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-sky-300/40 blur-3xl" />
        <div className="absolute left-1/3 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-rose-200/30 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="rounded-3xl border border-orange-200/80 bg-gradient-to-br from-white via-orange-50/70 to-sky-50/70 p-8 shadow-xl shadow-orange-100/40 md:p-10">
            <p className="inline-flex rounded-full border border-orange-300/80 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">Contact</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">Built By Aman Kumar</h2>
            <p className="mt-4 max-w-3xl text-slate-600">
              I created this website to connect talented volunteers with NGOs and make social impact collaboration easier.
              If you want a similar website or would like to work together, connect with me using the links below.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {creatorLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("mailto:") ? "_self" : "_blank"}
                  rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-r px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 ${link.colorClass}`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      
    </div>
  );
}
