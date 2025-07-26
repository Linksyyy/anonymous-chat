import MessageInput from '../MessageInput/index';
import styles from './ChatWindow.module.css'

export default function ChatWindow() {
    return (
        <div className= {styles.ChatWindow}>
            <div className={styles.messages}>
                <p>Bem-vindo ao chat anónimo!</p>
            </div>
            <MessageInput />
        </div>
    )
}