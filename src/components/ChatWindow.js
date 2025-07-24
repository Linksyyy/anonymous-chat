import MessageInput from './MessageInput';

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