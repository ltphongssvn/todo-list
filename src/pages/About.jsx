// src/pages/About.jsx - About page with application information
import styles from './About.module.css';

function About() {
    return (
        <div className={styles.aboutContainer}>
            <section className={styles.aboutSection}>
                <h2>About Todo List App</h2>
                <p>
                    Welcome to the Todo List application, a modern task management tool built
                    with React and powered by Airtable. This application demonstrates advanced
                    React patterns and best practices developed through the Code the Dream curriculum.
                </p>

                <h3>Features</h3>
                <p>
                    Our todo application offers a comprehensive set of features designed to make
                    task management simple and efficient. You can create, edit, complete, and delete
                    todos with real-time synchronization to Airtable. The application includes
                    filtering options to view all, active, or completed tasks, as well as sorting
                    capabilities to organize your todos by date or title. With built-in pagination,
                    you can manage large lists of tasks without overwhelming the interface.
                </p>

                <h3>Technology Stack</h3>
                <p>
                    This application showcases modern web development technologies and patterns.
                    Built with React 18, it utilizes React Router for seamless navigation,
                    implements the useReducer hook for sophisticated state management, and features
                    styled-components and CSS modules for component-based styling. The backend
                    integration with Airtable provides persistent data storage, while optimistic
                    and pessimistic UI patterns ensure a responsive user experience.
                </p>

                <h3>About the Developer</h3>
                <p>
                    This application was developed as part of the Code the Dream React curriculum,
                    representing weeks of learning and implementing increasingly complex React patterns.
                    Each week built upon the previous one, starting from basic components and
                    progressing through state management, API integration, performance optimization,
                    styling systems, and finally routing and pagination.
                </p>

                <h3>Learning Journey</h3>
                <p>
                    The development of this application represents a comprehensive journey through
                    React development, from understanding JSX and components, through mastering
                    hooks and state management, to implementing professional patterns like reducer-based
                    state and URL-driven pagination. This project demonstrates not just technical
                    skills, but also an understanding of user experience, code organization, and
                    software architecture principles.
                </p>
            </section>
        </div>
    );
}

export default About;