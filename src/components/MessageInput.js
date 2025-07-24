import { useState } from 'react';

export default function MessageInput() {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(message);
        setMessage('');
    }

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="Escreva a sua mensagem..."
            />
            <button type="submit">Enviar</button>
        </form>
    )
}