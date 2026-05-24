import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import clementImg from "./images/clement.spanneut@epitech.eu.jpg";
import data from "../data.json";

// ── Accessibilité ──
interface A11y {
  largeText: boolean;
  highContrast: boolean;
  reduceMotion: boolean;
}

const fadeUp = (reduceMotion: boolean) => ({
  initial: { opacity: 0, y: reduceMotion ? 0 : 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: reduceMotion ? 0.1 : 1.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }
});

function Separator() {
  return (
    <div className="flex items-center justify-center gap-4 py-4 opacity-20" aria-hidden="true">
      <div className="h-px w-24 bg-base-content" />
      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
      <div className="h-px w-24 bg-base-content" />
    </div>
  );
}

function SkillDots({ level, highContrast }: { level: number; highContrast: boolean }) {
  return (
    <div className="flex gap-1 mt-1" aria-label={`Niveau ${level} sur 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className={`w-2 h-2 rounded-full transition-colors duration-300 ${i <= level ? "bg-primary" : highContrast ? "bg-base-content/20" : "bg-base-content/10"}`} />
      ))}
    </div>
  );
}

function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const [a11y, setA11y] = useState<A11y>({ largeText: false, highContrast: false, reduceMotion: false });
  const [a11yOpen, setA11yOpen] = useState(false);
  const toggle = (key: keyof A11y) => setA11y((prev) => ({ ...prev, [key]: !prev[key] }));

  // ── Formulaire de contact ──
  const [formData, setFormData] = useState({ prenom: "", nom: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async () => {
    if (!formData.prenom || !formData.email || !formData.message) return;
    setFormStatus("sending");
    try {
      const res = await fetch("https://formspree.io/f/mvgwlbyb", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormStatus("success");
        setFormData({ prenom: "", nom: "", email: "", message: "" });
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  };

  const fu = fadeUp(a11y.reduceMotion);
  const textSize = a11y.largeText ? "text-lg" : "text-base";
  const contrastText = a11y.highContrast ? "!text-base-content" : "";
  const contrastSubtext = a11y.highContrast ? "!text-base-content/90" : "text-base-content/50";
  const contrastMuted = a11y.highContrast ? "!text-base-content/80" : "text-base-content/40";

  const { identity, stats, skills, languages, diplomas, experiences, projects, learnings } = data;

  return (
    <div
      className="relative min-h-screen text-base-content overflow-x-hidden bg-base-200"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: a11y.largeText ? "1.15rem" : undefined }}
    >
      {/* ── Grain overlay ── */}
      {!a11y.highContrast && (
        <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.04]" aria-hidden="true"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat", backgroundSize: "128px",
          }}
        />
      )}

      {/* ── Background blobs ── */}
      {!a11y.highContrast && (
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <motion.div animate={a11y.reduceMotion ? {} : { scale: [1, 1.08, 1], x: [0, 20, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[700px] h-[700px] rounded-full bg-primary/10 blur-[140px] top-[-200px] left-[-200px]" />
          <motion.div animate={a11y.reduceMotion ? {} : { scale: [1, 1.06, 1], x: [0, -15, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            className="absolute w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[120px] bottom-[-150px] right-[-150px]" />
        </div>
      )}

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-40" role="navigation" aria-label="Navigation principale">
        <div className="w-11/12 max-w-6xl mx-auto flex justify-between items-center py-6">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: a11y.reduceMotion ? 0.1 : 2 }}
            className={`text-sm tracking-[0.3em] uppercase ${contrastMuted}`}>
            C·S
          </motion.span>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: a11y.reduceMotion ? 0.1 : 2, delay: 0.5 }}
            className="flex gap-6 items-center flex-wrap">
            {["Parcours", "Projets", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className={`text-xs tracking-[0.25em] uppercase ${contrastMuted} hover:text-base-content/80 transition-colors duration-500 ${a11y.largeText ? "text-sm" : ""}`}>
                {item}
              </a>
            ))}
            <a href={identity.cv} download aria-label="Télécharger le CV en PDF"
              className={`text-xs tracking-widest border rounded-full px-3 py-1 border-primary/40 text-primary/70 hover:bg-primary/10 transition-colors duration-300 ${a11y.largeText ? "text-sm" : ""}`}>
              CV ↓
            </a>
            <button onClick={() => setA11yOpen((v) => !v)} aria-label="Ouvrir les options d'accessibilité" aria-expanded={a11yOpen}
              className={`text-xs tracking-widest border rounded-full px-3 py-1 transition-colors duration-300 ${a11yOpen ? "border-primary text-primary" : `border-base-content/20 ${contrastMuted} hover:border-primary/40`}`}>
              ⚙️
            </button>
          </motion.div>
        </div>

        {/* Panel accessibilité */}
        {a11yOpen && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
            className="absolute right-4 md:right-12 top-16 bg-base-100 border border-base-content/10 rounded-2xl p-5 shadow-xl z-50 w-72"
            role="dialog" aria-label="Options d'accessibilité">
            <p className="text-xs tracking-[0.3em] uppercase text-base-content/40 mb-4">Accessibilité</p>
            <div className="space-y-3">
              {[
                { key: "largeText" as keyof A11y, label: "Grand texte", desc: "Augmente la taille des caractères" },
                { key: "highContrast" as keyof A11y, label: "Contraste élevé", desc: "Renforce la lisibilité du texte" },
                { key: "reduceMotion" as keyof A11y, label: "Réduire les animations", desc: "Pour les sensibles aux mouvements" },
              ].map(({ key, label, desc }) => (
                <label key={key} className="flex items-center justify-between gap-4 cursor-pointer">
                  <div>
                    <p className={`font-medium text-sm ${a11y[key] ? "text-primary" : ""}`}>{label}</p>
                    <p className="text-xs text-base-content/40">{desc}</p>
                  </div>
                  <input type="checkbox" className="toggle toggle-primary toggle-sm" checked={a11y[key]} onChange={() => toggle(key)} />
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </nav>

      <div className="w-11/12 max-w-5xl mx-auto">

        {/* ── HERO ── */}
        <section ref={heroRef} className="min-h-screen flex flex-col md:flex-row items-center gap-16 pt-32 pb-24" aria-label="Introduction">
          <motion.div style={a11y.reduceMotion ? {} : { y: heroY, opacity: heroOpacity }} className="flex-1 space-y-10">
            <motion.p initial={{ opacity: 0, x: a11y.reduceMotion ? 0 : -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: a11y.reduceMotion ? 0.1 : 1.5, delay: 0.3 }}
              className={`text-xs tracking-[0.4em] uppercase text-primary/70 ${a11y.largeText ? "text-sm" : ""}`}>
              {identity.title}
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: a11y.reduceMotion ? 0 : 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: a11y.reduceMotion ? 0.1 : 1.8, delay: 0.5 }}
              className={`font-bold leading-[1.1] tracking-tight ${a11y.largeText ? "text-5xl md:text-6xl" : "text-5xl md:text-7xl"} ${contrastText}`}>
              Bonjour,<br />Je m'appelle<br />
              <span className="text-primary italic">{identity.name}.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: a11y.reduceMotion ? 0.1 : 2, delay: 1 }}
              className={`max-w-sm leading-relaxed ${textSize} ${contrastSubtext}`} style={{ fontStyle: "italic" }}>
              {identity.catchphrase}
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: a11y.reduceMotion ? 0.1 : 2, delay: 1.4 }}
              className="flex gap-4 pt-2 flex-wrap">
              <a href="#projets" className={`btn btn-primary rounded-full px-6 tracking-widest uppercase ${a11y.largeText ? "btn-md text-sm" : "btn-sm text-xs"}`}>Projets</a>
              <a href="#contact" className={`btn btn-ghost rounded-full px-6 tracking-widest uppercase border border-base-content/10 ${a11y.largeText ? "btn-md text-sm" : "btn-sm text-xs"}`}>Contact</a>
              <a href={identity.cv} download className={`btn btn-outline btn-primary rounded-full px-6 tracking-widest uppercase ${a11y.largeText ? "btn-md text-sm" : "btn-sm text-xs"}`}>CV ↓</a>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: a11y.reduceMotion ? 0.1 : 2, delay: 1.8 }}
              className="flex gap-5 pt-2">
              <a href={identity.github} target="_blank" rel="noreferrer"
                className={`text-xs tracking-widest uppercase ${contrastMuted} hover:text-primary transition-colors duration-500`}>GitHub ↗</a>
              <a href={`mailto:${identity.email}`}
                className={`text-xs tracking-widest uppercase ${contrastMuted} hover:text-primary transition-colors duration-500`}>Email ↗</a>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: a11y.reduceMotion ? 0.1 : 2.5, delay: 0.8 }}
            className="flex-1 flex justify-center">
            <motion.div animate={a11y.reduceMotion ? {} : { y: [0, -12, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} className="relative">
              <div className="absolute inset-0 rounded-3xl bg-primary/10 blur-3xl scale-110" aria-hidden="true" />
              <div className="relative p-[2px] rounded-3xl bg-gradient-to-br from-primary/30 via-transparent to-secondary/20">
                <div className="bg-base-100/30 backdrop-blur-xl rounded-3xl p-3">
                  <img src={clementImg} className="w-72 h-72 md:w-80 md:h-80 object-cover rounded-2xl" alt={`Portrait de ${identity.name} ${identity.lastname}, développeur`} />
                </div>
              </div>
              <motion.div animate={a11y.reduceMotion ? {} : { y: [0, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute -bottom-4 -right-4 bg-base-100/80 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-2 text-xs text-base-content/60 tracking-widest">
                ☕ {identity.school} · {identity.year}
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        <Separator />

        {/* ── ABOUT ── */}
        <section className="py-32 space-y-16 max-w-3xl mx-auto text-center" aria-label="À propos">
          <motion.p {...fu} className={`text-xs tracking-[0.4em] uppercase text-primary/60 ${a11y.largeText ? "text-sm" : ""}`}>À propos</motion.p>
          <motion.h2 {...fu} transition={{ duration: a11y.reduceMotion ? 0.1 : 1.4, delay: 0.1 }}
            className={`font-bold leading-snug ${a11y.largeText ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl"} ${contrastText}`}>
            Passionné par la création<br />
            <span className={`italic font-normal ${a11y.highContrast ? "text-base-content/70" : "text-base-content/40"}`}>De jeux vidéo et d'applications</span>
          </motion.h2>
          <motion.p {...fu} transition={{ duration: a11y.reduceMotion ? 0.1 : 1.4, delay: 0.2 }}
            className={`leading-loose ${textSize} ${contrastSubtext}`} style={{ fontStyle: "italic" }}>
            {identity.about}
          </motion.p>
        </section>

        <Separator />

        {/* ── STATS ── */}
        <section className="py-24" aria-label="Statistiques">
          <div className="grid md:grid-cols-3 gap-1">
            {stats.map((s, i) => (
              <motion.div key={i} {...fu} transition={{ duration: a11y.reduceMotion ? 0.1 : 1.2, delay: i * 0.15 }}
                className="text-center py-12 border-b md:border-b-0 md:border-r border-base-content/5 last:border-0">
                <p className={`font-bold text-primary mb-3 ${a11y.largeText ? "text-4xl" : "text-5xl"}`}>{s.value}</p>
                <p className={`tracking-[0.3em] uppercase ${contrastMuted} ${a11y.largeText ? "text-sm" : "text-xs"}`}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <Separator />

        {/* ── PARCOURS ── */}
        <section id="parcours" className="py-32 space-y-16" aria-label="Parcours">
          <div className="text-center space-y-3">
            <motion.p {...fu} className={`tracking-[0.4em] uppercase text-primary/60 ${a11y.largeText ? "text-sm" : "text-xs"}`}>Parcours</motion.p>
            <motion.h2 {...fu} transition={{ delay: 0.1 }} className={`font-bold ${contrastText} ${a11y.largeText ? "text-3xl" : "text-4xl"}`}>Mon chemin</motion.h2>
          </div>
          <div className="relative space-y-6">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-base-content/5 hidden md:block" aria-hidden="true" />
            {experiences.map((exp, i) => (
              <motion.div key={i} {...fu} transition={{ duration: a11y.reduceMotion ? 0.1 : 1.2, delay: i * 0.15 }}
                className={`relative md:pl-16 bg-base-100/30 backdrop-blur-xl border rounded-2xl p-6 space-y-2 ${a11y.highContrast ? "border-base-content/20" : "border-base-content/5"}`}>
                <div className={`absolute left-[19px] top-7 w-3 h-3 rounded-full border-2 border-base-200 hidden md:block ${exp.type === "work" ? "bg-primary" : "bg-secondary"}`} aria-hidden="true" />
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${exp.type === "work" ? "bg-primary/10 text-primary/70" : "bg-secondary/10 text-secondary/70"}`}>
                    {exp.type === "work" ? "Stage" : "Formation"}
                  </span>
                  <span className={`text-xs tracking-widest ${contrastMuted}`}>{exp.period}</span>
                </div>
                <h3 className={`font-bold ${contrastText} ${a11y.largeText ? "text-xl" : "text-lg"}`}>{exp.title}</h3>
                <p className="text-sm font-medium text-primary/60">{exp.place}</p>
                <p className={`text-sm leading-relaxed ${contrastSubtext}`} style={{ fontStyle: "italic" }}>{exp.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Diplômes */}
          <div className="space-y-6 pt-8">
            <motion.p {...fu} className={`tracking-[0.4em] uppercase text-primary/60 ${a11y.largeText ? "text-sm" : "text-xs"}`}>
              Diplômes & certifications
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {diplomas.map((d, i) => (
                <motion.div key={i} {...fu} transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-4 bg-base-100/30 backdrop-blur-xl border rounded-2xl px-6 py-5 hover:bg-base-100/50 transition-colors duration-500 ${a11y.highContrast ? "border-base-content/20" : "border-base-content/5 hover:border-primary/20"}`}>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl shrink-0" aria-hidden="true">
                    {d.icon}
                  </div>
                  <div>
                    <p className={`font-bold ${contrastText} ${a11y.largeText ? "text-base" : "text-sm"}`}>{d.name}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Langues */}
          <div className="space-y-6">
            <motion.p {...fu} className={`tracking-[0.4em] uppercase text-primary/60 ${a11y.largeText ? "text-sm" : "text-xs"}`}>
              Langues
            </motion.p>
            <div className="flex flex-wrap gap-4">
              {languages.map((lang, i) => {
                const labels = ["", "Débutant", "Intermédiaire", "Intermédiaire avancé", "Avancé", "Bilingue"];
                return (
                  <motion.div key={i} {...fu} transition={{ delay: i * 0.1 }}
                    className={`flex-1 min-w-[160px] bg-base-100/30 backdrop-blur-xl border rounded-2xl p-6 space-y-3 ${a11y.highContrast ? "border-base-content/20" : "border-base-content/5"}`}>
                    <p className={`tracking-[0.3em] uppercase ${contrastMuted} ${a11y.largeText ? "text-sm" : "text-xs"}`}>Langue</p>
                    <p className={`font-bold ${contrastText} ${a11y.largeText ? "text-2xl" : "text-xl"}`}>{lang.name}</p>
                    <SkillDots level={lang.level} highContrast={a11y.highContrast} />
                    <span className="inline-block text-xs px-3 py-1 rounded-full bg-primary/10 text-primary/70 tracking-wide">
                      {labels[lang.level] || ""}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <Separator />

        {/* ── SKILLS ── */}
        <section className="py-32 space-y-16" aria-label="Compétences">
          <div className="text-center space-y-3">
            <motion.p {...fu} className={`tracking-[0.4em] uppercase text-primary/60 ${a11y.largeText ? "text-sm" : "text-xs"}`}>Compétences</motion.p>
            <motion.h2 {...fu} transition={{ delay: 0.1 }} className={`font-bold ${contrastText} ${a11y.largeText ? "text-3xl" : "text-4xl"}`}>Mes outils</motion.h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {skills.map((skill, i) => (
              <motion.div key={i} {...fu} transition={{ duration: a11y.reduceMotion ? 0.1 : 1.2, delay: i * 0.08 }}
                whileHover={a11y.reduceMotion ? {} : { y: -4, transition: { duration: 0.4 } }}
                className={`group bg-base-100/30 backdrop-blur-xl border rounded-2xl p-5 cursor-default hover:bg-base-100/50 transition-colors duration-700 ${a11y.highContrast ? "border-base-content/20 hover:border-primary" : "border-base-content/5 hover:border-primary/20"}`}>
                <span className="text-2xl" aria-hidden="true">{skill.icon}</span>
                <p className={`font-medium mt-2 transition-colors duration-500 ${contrastSubtext} group-hover:text-base-content ${a11y.largeText ? "text-base" : "text-sm"}`}>{skill.name}</p>
                <SkillDots level={skill.level} highContrast={a11y.highContrast} />
              </motion.div>
            ))}
          </div>
        </section>

        <Separator />

        {/* ── PROJECTS ── */}
        <section id="projets" className="py-32 space-y-16" aria-label="Projets">
          <div className="text-center space-y-3">
            <motion.p {...fu} className={`tracking-[0.4em] uppercase text-primary/60 ${a11y.largeText ? "text-sm" : "text-xs"}`}>Réalisations</motion.p>
            <motion.h2 {...fu} transition={{ delay: 0.1 }} className={`font-bold ${contrastText} ${a11y.largeText ? "text-3xl" : "text-4xl"}`}>Mes projets</motion.h2>
          </div>
          <div className="space-y-6">
            {projects.map((p, i) => (
              <motion.div key={i} {...fu} transition={{ duration: a11y.reduceMotion ? 0.1 : 1.3, delay: i * 0.15 }}
                whileHover={a11y.reduceMotion ? {} : { x: 6, transition: { duration: 0.5, ease: "easeOut" } }}
                className={`group flex flex-col md:flex-row md:items-center justify-between gap-6 bg-base-100/30 backdrop-blur-xl border rounded-2xl p-8 transition-colors duration-700 ${a11y.highContrast ? "border-base-content/20 hover:border-primary" : "border-base-content/5 hover:border-primary/20"}`}>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className={`tracking-widest ${contrastMuted} ${a11y.largeText ? "text-sm" : "text-xs"}`}>{p.year}</span>
                    <span className="w-6 h-px bg-base-content/10" aria-hidden="true" />
                    <span className={`text-primary/60 tracking-widest ${a11y.largeText ? "text-sm" : "text-xs"}`}>{p.tech}</span>
                  </div>
                  <h3 className={`font-bold group-hover:text-primary transition-colors duration-500 ${contrastText} text-2xl`}>{p.title}</h3>
                  <p className={`leading-relaxed max-w-md ${contrastSubtext} ${a11y.largeText ? "text-base" : "text-sm"}`} style={{ fontStyle: "italic" }}>{p.desc}</p>
                </div>
                <div className="flex gap-3 shrink-0 flex-wrap">
                  {p.demo && (
                    <a href={p.demo} target="_blank" rel="noreferrer" aria-label={`Voir la démo de ${p.title}`}
                      className={`btn btn-ghost border rounded-full tracking-widest transition-colors duration-500 ${a11y.highContrast ? "border-base-content/40 hover:border-primary" : "border-base-content/10 hover:border-primary/30"} ${a11y.largeText ? "btn-md text-sm px-5" : "btn-sm text-xs px-5"}`}>
                      Demo ↗
                    </a>
                  )}
                  {p.github && (
                    <a href={p.github} target="_blank" rel="noreferrer" aria-label={`Voir le code de ${p.title} sur GitHub`}
                      className={`btn btn-primary rounded-full tracking-widest ${a11y.largeText ? "btn-md text-sm px-5" : "btn-sm text-xs px-5"}`}>
                      Code ↗
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <Separator />

        {/* ── CE QUE J'AI APPRIS ── */}
        <section className="py-32 space-y-16 max-w-3xl mx-auto" aria-label="Progression et apprentissages">
          <div className="text-center space-y-3">
            <motion.p {...fu} className={`tracking-[0.4em] uppercase text-primary/60 ${a11y.largeText ? "text-sm" : "text-xs"}`}>Progression</motion.p>
            <motion.h2 {...fu} transition={{ delay: 0.1 }} className={`font-bold ${contrastText} ${a11y.largeText ? "text-3xl" : "text-4xl"}`}>Ce que j'ai appris</motion.h2>
          </div>
          <div className="space-y-6">
            {learnings.map((item, i) => (
              <motion.div key={i} {...fu} transition={{ delay: i * 0.15 }}
                className={`flex gap-5 bg-base-100/30 backdrop-blur-xl border rounded-2xl p-6 ${a11y.highContrast ? "border-base-content/20" : "border-base-content/5"}`}>
                <span className="text-3xl shrink-0" aria-hidden="true">{item.icon}</span>
                <div className="space-y-1">
                  <h3 className={`font-bold ${contrastText} ${a11y.largeText ? "text-xl" : "text-lg"}`}>{item.title}</h3>
                  <p className={`leading-relaxed ${contrastSubtext} ${a11y.largeText ? "text-base" : "text-sm"}`} style={{ fontStyle: "italic" }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <Separator />

        {/* ── CONTACT ── */}
        <section id="contact" className="py-32 space-y-16 max-w-xl mx-auto" aria-label="Contact">
          <div className="text-center space-y-3">
            <motion.p {...fu} className={`tracking-[0.4em] uppercase text-primary/60 ${a11y.largeText ? "text-sm" : "text-xs"}`}>Contact</motion.p>
            <motion.h2 {...fu} transition={{ delay: 0.1 }} className={`font-bold ${contrastText} ${a11y.largeText ? "text-3xl" : "text-4xl"}`}>Écrivez-moi</motion.h2>
            <motion.p {...fu} transition={{ delay: 0.2 }} className={`italic ${contrastMuted} ${a11y.largeText ? "text-base" : "text-sm"}`}>Je réponds toujours avec soin.</motion.p>
            <motion.div {...fu} transition={{ delay: 0.3 }} className="flex justify-center gap-6 pt-2 flex-wrap">
              <a href={`mailto:${identity.email}`}
                className={`text-xs tracking-widest uppercase text-primary/60 hover:text-primary transition-colors duration-500 ${a11y.largeText ? "text-sm" : ""}`}>
                {identity.email}
              </a>
            </motion.div>
            <motion.div {...fu} transition={{ delay: 0.4 }} className="flex justify-center gap-6 flex-wrap">
              <a href={`tel:${identity.phone.replace(/\s/g, "")}`}
                className={`text-xs tracking-widest uppercase ${contrastMuted} hover:text-primary transition-colors duration-500 ${a11y.largeText ? "text-sm" : ""}`}>
                {identity.phone}
              </a>
              <a href={identity.github} target="_blank" rel="noreferrer"
                className={`text-xs tracking-widest uppercase ${contrastMuted} hover:text-primary transition-colors duration-500 ${a11y.largeText ? "text-sm" : ""}`}>
                GitHub ↗
              </a>
            </motion.div>
          </div>

          <motion.div {...fu} transition={{ delay: 0.2 }}
            className={`bg-base-100/30 backdrop-blur-xl border rounded-3xl p-8 space-y-4 ${a11y.highContrast ? "border-base-content/20" : "border-base-content/5"}`}>

            {/* État succès */}
            {formStatus === "success" && (
              <div className="text-center py-6 space-y-2">
                <p className="text-2xl">✉️</p>
                <p className={`font-bold ${contrastText}`}>Message envoyé !</p>
                <p className={`text-sm italic ${contrastSubtext}`}>Je te répondrai dès que possible.</p>
                <button onClick={() => setFormStatus("idle")}
                  className="text-xs tracking-widest uppercase text-primary/60 hover:text-primary transition-colors duration-300 mt-2">
                  Envoyer un autre message
                </button>
              </div>
            )}

            {/* État erreur */}
            {formStatus === "error" && (
              <div className="text-center py-4">
                <p className="text-sm italic text-error">
                  Une erreur est survenue. Réessaie ou écris-moi directement par email.
                </p>
                <button onClick={() => setFormStatus("idle")}
                  className="text-xs tracking-widest uppercase text-primary/60 hover:text-primary transition-colors duration-300 mt-3">
                  Réessayer
                </button>
              </div>
            )}

            {/* Formulaire */}
            {formStatus !== "success" && (
              <>
                <input
                  aria-label="Votre prénom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={(e) => setFormData((p) => ({ ...p, prenom: e.target.value }))}
                  className={`input w-full bg-transparent border-0 border-b focus:outline-none focus:border-primary/40 placeholder:tracking-widest transition-colors duration-500 ${a11y.highContrast ? "border-base-content/40 placeholder:text-base-content/50" : "border-base-content/10 placeholder:text-base-content/20"} ${a11y.largeText ? "text-base placeholder:text-base" : "placeholder:text-sm"}`}
                  placeholder="Votre prénom" />

                <input
                  aria-label="Votre nom"
                  name="nom"
                  value={formData.nom}
                  onChange={(e) => setFormData((p) => ({ ...p, nom: e.target.value }))}
                  className={`input w-full bg-transparent border-0 border-b focus:outline-none focus:border-primary/40 placeholder:tracking-widest transition-colors duration-500 ${a11y.highContrast ? "border-base-content/40 placeholder:text-base-content/50" : "border-base-content/10 placeholder:text-base-content/20"} ${a11y.largeText ? "text-base placeholder:text-base" : "placeholder:text-sm"}`}
                  placeholder="Votre nom" />

                <input
                  aria-label="Votre email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  className={`input w-full bg-transparent border-0 border-b focus:outline-none focus:border-primary/40 placeholder:tracking-widest transition-colors duration-500 ${a11y.highContrast ? "border-base-content/40 placeholder:text-base-content/50" : "border-base-content/10 placeholder:text-base-content/20"} ${a11y.largeText ? "text-base placeholder:text-base" : "placeholder:text-sm"}`}
                  placeholder="Votre email" />

                <textarea
                  aria-label="Votre message"
                  name="message"
                  value={formData.message}
                  onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                  className={`textarea w-full bg-transparent border-0 border-b focus:outline-none focus:border-primary/40 placeholder:tracking-widest transition-colors duration-500 resize-none h-28 ${a11y.highContrast ? "border-base-content/40 placeholder:text-base-content/50" : "border-base-content/10 placeholder:text-base-content/20"} ${a11y.largeText ? "text-base placeholder:text-base" : "placeholder:text-sm"}`}
                  placeholder="Votre message..." />

                <div className="pt-4">
                  <motion.button
                    onClick={handleSubmit}
                    disabled={formStatus === "sending"}
                    whileHover={a11y.reduceMotion ? {} : { scale: 1.02 }}
                    whileTap={a11y.reduceMotion ? {} : { scale: 0.98 }}
                    transition={{ duration: 0.4 }}
                    className={`btn btn-primary w-full rounded-full tracking-[0.3em] uppercase disabled:opacity-50 ${a11y.largeText ? "btn-md text-sm" : "btn-sm text-xs"}`}>
                    {formStatus === "sending" ? "Envoi en cours..." : "Envoyer"}
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="text-center py-16 space-y-3 border-t border-base-content/5">
          <div className="flex justify-center gap-6 mb-4 flex-wrap">
            <a href={identity.github} target="_blank" rel="noreferrer"
              className={`text-xs tracking-widest uppercase ${contrastMuted} hover:text-primary transition-colors duration-500`}>GitHub ↗</a>
            <a href={`mailto:${identity.email}`}
              className={`text-xs tracking-widest uppercase ${contrastMuted} hover:text-primary transition-colors duration-500`}>Email ↗</a>
            <a href={identity.cv} download
              className={`text-xs tracking-widest uppercase ${contrastMuted} hover:text-primary transition-colors duration-500`}>CV ↓</a>
          </div>
          <p className={`tracking-[0.4em] uppercase ${contrastMuted} ${a11y.largeText ? "text-sm" : "text-xs"}`}>
            © 2026 {identity.name} {identity.lastname}
          </p>
        </footer>

      </div>
    </div>
  );
}

export default Home;