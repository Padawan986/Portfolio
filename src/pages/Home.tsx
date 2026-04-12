import { Mail, Github, Linkedin, Code2, Zap, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * FROSTED ELEGANCE LIQUID GLASS DESIGN
 * 
 * Design Philosophy: Minimalist Premium Glasmorphism
 * - Transparent glass panels with blur effects
 * - Dark blue background (#0a1628) with ice blue accents (#00d4ff)
 * - Poppins for headlines, Inter for body text
 * - Smooth animations and subtle interactions
 */

interface SkillItem {
  name: string;
  percentage: number;
}

const skills: SkillItem[] = [
  { name: "Python", percentage: 80 },
  { name: "HTML", percentage: 90 },
  { name: "CSS", percentage: 85 },
  { name: "JavaScript", percentage: 80 },
  { name: "TypeScript", percentage: 50 },
];

export default function Home() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections((prev) => new Set(prev).add(entry.target.id));
        }
      });
    });

    document.querySelectorAll("[data-fade]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/50 border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
            Padawan985
          </div>
          <nav className="hidden md:flex gap-8">
            <a
              href="#about"
              onClick={(e) => handleSmoothScroll(e, "about")}
              className="text-foreground hover:text-accent transition-colors duration-300"
            >
              Über mich
            </a>
            <a
              href="#skills"
              onClick={(e) => handleSmoothScroll(e, "skills")}
              className="text-foreground hover:text-accent transition-colors duration-300"
            >
              Skills
            </a>
            <a
              href="#contact"
              onClick={(e) => handleSmoothScroll(e, "contact")}
              className="text-foreground hover:text-accent transition-colors duration-300"
            >
              Kontakt
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div
              data-fade
              className={`transition-all duration-700 ${
                visibleSections.has("hero")
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              id="hero"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Hi, ich bin{" "}
                <span className="bg-gradient-to-r from-accent to-cyan-400 bg-clip-text text-transparent">
                  Padawan985
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Ich entwickle moderne Web-Apps und beschäftige mich mit
                zeitgemäßer Softwareentwicklung. Mein Fokus liegt auf sauberen
                Lösungen und solider Technik.
              </p>
              <div className="flex gap-4">
                <a
                  href="#contact"
                  onClick={(e) => handleSmoothScroll(e, "contact")}
                  className="glass-button inline-block"
                >
                  Kontakt aufnehmen
                </a>
                <a
                  href="https://github.com/Padawan986"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-lg font-medium transition-all duration-300 border border-accent text-accent hover:bg-accent/10"
                >
                  GitHub
                </a>
              </div>
            </div>

            {/* Right Glass Panel */}
            <div
              data-fade
              className={`transition-all duration-700 delay-200 ${
                visibleSections.has("hero")
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95"
              }`}
            >
              <div className="glass-panel p-8 md:p-12 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent rounded-3xl pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-6">
                    <Code2 className="w-16 h-16 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold text-center mb-4">
                    Full-Stack Developer
                  </h3>
                  <p className="text-center text-muted-foreground">
                    Spezialisiert auf moderne Web-Technologien und
                    Softwareentwicklung
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        data-fade
        className={`section transition-all duration-700 ${
          visibleSections.has("about")
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto px-4">
          <h2 className="section-title mb-12">Über mich</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Code2,
                title: "Webentwicklung",
                description:
                  "Ich programmiere hauptsächlich im Webbereich und arbeite gerne an eigenen Projekten.",
              },
              {
                icon: Zap,
                title: "Moderne Technologien",
                description:
                  "Mein Fokus liegt auf sauberen Lösungen, verständlichem Code und solider Technik.",
              },
              {
                icon: Sparkles,
                title: "Kontinuierliches Lernen",
                description:
                  "Aktuell erweitere ich mein Wissen in TypeScript und modernen Frontend-Tools.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="glass-panel p-8 hover:scale-105 transition-transform duration-300"
              >
                <item.icon className="w-12 h-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section
        id="skills"
        data-fade
        className={`section transition-all duration-700 ${
          visibleSections.has("skills")
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="section-title mb-12">Skills</h2>
          <div className="space-y-8">
            {skills.map((skill, idx) => (
              <div key={idx} className="glass-panel p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-lg">{skill.name}</span>
                  <span className="text-accent font-bold">{skill.percentage}%</span>
                </div>
                <div className="skill-bar">
                  <div
                    className="skill-bar-fill"
                    style={{
                      width: visibleSections.has("skills")
                        ? `${skill.percentage}%`
                        : "0%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        data-fade
        className={`section transition-all duration-700 ${
          visibleSections.has("contact")
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="section-title mb-12">Kontakt</h2>
          <div className="glass-panel p-12 text-center">
            <p className="text-lg mb-8 text-muted-foreground">
              Ich freue mich auf deine Nachricht. Schreib mir eine E-Mail oder
              verbinde dich mit mir auf sozialen Plattformen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:padawan985.dev@gmail.com"
                className="glass-button inline-flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                E-Mail
              </a>
              <a
                href="https://github.com/Padawan986"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg font-medium transition-all duration-300 border border-accent text-accent hover:bg-accent/10 inline-flex items-center justify-center gap-2"
              >
                <Github className="w-5 h-5" />
                GitHub
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg font-medium transition-all duration-300 border border-accent text-accent hover:bg-accent/10 inline-flex items-center justify-center gap-2"
              >
                <Linkedin className="w-5 h-5" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 mt-20">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2026 Padawan985. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  );
}
