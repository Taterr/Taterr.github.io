import { profile, projects } from './data.js';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header container">
        <a className="wordmark" href="#" aria-label={`${profile.name}, home`}>{profile.initials}<span>.</span></a>
        <nav aria-label="Main navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact <span aria-hidden="true">↗</span></a>
        </nav>
      </header>
      <main id="main" className="container">
        <section className="hero" aria-labelledby="intro-title">
          <p className="eyebrow">{profile.name} / {profile.role}</p>
          <h1 id="intro-title">{profile.headline}</h1>
          <p className="intro">{profile.intro}</p>
          <a className="button" href="#work">Explore my work <span aria-hidden="true">↘</span></a>
        </section>
        <section id="work" className="section" aria-labelledby="work-title">
          <div className="section-heading">
            <h2 id="work-title">Selected work</h2>
            <span className="muted">A few things to explore</span>
          </div>
          <div className="projects">
            {projects.map((project, index) => (
              <article className="project" key={project.title}>
                <div className={`project-art art-${index % 3}`} aria-hidden="true">
                  <span className="project-number">{String(index + 1).padStart(2, '0')}</span>
                  <div className="art-shape" />
                </div>
                <p className="eyebrow project-category">{project.category}</p>
                <h3>{project.url ? <a href={project.url}>{project.title} <span aria-hidden="true">↗</span></a> : project.title}</h3>
                <p className="project-description">{project.description}</p>
                <ul className="tags" aria-label="Technologies">
                  {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>
        <section id="about" className="section about" aria-labelledby="about-title">
          <h2 id="about-title">A little about me</h2>
          <div>
            <p className="about-copy">{profile.about}</p>
            <ul className="tags skills" aria-label="Skills">
              {profile.skills.map((skill) => <li key={skill}>{skill}</li>)}
            </ul>
          </div>
        </section>
        <section id="contact" className="section contact" aria-labelledby="contact-title">
          <p className="eyebrow">Have something in mind?</p>
          <h2 id="contact-title">Let’s make it happen.</h2>
          <a className="contact-link" href={`mailto:${profile.email}`}>{profile.email} <span aria-hidden="true">↗</span></a>
        </section>
      </main>
      <footer className="container site-footer">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <a href={profile.github}>GitHub <span aria-hidden="true">↗</span></a>
        <a href="#">Back to top ↑</a>
      </footer>
    </>
  );
}
