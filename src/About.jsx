// src/pages/About.jsx
import "./About.css";

export default function About() {
  return (
    <div className="AboutPage">
      <h2>About This App</h2>
      <p>
        This Todo application helps you stay organized by keeping track of your daily tasks.
        You can add, edit, complete, and filter todos, all while syncing data with Airtable.
      </p>

      <p>
        The app demonstrates practical use of React Hooks, reducers, and routing with React Router.
        It includes pagination, optimistic updates, and a clean modular design.
      </p>

      <h3>About the Author</h3>
      <p>
        Created by <strong>Kenneth Ward Jr.</strong> — a Social Media and Digital Content Specialist
        at GLIDE, and a web developer passionate about creating meaningful tools that connect
        technology and community.
      </p>

      <p>
        Built using <em>React</em>, <em>Vite</em>, and <em>Airtable API</em>.
      </p>
    </div>
  );
}
