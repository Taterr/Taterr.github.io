import { useEffect, useRef, useState } from "react";
import Starfield from "./Starfield.jsx";
import { profile, experience, projects } from "./data.js";

const companies = [
  { name: "ST Engineering", logo: "/logos/st-engineering.png" },
  { name: "DBS Bank", logo: "/logos/dbs.svg" },
  { name: "OCBC Bank", logo: "/logos/ocbc.png" },
];

const Arrow = () => <span aria-hidden="true">↗</span>;
function VideoWindow({ project }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className={`video-window ${project.color}`}>
      <div className="window-bar">
        <span className="window-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>{project.title.toLowerCase().replaceAll(" ", "-")}.play</span>
        <span aria-hidden="true">↗</span>
      </div>
      <div className="video-stage">
        {playing ? (
          <iframe
            title={`${project.title} video`}
            src={`https://www.youtube-nocookie.com/embed/${project.video}?autoplay=1&start=${project.start || 0}`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button
            className="video-cover"
            onClick={() => setPlaying(true)}
            aria-label={`Play ${project.title} video`}
          >
            <img
              src={`https://i.ytimg.com/vi/${project.video}/hqdefault.jpg`}
              alt=""
              loading="lazy"
            />
            <span className="video-shade" />
            <span className="play-button" aria-hidden="true">
              ▶
            </span>
            <span className="cover-label">
              Watch project film
              <span>PLAY ↗</span>
            </span>
          </button>
        )}
      </div>
      <div className="window-bottom">
        <span>{project.tags.slice(0, 2).join(" / ")}</span>
        <a
          href={`https://www.youtube.com/watch?v=${project.video}${project.start ? `&t=${project.start}s` : ""}`}
          target="_blank"
          rel="noreferrer"
        >
          YouTube <Arrow />
        </a>
      </div>
    </div>
  );
}
function Tags({ items }) {
  return (
    <ul className="tags">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
function SectionHeading({ number, label, title, children }) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">
          <span>{number} /</span> {label}
        </p>
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}
function CompanyModal({ company, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  function closeOnBackdrop(event) {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    ) {
      event.currentTarget.close();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="company-modal"
      aria-labelledby="company-modal-title"
      onClose={onClose}
      onClick={closeOnBackdrop}
    >
      <div className="modal-header">
        <div>
          <p className="eyebrow">WORKING EXPERIENCE</p>
          <h2 id="company-modal-title">{company.name}</h2>
        </div>
        <button
          type="button"
          className="modal-close"
          aria-label="Close company details"
          onClick={() => dialogRef.current.close()}
        >
          ×
        </button>
      </div>
      <div className="company-contributions">
        {experience
          .filter((job) => job.company === company.name)
          .map((job) => (
            <article className="company-role" key={job.role}>
              <div className="role-heading">
                <h3>{job.role}</h3>
                <p className="role-date">{job.date}</p>
              </div>
              <div className="job-content">
                <p>{job.description}</p>
                {job.details.length > 0 && (
                  <ul className="job-details">
                    {job.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                )}
                <Tags items={job.tags} />
              </div>
            </article>
          ))}
      </div>
    </dialog>
  );
}

function ScrollCue() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (window.scrollY > 0) {
      setVisible(false);
      return;
    }
    const dismiss = () => {
      setVisible(false);
      window.removeEventListener("scroll", dismiss);
      window.clearTimeout(timer);
    };
    const timer = window.setTimeout(dismiss, 5000);
    window.addEventListener("scroll", dismiss, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", dismiss);
    };
  }, []);

  return (
    <a
      className={`scroll-cue${visible ? "" : " is-dismissed"}`}
      href="#experience"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <span>Scroll to explore</span>
      <span className="scroll-cue-arrow" aria-hidden="true">
        ↓
      </span>
    </a>
  );
}

