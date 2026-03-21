import { Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isAuthenticated, logout } = useAuth();

  const impactStats = [
    { label: "Active Volunteers", value: "1,200+" },
    { label: "NGO Partners", value: "180+" },
    { label: "Projects Completed", value: "540+" },
  ];

  const featureCards = [
    {
      title: "Role-Based Dashboards",
      body: "Volunteers and NGOs get personalized experiences with actions relevant to their goals.",
      accent: "from-orange-200 to-amber-100",
    },
    {
      title: "Smart Opportunity Discovery",
      body: "Filter by skills, mission type, and commitment level to quickly find a great fit.",
      accent: "from-sky-200 to-cyan-100",
    },
    {
      title: "Application Tracking",
      body: "Follow your applications from submitted to accepted without losing context.",
      accent: "from-emerald-200 to-lime-100",
    },
    {
      title: "In-App Messaging",
      body: "Coordinate with NGOs and volunteers instantly through integrated conversations.",
      accent: "from-rose-200 to-pink-100",
    },
  ];

  const sectionAnim = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0 },
  };

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
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-orange-400 hover:text-orange-700"
              >
                Sign In
              </Link>
            </div>
          </div>

          <div className="relative z-10 rounded-3xl border border-white/60 bg-white/85 p-6 shadow-2xl shadow-slate-200 backdrop-blur">
            <p className="mb-4 text-sm font-medium uppercase tracking-wide text-slate-500">Live Community Snapshot</p>
            <div className="space-y-4">
              {impactStats.map((item, index) => (
                <div
                  key={item.label}
                  data-reveal
                  className="translate-y-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 opacity-0 transition-all duration-700"
                  style={{ transitionDelay: `${index * 120}ms` }}
                >
                  <p className="text-2xl font-bold text-slate-900">{item.value}</p>
                  <p className="text-sm text-slate-600">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        id="how"
        className="mx-auto max-w-6xl px-6 py-16 md:py-24"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={sectionAnim}
        transition={{ duration: 0.45 }}
      >
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">How It Works</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            A clear flow for volunteers and NGOs to discover each other, collaborate faster, and deliver stronger outcomes.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div data-reveal className="translate-y-8 rounded-2xl border border-slate-200 bg-white p-6 opacity-0 shadow-sm transition-all duration-700 hover:-translate-y-1 hover:shadow-xl">
            <p className="mb-3 text-3xl">1</p>
            <h3 className="mb-2 text-xl font-semibold">Create Your Profile</h3>
            <p className="text-slate-600">Sign up as a volunteer or NGO, define your focus areas, and showcase your strengths.</p>
          </div>

          <div data-reveal className="translate-y-8 rounded-2xl border border-slate-200 bg-white p-6 opacity-0 shadow-sm transition-all duration-700 delay-100 hover:-translate-y-1 hover:shadow-xl">
            <p className="mb-3 text-3xl">2</p>
            <h3 className="mb-2 text-xl font-semibold">Find The Right Match</h3>
            <p className="text-slate-600">Use smart filters to discover projects aligned with your skills, interests, and availability.</p>
          </div>

          <div data-reveal className="translate-y-8 rounded-2xl border border-slate-200 bg-white p-6 opacity-0 shadow-sm transition-all duration-700 delay-200 hover:-translate-y-1 hover:shadow-xl">
            <p className="mb-3 text-3xl">3</p>
            <h3 className="mb-2 text-xl font-semibold">Collaborate And Deliver</h3>
            <p className="text-slate-600">Apply, chat with teams, and track outcomes in one place from first message to final delivery.</p>
          </div>
        </div>
      </motion.section>

      <motion.section
        id="features"
        className="bg-white py-16 md:py-24"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionAnim}
        transition={{ duration: 0.45 }}
      >
        <div className="mx-auto max-w-6xl px-6">
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
                className="group translate-y-8 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 opacity-0 shadow-sm transition-all duration-700 hover:-translate-y-1 hover:shadow-xl"
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

      <section id="impact" className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="grid gap-8 rounded-3xl bg-slate-900 p-8 text-white md:grid-cols-2 md:p-12">
          <div data-reveal className="translate-y-8 opacity-0 transition-all duration-700">
            <h2 className="text-3xl font-bold md:text-4xl">Real Impact, Not Just Metrics</h2>
            <p className="mt-4 max-w-xl text-slate-200">
              Every match on SkillBridge helps NGOs move faster and lets volunteers apply their expertise to missions that matter.
            </p>
          </div>
          <div data-reveal className="translate-y-8 space-y-4 opacity-0 transition-all duration-700 delay-150">
            <blockquote className="rounded-2xl border border-white/20 bg-white/10 p-5 text-sm leading-relaxed text-slate-100">
              "We filled two critical project roles in less than a week and delivered our campaign ahead of schedule."
            </blockquote>
            <blockquote className="rounded-2xl border border-white/20 bg-white/10 p-5 text-sm leading-relaxed text-slate-100">
              "As a volunteer, SkillBridge helped me contribute my data skills to a cause I genuinely care about."
            </blockquote>
          </div>
        </div>
      </section>

      <section id="for-ngos" className="mx-auto max-w-6xl px-6 pb-20 md:pb-24">
        <div className="rounded-3xl border border-orange-200 bg-gradient-to-r from-orange-50 via-amber-50 to-rose-50 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">For NGOs: Build Your Dream Volunteer Team</h2>
          <p className="mt-4 max-w-3xl text-slate-700">
            Publish opportunities, define required skills, and connect with vetted volunteers ready to contribute immediately.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              to="/register"
              className="rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-600/20 transition hover:-translate-y-0.5 hover:bg-orange-700"
            >
              Register As NGO
            </Link>
            <a
              href="#features"
              className="rounded-xl border border-orange-300 bg-white px-6 py-3 text-sm font-semibold text-orange-700 transition hover:-translate-y-0.5 hover:border-orange-500"
            >
              Explore Features
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-8 text-sm text-slate-600 md:flex-row md:items-center">
          <p className="font-semibold text-slate-800">SkillBridge</p>
          <p>© 2026 SkillBridge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
