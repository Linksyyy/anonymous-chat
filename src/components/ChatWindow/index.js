import MessageInput from '../MessageInput/index';

export default function ChatWindow() {
    return (
        <div className="ChatWindow">
            <div className="messages">
                <p>Bem-vindo ao chat anónimo!</p>
            </div>
            <MessageInput />
        </div>
    )
}