export default function App() {
  const [activeCompany, setActiveCompany] = useState(null);
  const [filter, setFilter] = useState("All work");
  const visibleProjects = projects.filter(
    (p) => filter === "All work" || p.type === filter,
  );
  return (
    <>
      <Starfield />
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      {activeCompany && (
        <CompanyModal
          company={activeCompany}
          onClose={() => setActiveCompany(null)}
        />
      )}
      <main id="main">
        <section
          id="introduction"
          className="profile-intro container"
          aria-labelledby="intro-title"
        >
          <p className="intro-greeting">Hello, I’m</p>
          <h1 id="intro-title">
            Richmond Choo<span className="intro-period">.</span>
          </h1>
          <p className="intro-role">
            Software engineer <span aria-hidden="true">·</span> Singapore
          </p>
          <ScrollCue />
        </section>
        <section
          id="experience"
          className="section container"
          aria-labelledby="experience-title"
        >
          <SectionHeading
            number="01"
            label="WORKING EXPERIENCE"
            title={<span id="experience-title">Built in the real world.</span>}
          >
            <p className="section-aside">
              Step by Step,
              <br />A little better after every iteration
            </p>
          </SectionHeading>
          <div className="company-logos" aria-label="Companies I’ve worked at">
            {companies.map((company) => (
              <button
                type="button"
                className="company-logo-button"
                key={company.name}
                aria-label={`View my contributions at ${company.name}`}
                aria-haspopup="dialog"
                onClick={() => setActiveCompany(company)}
              >
                <img src={company.logo} alt={company.name} />
              </button>
            ))}
          </div>
        </section>
        <section
          id="projects"
          className="projects-section"
          aria-labelledby="projects-title"
        >
          <div className="container">
            <SectionHeading
              number="02"
              label="PROJECTS & EXPERIMENTS"
              title={
                <span id="projects-title">
                  Serious code.
                  <br />
                  <em>Playful possibilities.</em>
                </span>
              }
            >
              <p className="section-aside">
                Custom engines, virtual worlds, useful apps.
                <br />
                Press play and take a look around.
              </p>
            </SectionHeading>
            <div className="project-toolbar">
              <div
                className="filters"
                role="group"
                aria-label="Filter projects"
              >
                {["All work", "Games & engines", "Applications"].map((f) => (
                  <button
                    key={f}
                    aria-pressed={filter === f}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <span className="project-count" aria-live="polite">
                {String(visibleProjects.length).padStart(2, "0")} projects
              </span>
            </div>
            <div className="projects-grid">
              {visibleProjects.map((project) => (
                <article className="project" key={project.title}>
                  {project.video ? (
                    <VideoWindow project={project} />
                  ) : (
                    <div className={`no-video ${project.color}`}>
                      <div className="campus-art" aria-hidden="true">
                        <span>S</span>
                        <div>
                          <i />
                          <i />
                          <i />
                        </div>
                      </div>
                      <span>CAMPUS, CONNECTED.</span>
                    </div>
                  )}
                  <div className="project-meta">
                    <span>{project.role}</span>
                    <span>{project.year}</span>
                  </div>
                  <h3>
                    {project.title}
                    <span aria-hidden="true">↗</span>
                  </h3>
                  <p className="project-subtitle">{project.subtitle}</p>
                  <p className="project-description">{project.description}</p>
                  <Tags items={project.tags} />
                </article>
              ))}
            </div>
          </div>
        </section>
        <section
          id="education"
          className="section education container"
          aria-labelledby="education-title"
        >
          <SectionHeading
            number="03"
            label="EDUCATION"
            title={<span id="education-title">Always a student.</span>}
          >
            <p className="section-aside">
              A foundation in engineering.
              <br />A curiosity that keeps going.
            </p>
          </SectionHeading>
          <div className="education-grid">
            <article>
              <p className="eyebrow">2021 — 2025</p>
              <h3>
                Singapore Institute of Technology
                <br />& DigiPen Institute of Technology
              </h3>
              <p className="degree">BSc (Hons) in Computer Science (RTIS)</p>
              <span className="honors">↗ Honors with Distinction</span>
              <ul>
                <li>Joint degree with DigiPen Institute of Technology</li>
                <li>
                  Vice President of Academics: Computer Science, AY 2024–25
                </li>
                <li>Alumni Mentorship Program</li>
              </ul>
            </article>
            <article>
              <p className="eyebrow">2017 — 2019</p>
              <h3>Ngee Ann Polytechnic</h3>
              <p className="degree">Diploma in Biomedical Engineering</p>
              <span className="honors">
                ↗ Diploma Plus in Biomedical Engineering
              </span>
              <p className="education-note">
                Where my engineering journey began — connecting technical
                thinking with real-world problems.
              </p>
            </article>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="container">
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Richmond Choo</span>
            <div>
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn <Arrow />
              </a>
              <a className="footer-contact" href={`mailto:${profile.email}`}>
                {profile.email} <Arrow />
              </a>
              <a href="#introduction">Back to top ↑</a>
            </div>
            <span>Made with curiosity.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
