/**
 * Obsidian Terminal Atlas — asymmetric developer portfolio home page.
 * All sections behave like a measured systems console: graphite, Signal Lime, mono metadata, restrained motion.
 */
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import GitHubActivity from "@/components/GitHubActivity";
import {
  ArrowDownRight,
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  Menu,
  MoveRight,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

const navItems = [
  { label: "about", href: "#about", number: "00" },
  { label: "skills", href: "#skills", number: "01" },
  { label: "projects", href: "#projects", number: "02" },
  { label: "contact", href: "#contact", number: "03" },
];

const skillCategories = [
  {
    title: "Frontend",
    skills: [
      { name: "React / Next.js", level: 92 },
      { name: "TypeScript", level: 88 },
      { name: "Tailwind CSS", level: 95 },
      { name: "Framer Motion", level: 80 },
      { name: "HTML / CSS", level: 95 },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js", level: 88 },
      { name: "Express.js", level: 85 },
      { name: "Python / Django", level: 75 },
      { name: "REST APIs", level: 90 },
      { name: "GraphQL", level: 72 },
    ],
  },
  {
    title: "Database & DevOps",
    skills: [
      { name: "PostgreSQL", level: 82 },
      { name: "MongoDB", level: 80 },
      { name: "Redis", level: 70 },
      { name: "Docker", level: 78 },
      { name: "AWS / Vercel", level: 75 },
    ],
  },
];

const familiarTools = ["Git", "Linux", "Convex", "Firebase", "Supabase", "Prisma", "Redux", "SQL", "Figma", "Webpack", "Vite", "Sass", "WebSockets"];

const codeSnippets = [
  "const idea = await build()",
  "git commit -m 'learn'",
  "type Project = { intent: string }",
  "npm run dev",
  "fetch('/api/curiosity')",
  "const [skill, grow] = useState()",
  "interface Build { progress: number }",
  "for (const problem of realWorld) solve()",
  "git push origin main",
  "console.log('keep learning')",
  "async function makeItWork() {}",
  "export default Portfolio",
];

type TerminalEntry = { prompt?: boolean; text: string; tone?: "output" | "success" | "warning" };

const terminalBootLines: TerminalEntry[] = [
  { text: "Interactive terminal ready.", tone: "success" },
  { text: "Try: help, about, skills, projects, github, contact, or clear.", tone: "output" },
];

function FloatingCodeBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    type CodeParticle = { text: string; x: number; y: number; size: number; speed: number; opacity: number; drift: number };
    let particles: CodeParticle[] = [];

    const createParticles = () => {
      const count = Math.max(6, Math.min(15, Math.round((width * height) / 70000)));
      particles = Array.from({ length: count }, (_, index) => ({
        text: codeSnippets[index % codeSnippets.length],
        x: width * (0.39 + Math.random() * 0.58),
        y: Math.random() * height,
        size: 8 + Math.random() * 3,
        speed: 0.11 + Math.random() * 0.16,
        opacity: 0.045 + Math.random() * 0.075,
        drift: -0.1 + Math.random() * 0.2,
      }));
    };

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * ratio));
      canvas.height = Math.max(1, Math.floor(height * ratio));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      createParticles();
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      particles.forEach((particle, index) => {
        if (!reducedMotion) {
          particle.y += particle.speed;
          particle.x += particle.drift + Math.sin(index + particle.y * 0.01) * 0.04;
          if (particle.y > height + 24) {
            particle.y = -18;
            particle.x = width * (0.45 + Math.random() * 0.5);
            particle.text = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
          }
        }
        context.save();
        context.font = `500 ${particle.size}px "IBM Plex Mono", monospace`;
        context.fillStyle = `rgba(216, 255, 62, ${particle.opacity})`;
        context.fillText(particle.text, particle.x, particle.y);
        context.restore();
      });
    };

    const animate = () => {
      draw();
      if (!reducedMotion) frame = window.requestAnimationFrame(animate);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    resize();
    animate();
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-code-canvas" aria-hidden="true" />;
}

