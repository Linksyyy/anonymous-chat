import MessageInput from '../MessageInput/index';
import styles from './ChatWindow.module.css'

export default function ChatWindow() {
    return (
        <div className={styles.ChatWindow}>
            <div className={styles.messages}>
                <p className={styles.me}>
                    teste teste
                    teste teste
                    teste teste
                    teste teste <br></br>
                    teste teste
                    teste teste
                    teste teste

                </p>
                <p className={styles.other}>oi</p>
            </div>
            <MessageInput />
        </div>
    )
}