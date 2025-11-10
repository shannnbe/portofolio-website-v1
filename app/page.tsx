"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"

export default function Home() {
  const [isDark, setIsDark] = useState(true)
  const [activeSection, setActiveSection] = useState("")
  const [sheep, setSheep] = useState<{ id: number; x: number; y: number }[]>([])
  const [isGifPlaying, setIsGifPlaying] = useState(false)
  const sectionsRef = useRef<(HTMLElement | null)[]>([])
  const cursorRef = useRef<HTMLDivElement>(null)
  const sheepIdRef = useRef(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`
        cursorRef.current.style.top = `${e.clientY}px`
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up")
            setActiveSection(entry.target.id)
          } else {
            entry.target.classList.remove("animate-fade-in-up")
          }
        })
      },
      { threshold: 0.2, rootMargin: "0px 0px -15% 0px" },
    )

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const handleClick = (e: React.MouseEvent) => {
    const id = sheepIdRef.current++
    const newSheep = { id, x: e.clientX, y: e.clientY }
    setSheep((prev) => [...prev, newSheep])

    setTimeout(() => {
      setSheep((prev) => prev.filter((s) => s.id !== id))
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative" onClick={handleClick}>
      <button
        onClick={toggleTheme}
        className="fixed top-8 right-8 z-50 group p-4 rounded-lg border border-border hover:border-muted-foreground/50 transition-all duration-300 bg-background"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <svg
            className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414 0zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>

      <div ref={cursorRef} className="fixed pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-50">
        <img 
          src="/favicon.ico" 
          alt="cursor" 
          className="w-6 h-6 rotate-180"
        />
      </div>

      {sheep.map((s) => (
        <div
          key={s.id}
          className="fixed pointer-events-none z-40 animate-ping"
          style={{
            left: `${s.x}px`,
            top: `${s.y}px`,
            transform: 'translate(-50%, -50%)',
            animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) forwards'
          }}
        >
          <img 
            src="/favicon.ico" 
            alt="sheep" 
            className="w-8 h-8"
          />
        </div>
      ))}

      <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
        <div className="flex flex-col gap-4">
          {["intro", "achievements", "work", "portfolio", "thoughts", "connect"].map((section) => (
            <button
              key={section}
              onClick={() => document.getElementById(section)?.scrollIntoView({ behavior: "smooth" })}
              className={`w-2 h-8 rounded-full transition-all duration-500 ${
                activeSection === section ? "bg-foreground" : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
              aria-label={`Navigate to ${section}`}
            />
          ))}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-16">
        <header
          id="intro"
          ref={(el) => {
            sectionsRef.current[0] = el
          }}
          className="min-h-screen flex items-center opacity-0"
        >
          <div className="grid lg:grid-cols-5 gap-12 sm:gap-16 w-full">
            <div className="lg:col-span-3 space-y-6 sm:space-y-8">
              <div className="space-y-3 sm:space-y-2">
                <div className="text-sm text-muted-foreground font-mono tracking-wider">PORTFOLIO / 2025</div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight">
                  Gloria
                  <br />
                  <span className="text-muted-foreground">Shanti W.</span>
                </h1>
              </div>

              <div className="space-y-6 max-w-md">
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                  Backend Engineer who's obsessed with <span className="text-foreground">sheep</span>, codes with <span className="text-foreground">care</span>, learns with <span className="text-foreground">intent</span>, and ships with <span className="text-foreground">confidence... </span> (I hope :D)
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Available for work
                  </div>
                  |
                  <div>Indonesia - Remote APAC</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col justify-end space-y-6 sm:space-y-8 mt-8 lg:mt-0">
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground font-mono">CURRENTLY</div>
                <div className="space-y-2">
                  <div className="text-foreground">Software Engineer</div>
                  <div className="text-muted-foreground">@ Bank Sinarmas</div>
                  <div className="text-xs text-muted-foreground">2024 — Present</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-sm text-muted-foreground font-mono">TECH STACKS</div>
                <div className="flex flex-wrap gap-2">
                  {["Go", "PostgresSQL", "Git", "Redis", "Kafka", "Docker", "REST"].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 text-xs border border-border rounded-full hover:border-muted-foreground/50 transition-colors duration-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        <section
          id="achievements"
          ref={(el) => {
            sectionsRef.current[1] = el
          }}
          className="min-h-screen py-20 sm:py-32 flex items-center opacity-0"
        >
          <div className="w-full space-y-16">
            <div>
              <div className="text-sm text-muted-foreground font-mono tracking-wider mb-4">ACHIEVEMENTS</div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light">What I've Done</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {[
                { number: "1+", label: "Years Experience", description: "In professional working development" },
                { number: "2", label: "Enterprise Systems Shipped", description: "Production-ready applications" },
                { number: "150+", label: "PRs Merged", description: "Code contributions" },
                { number: "80+", label: "Features Built", description: "Across all projects" },
                { number: "50+", label: "Unit Tests Written", description: "Test coverage" },
                { number: "18+", label: "Technical Docs", description: "Documentation written" },
                { number: "∞", label: "Bugs Fixed", description: "Issues resolved" },
                { number: "∞", label: "Caffeine Intake", description: "Fuel for coding" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="group p-6 sm:p-8 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-500 hover:bg-muted/50"
                >
                  <div className="space-y-3">
                    <div className="text-4xl sm:text-5xl font-light text-foreground group-hover:text-muted-foreground transition-colors duration-300">
                      {stat.number}
                    </div>
                    <div className="text-sm sm:text-base font-medium text-foreground">{stat.label}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">{stat.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="work"
          ref={(el) => {
            sectionsRef.current[2] = el
          }}
          className="py-12 sm:py-16 opacity-0"
        >
          <div className="space-y-8 sm:space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h2 className="text-3xl sm:text-4xl font-light">Work Experiences</h2>
              <div className="text-sm text-muted-foreground font-mono">2024 — Present</div>
            </div>

            <div className="space-y-8 sm:space-y-12">
              {[
                {
                  year: "2025",
                  role: "Associate Software Engineer",
                  company: "PT Bank Sinarmas Tbk - BSD, Tangerang",
                  description: "Developing backend systems for Billpayment & Transactions division. Built 50+ features using Go, PostgreSQL, and Redis. Implemented distributed messaging with Kafka and worked with Docker, S3, and RESTful APIs. Key projects: Lucky Draw and Billpayment System.",
                  tech: ["Go", "PostgreSQL", "Redis", "Kafka", "Docker", "S3"],
                },
                {
                  year: "2024",
                  role: "Software Engineer Intern",
                  company: "PT Bank Sinarmas Tbk - BSD, Tangerang",
                  description: "Just like another internship, built a Content Management System using Next.js and Go for the backend, a fun way to learn and apply new skills in a real-world setting.",
                  tech: ["Go", "PostgreSQL", "Next.js", "Echo"]
                },
              ].map((job, index) => (
                <div
                  key={index}
                  className="group grid lg:grid-cols-12 gap-4 sm:gap-8 py-6 sm:py-8 border-b border-border/50 hover:border-border transition-colors duration-500"
                >
                  <div className="lg:col-span-2">
                    <div className="text-xl sm:text-2xl font-light text-muted-foreground group-hover:text-foreground transition-colors duration-500">
                      {job.year}
                    </div>
                  </div>

                  <div className="lg:col-span-7 space-y-3">
                    <div>
                      <h3 className="text-lg sm:text-xl font-medium">{job.role}</h3>
                      <div className="text-muted-foreground">{job.company}</div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed max-w-lg">{job.description}</p>
                  </div>

                  <div className="lg:col-span-3 flex flex-wrap gap-2 mt-2 lg:mt-0 items-start content-start justify-end">
                    {job.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs border border-border rounded-full text-muted-foreground group-hover:border-muted-foreground/50 transition-colors duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="portfolio"
          ref={(el) => {
            sectionsRef.current[3] = el
          }}
          className="py-12 sm:py-16 opacity-0"
        >
          <div className="space-y-8 sm:space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h2 className="text-3xl sm:text-4xl font-light">Featured Projects</h2>
              <div className="text-sm text-muted-foreground font-mono">2025 — Present</div>
            </div>

            <div className="space-y-12">
              {[
                {
                  title: "Nearby",
                  description:
                    "Real-time incidents reporting and monitoring platform with interactive map visualization and heatmap analysis using PostGIS for tracking and managing local incidents.",
                  image: "/nearby-project.png",
                  gif: "/nearby-project.gif",
                  tech: ["Go", "TypeScript", "Leaflet", "Next.js", "Docker", "PostGIS", "VPS"],
                  link: "https://nearby.gloriashanti.dev",
                },
              ].map((project, index) => (
                <div 
                  key={index} 
                  className="group space-y-6 border-b border-border/50 pb-12 hover:border-muted-foreground/50 transition-colors duration-500"
                  onMouseEnter={() => setIsGifPlaying(true)}
                  onMouseLeave={() => setIsGifPlaying(false)}
                >
                  <div className="grid lg:grid-cols-2 gap-8 items-start">
                    <div className="space-y-4">
                      <Link
                        href={project.link} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group/link"
                      >
                        <h3 className="text-2xl sm:text-3xl font-medium group-hover:text-muted-foreground transition-colors duration-300 inline-flex items-end gap-3">
                          <span>{project.title}</span>
                          <svg
                            className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </h3>
                      </Link>
                      <p className="text-muted-foreground leading-relaxed">{project.description}</p>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {project.tech.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 text-xs border border-border rounded-full text-muted-foreground group-hover:border-muted-foreground/50 transition-colors duration-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="relative w-full aspect-[16/10] bg-muted rounded-lg overflow-hidden">
                      <img
                        src={isGifPlaying ? project.gif : project.image || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="thoughts"
          ref={(el) => {
            sectionsRef.current[4] = el
          }}
          className="py-12 sm:py-16 opacity-0"
        >
          <div className="space-y-8 sm:space-y-12">
            <h2 className="text-3xl sm:text-4xl font-light">Recent Thoughts</h2>

            <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
              {[
                {
                  title: "The Future of Web Development",
                  excerpt: "Exploring how AI and automation are reshaping the way we build for the web.",
                  date: "Nov 2025",
                  readTime: "5 min",
                  url: "https://medium.com/@shannnbe",
                },
              ].map((post, index) => (
                <Link
                  key={index}
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <article className="p-6 sm:p-8 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-500 hover:shadow-lg cursor-pointer h-full">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                        <span>{post.date}</span>
                        <span>{post.readTime}</span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-medium group-hover:text-muted-foreground transition-colors duration-300">
                        {post.title}
                      </h3>

                      <p className="text-muted-foreground leading-relaxed">{post.excerpt}</p>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                        <span>Read more</span>
                        <svg
                          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            <div className="flex justify-center mt-8 sm:mt-12">
              <Link 
                href="https://medium.com/@shannnbe"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                <span>See more</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        <section
          id="connect"
          ref={(el) => {
            sectionsRef.current[5] = el
          }}
          className="py-20 sm:py-32 opacity-0"
        >
          <div className="grid lg:grid-cols-2 gap-12 sm:gap-16">
            <div className="space-y-6 sm:space-y-8">
              <h2 className="text-3xl sm:text-4xl font-light">Let's Connect</h2>

              <div className="space-y-6">
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                  Always interested in new opportunities and collaborations, hit me up!
                </p>

                <div className="space-y-4">
                  <Link
                    href="mailto:contactme.gloriashanti@gmail.com"
                    className="group flex items-center gap-3 text-foreground hover:text-muted-foreground transition-colors duration-300"
                  >
                    <span className="text-base sm:text-lg">contactme.gloriashanti@gmail.com</span>
                    <svg
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div className="text-sm text-muted-foreground font-mono">ELSEWHERE</div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "GitHub", handle: "@shannnbe", url: "https://github.com/shannnbe" },
                  { name: "X", handle: "@gloriashanti", url: "https://x.com/gloriashanti" },
                  { name: "LinkedIn", handle: "gloria-shanti", url: "https://www.linkedin.com/in/gloria-shanti/" },
                  { name: "Medium", handle: "shannnbe", url: "https://medium.com/@shannnbe" },
                ].map((social) => (
                  <Link
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-4 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-300 hover:shadow-sm"
                  >
                    <div className="space-y-2">
                      <div className="text-foreground group-hover:text-muted-foreground transition-colors duration-300">
                        {social.name}
                      </div>
                      <div className="text-sm text-muted-foreground">{social.handle}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer className="py-12 sm:py-16 border-t border-border">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-8">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">© 2025 Gloria Shanti. All rights reserved.</div>
              <div className="text-xs text-muted-foreground">
                Using Felix Macaspac's Minimalist Portfolio Design (v0.dev) for personal portfolio only.
              </div>
            </div>
          </div>
        </footer>
      </main>

      <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none"></div>
    </div>
  )
}