function InteractiveTerminal() {
  const [input, setInput] = useState("");
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [booted, setBooted] = useState(false);
  const [typedBootLine, setTypedBootLine] = useState("");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setEntries(terminalBootLines);
      setBooted(true);
      return;
    }
    let lineIndex = 0;
    let charIndex = 0;
    let timer = 0;
    const typeNext = () => {
      const line = terminalBootLines[lineIndex];
      if (!line) {
        setBooted(true);
        return;
      }
      if (charIndex <= line.text.length) {
        setTypedBootLine(line.text.slice(0, charIndex));
        charIndex += 1;
        timer = window.setTimeout(typeNext, 18);
        return;
      }
      setEntries((current) => [...current, line]);
      setTypedBootLine("");
      lineIndex += 1;
      charIndex = 0;
      timer = window.setTimeout(typeNext, 130);
    };
    timer = window.setTimeout(typeNext, 260);
    return () => window.clearTimeout(timer);
  }, []);

  const navigateTo = (target: string) => document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const runCommand = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const command = input.trim().toLowerCase();
    if (!command || !booted) return;
    const nextEntries: TerminalEntry[] = [{ prompt: true, text: command }];

    if (command === "clear") {
      setEntries([]);
      setInput("");
      return;
    }

    const responses: Record<string, TerminalEntry> = {
      help: { text: "Commands: about · skills · projects · github · contact · clear", tone: "output" },
      about: { text: "Navigating to: about me", tone: "success" },
      skills: { text: "Navigating to: skills & tech", tone: "success" },
      projects: { text: "Navigating to: projects", tone: "success" },
      github: { text: "Navigating to: GitHub activity", tone: "success" },
      contact: { text: "Navigating to: contact", tone: "success" },
    };
    const response = responses[command] ?? { text: `Command not found: ${command}. Type help to view commands.`, tone: "warning" as const };
    if (["about", "skills", "projects", "github", "contact"].includes(command)) navigateTo(command);
    setEntries((current) => [...current, ...nextEntries, response].slice(-8));
    setInput("");
  };

  return (
    <div className="hero-terminal" aria-label="Interactive portfolio terminal">
      <div className="terminal-titlebar"><span><i /> portfolio.sh</span><b>{booted ? "interactive" : "booting"}</b><span>— □ ×</span></div>
      <div className="terminal-output">
        {entries.map((entry, index) => (
          <p className={entry.tone ?? "output"} key={`${entry.text}-${index}`}>{entry.prompt ? <><span>guest@portfolio:~$</span> {entry.text}</> : entry.text}</p>
        ))}
        {!booted && <p className="terminal-boot-line">{typedBootLine}<span className="terminal-caret">▍</span></p>}
      </div>
      <form onSubmit={runCommand} className="terminal-input-row">
        <label htmlFor="terminal-command">guest@portfolio:~$</label>
        <input id="terminal-command" value={input} onChange={(event) => setInput(event.target.value)} placeholder={booted ? "type help" : "boot sequence in progress"} autoComplete="off" spellCheck="false" disabled={!booted} />
      </form>
    </div>
  );
}

const projects = [
  {
    id: "01",
    name: "Community Helper",
    type: "Emergency response platform",
    description: "Human resource allocation app that assigns volunteer tasks, shows their locations, and tracks metrics during emergencies.",
    longDescription: "Built with Vite and React, featuring real-time emergency alerts via WebSockets, a comprehensive analytics admin panel, and Firebase-backed deployment on Vercel.",
    stack: ["Next.js", "TypeScript", "NoSQL", "Firebase", "Tailwind CSS", "WebSockets"],
    github: "https://github.com/nirupamdutta746-web/Community-Helper.git",
    live: "https://community-helper-one.vercel.app",
    mark: "CH",
    accent: "lime",
  },
  {
    id: "02",
    name: "RoTraff",
    type: "Road safety platform",
    description: "Community-driven road safety platform for reporting hazards, verifying incidents collaboratively, and finding safer routes.",
    longDescription: "Uses real-time TomTom map plotting, risk-scored route planning, Stellar blockchain rewards for contributors, WebSockets, and Convex for the backend.",
    stack: ["React", "Node.js", "Convex", "WebSocket", "three.js", "Tailwind CSS", "TomTom API", "Stellar Blockchain"],
    github: "https://github.com/nirupamdutta746-web/RoTraff_v1.git",
    live: "https://ro-traff-v1.vercel.app",
    mark: "RT",
    accent: "paper",
  },
  {
    id: "03",
    name: "Drishti",
    type: "Chrome accessibility extension",
    description: "A Chrome extension that helps people with colour blindness navigate the web with four adaptive viewing modes.",
    longDescription: "Supports Protanopia, Deuteranopia, Tritanopia, and Achromatopsia modes, together with text contrast, hyperlink highlighting, and colour-swatch controls.",
    stack: ["JavaScript", "HTML", "CSS", "Chrome Extension", "Color Blindness"],
    github: "https://github.com/nirupamdutta746-web/Drishti-ColorBlind-extension-.git",
    live: "https://github.com/nirupamdutta746-web/Drishti-ColorBlind-extension-.git",
    mark: "DR",
    accent: "graphite",
  },
];

