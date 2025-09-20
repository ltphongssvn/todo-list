// src/pages/NotFound.jsx - 404 page for unmatched routes
import { Link } from 'react-router';
import styles from './NotFound.module.css';

function NotFound() {
    return (
        <div className={styles.notFoundContainer}>
            <div className={styles.notFoundContent}>
                <h2 className={styles.errorCode}>404</h2>
                <h3 className={styles.errorTitle}>Page Not Found</h3>
                <p className={styles.errorMessage}>
                    Sorry, the page you're looking for doesn't exist.
                    It might have been moved, deleted, or you may have typed the URL incorrectly.
                </p>
                <Link to="/" className={styles.homeLink}>
                    Return to Home
                </Link>
            </div>
        </div>
    );
}

export default NotFound;