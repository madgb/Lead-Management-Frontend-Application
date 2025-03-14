"use client";

import { useRouter } from "next/navigation";
import styles from "./thank-you.module.css";

export default function ThankYouPage() {
    const router = useRouter();

    return (
        <div className={styles.container}>
            <h1>Thank You</h1>
            <p>
                Your information was submitted to our team of immigration attorneys.
                Expect an email from <b>hello@tryalma.ai</b>.
            </p>
            <button className={styles.button} onClick={() => router.push("/")}>
                Go Back to Homepage
            </button>
        </div>
    );
}