function SectionMark({ index, label }: { index: string; label: string }) {
  return (
    <div className="section-mark" aria-hidden="true">
      <span>[{index}]</span>
      <i />
      <span>{label}</span>
      <b><em /><em /><em /></b>
    </div>
  );
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 28, scale: 0.988 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.24 }}
      transition={{ duration: 0.66, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ScrollVector({ children, direction = 1, distance = 28, className = "" }: { children: React.ReactNode; direction?: 1 | -1; distance?: number; className?: string }) {
  const vectorRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: vectorRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [distance * direction, 0, distance * -direction]);
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [direction * 0.7, 0, direction * -0.7]);

  return <motion.div ref={vectorRef} className={`scroll-vector ${className}`} style={shouldReduceMotion ? undefined : { y, rotate }}>{children}</motion.div>;
}

export default function Home() {
  const { scrollY, scrollYProgress } = useScroll();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("00");
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.5 });
  const mapRotation = useTransform(scrollY, [0, 2200], [-4, 22]);
  const mapDrift = useTransform(scrollY, [0, 2200], [0, -180]);
  const orbLift = useTransform(scrollY, [0, 2200], [0, -270]);
  const backgroundShift = useTransform(scrollY, [0, 1600], [0, -80]);

  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveSection(visible.target.getAttribute("data-index") ?? "00");
      },
      { rootMargin: "-34% 0px -53% 0px" },
    );
    document.querySelectorAll<HTMLElement>("[data-index]").forEach((section) => sectionObserver.observe(section));
    return () => sectionObserver.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main id="top" className="atlas-page">
      <motion.div className="progress-line" style={{ scaleX: smoothProgress }} />
      <motion.div className="terminal-stage" style={{ y: orbLift }} aria-hidden="true">
        <motion.div className="terminal-map" style={{ rotate: mapRotation, x: mapDrift }}>
          <div className="terminal-map-bar"><span>node.map</span><span>live</span><i /></div>
          <svg viewBox="0 0 800 800" className="terminal-map-svg">
            <g className="map-grid"><path d="M0 100H800M0 200H800M0 300H800M0 400H800M0 500H800M0 600H800M0 700H800M100 0V800M200 0V800M300 0V800M400 0V800M500 0V800M600 0V800M700 0V800" /></g>
            <g className="map-routes"><path d="M70 607L181 509L280 594L378 291L494 342L612 198L733 274" /><path d="M40 316L207 260L321 356L453 235L607 384L756 340" /><path d="M108 121L247 210L386 128L548 260L732 119" /></g>
            <g className="map-rings"><circle cx="381" cy="294" r="104" /><circle cx="381" cy="294" r="160" /><circle cx="381" cy="294" r="220" /></g>
            <g className="map-points"><circle cx="181" cy="509" r="8" /><circle cx="378" cy="291" r="11" /><circle cx="612" cy="198" r="7" /><circle cx="207" cy="260" r="6" /><circle cx="548" cy="260" r="6" /></g>
          </svg>
          <span className="map-label label-a">VTX / 381.294</span><span className="map-label label-b">packet: nominal</span><span className="map-label label-c">sync // 01</span>
          <div className="terminal-stream"><span>&gt; initializing mesh...</span><span>&gt; route vector locked</span><span>&gt; listening on :8080</span><span className="stream-cursor">_</span></div>
        </motion.div>
      </motion.div>
      <motion.div className="grain-field" style={{ y: backgroundShift }} aria-hidden="true" />

      <aside className="system-rail" aria-label="Section navigation">
        <a href="#top" className="logo-lockup" aria-label="dev null, back to top">
          <img src="9621.jpg" alt="My Picture" />
          <span>Nirupam Dutta</span>
        </a>
        <div className="console-readout" aria-label={`Current section ${activeSection}`}>
          <span>scroll index</span>
          <strong>{activeSection}</strong>
          <div className="rail-vector"><motion.i style={{ scaleY: smoothProgress }} /></div>
          <b>{navItems.find((item) => item.number === activeSection)?.label ?? "index"}</b>
        </div>
        <nav className="rail-nav">
          {navItems.map((item) => (
            <a className={activeSection === item.number ? "is-active" : ""} href={item.href} key={item.label}>
              <span>{item.number}</span>
              <b>{item.label}</b>
            </a>
          ))}
        </nav>
        <div className="rail-bottom">
          <span className="status-dot" />
          <span>learning / year 02</span>
        </div>
      </aside>

      <header className="mobile-header">
        <a href="#top" className="logo-lockup" aria-label="dev null, back to top">
          <img src="/9621.jpg" alt="" />
          <span>Nirupam Dutta</span>
        </a>
        <button className="menu-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="Toggle navigation">
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </header>
      <div className={`mobile-menu ${menuOpen ? "is-open" : ""}`}>
        {navItems.map((item) => (
          <a href={item.href} key={item.label} onClick={closeMenu}>
            <span>{item.number}</span> {item.label}
          </a>
        ))}
      </div>

      <div className="content-plane">
        <section id="about" className="hero section-shell" data-index="00">
          <FloatingCodeBackdrop />
          <div className="hero-kicker">
            <span className="status-dot" /> b.tech cse / year 02
          </div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.72, ease: [0.23, 1, 0.32, 1] }}
            className="hero-copy"
          >
            <p className="command-line"><span>student@cse:~/portfolio</span> $ cat introduction.txt</p>
            <p className="eyebrow">[00] about me — 2nd year b.tech cse student</p>
            <h1>Learning to build<br /><em>systems with intent.</em></h1>
            <p className="hero-lede">I’m a second-year BTech Computer Science student who enjoys turning ideas into working web experiences. I’m learning by building projects, exploring new tools, and improving one thoughtful iteration at a time.</p>
            <div className="hero-actions">
              <a href="#projects" className="signal-button">inspect selected work <ArrowDownRight size={18} /></a>
              <a href="mailto:nirupamdutta746@gmail.com" className="text-link">say hello <MoveRight size={17} /></a>
            </div>
          </motion.div>
          <InteractiveTerminal />
          <div className="hero-coordinates" aria-hidden="true">
            <span>LOC / 51.5072° N</span><span>SYS / ACTIVE</span><span>UTC / 09:42:16</span>
          </div>
          <div className="hero-atlas" aria-hidden="true"><span>XR-04</span><i /><i /><i /><b>axis / orbit</b></div>
          <div className="scroll-cue"><span>scroll to investigate</span><i /></div>
        </section>

        <section id="skills" className="capability-band section-shell" data-index="01">
          <SectionMark index="01" label="skills I have" />
          <Reveal className="skills-intro">
            <p className="eyebrow">terminal profile / learning stack</p>
            <h2>Learning <em>stack.</em></h2>
            <p>The technologies I use and improve through coursework, self-learning, and hands-on web projects.</p>
          </Reveal>
          <ScrollVector direction={1} distance={30}>
            <div className="skill-category-grid">
              {skillCategories.map((category, categoryIndex) => (
                <Reveal delay={categoryIndex * 0.08} key={category.title}>
                  <article className="skill-terminal-card">
                    <header><span className="status-dot" /><h3>{category.title}</h3><b>0{categoryIndex + 1}</b></header>
                    <div className="skill-bars">
                      {category.skills.map((skill, skillIndex) => (
                        <div className="skill-bar-row" key={skill.name}>
                          <div className="skill-bar-label"><span>{skill.name}</span><b>{skill.level}%</b></div>
                          <div className="skill-bar-track">
                            <motion.i
                              initial={{ width: "0%" }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: false, amount: 0.65 }}
                              transition={{ duration: 1.05, delay: categoryIndex * 0.16 + skillIndex * 0.08, ease: [0.23, 1, 0.32, 1] }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </ScrollVector>
          <ScrollVector direction={-1} distance={18}>
            <Reveal delay={0.18} className="familiar-tools">
              <p>also familiar with:</p>
              <div>
                {familiarTools.map((tool, index) => (
                  <motion.span
                    key={tool}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: index * 0.035, duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
                  >
                    {tool}
                  </motion.span>
                ))}
              </div>
            </Reveal>
          </ScrollVector>
        </section>

        <section id="projects" className="work-section section-shell" data-index="02">
          <SectionMark index="02" label="projects I have made" />
          <div className="work-heading">
            <Reveal><h2>Build log:<br /><em>selected studies.</em></h2></Reveal>
            <Reveal delay={0.1}><p>These projects are my practical space for exploring frontend development, product thinking, and cleaner user experiences.</p></Reveal>
          </div>
          <ScrollVector direction={-1} distance={42}>
            <div className="project-stack">
              {projects.map((project, index) => (
                <Reveal delay={index * 0.06} key={project.id}>
                  <article className={`project-card project-${project.accent}`}>
                  <a className="project-card-link" href={project.live} target="_blank" rel="noreferrer" aria-label={`Open ${project.name} live demo`} />
                  <div className="project-meta"><span>[{project.id}]</span><span>{project.type}</span></div>
                  <div className="project-mark" aria-hidden="true">{project.mark}</div>
                  <div className={`project-screenshot-placeholder screenshot-${index}`} aria-hidden="true">
                    <div className="screenshot-bar"><i /><i /><i /><span>{project.name.toLowerCase().replaceAll(" ", "-")}.app</span></div>
                    <div className="screenshot-ui"><b /><b /><b /><i /><i /><i /></div>
                    <span>project screenshot / coming soon</span>
                  </div>
                  <div className={`project-diagnostic diagnostic-${index}`} aria-hidden="true"><i /><i /><i /><b>system / live</b></div>
                  <div className="project-content">
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                    <div className="project-footer"><span className="project-stack-prompt">hover to inspect stack</span><span className="project-open-mark"><ArrowUpRight size={19} /></span></div>
                  </div>
                  <div className="project-hover-stack">
                    <div className="project-stack-head"><span>stack / inspect</span><b>{project.stack.length} modules</b></div>
                    <p>{project.longDescription}</p>
                    <div className="project-tech-list">{project.stack.map((tag) => <span key={tag}>{tag}</span>)}</div>
                    <div className="project-link-actions"><a href={project.github} target="_blank" rel="noreferrer">source code <ArrowUpRight size={14} /></a><a href={project.live} target="_blank" rel="noreferrer">live demo <ArrowUpRight size={14} /></a></div>
                  </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </ScrollVector>
          <a href="mailto:hello@devnull.studio?subject=Project%20details" className="archive-link">request implementation notes <ArrowUpRight size={18} /></a>
        </section>

        <GitHubActivity />

        <section id="contact" className="contact-section section-shell" data-index="03">
          <SectionMark index="03" label="contact / system export" />
          <Reveal className="contact-grid">
            <div><p className="eyebrow">want to connect or share an opportunity?</p><h2>Transmit a<br /><em>signal.</em></h2></div>
            <div className="contact-actions"><a href="mailto:nirupamdutta746@gmail.com" className="contact-email">nirupamdutta746@gmail.com <ArrowUpRight size={25} /></a><p>I’m always interested in student communities, hackathons, internships, open-source learning, and meaningful conversations about technology.</p><div className="social-links"><a href="https://github.com/nirupamdutta746-web" target="_blank" rel="noreferrer"><Github size={18} /> github</a><a href="https://www.linkedin.com/in/nirupam-dutta-9753993a5/" target="_blank" rel="noreferrer"><Linkedin size={18} /> linkedin</a><a href="mailto:nirupamdutta746@gmail.com"><Mail size={18} /> email</a></div></div>
          </Reveal>
          <footer className="site-footer"><span>© 2025 Nirupam Dutta</span><span>built with intent / and a cup of coffee</span><a href="#top">back to origin ↑</a></footer>
        </section>
      </div>
    </main>
  );
}
