import { Component } from "react";
import styles from "./MessageList.module.css"

export default class Main extends Component {
    state = {
        chats: [{ name: "joao" }, { name: "maria" }]
    }
    render = () => {
        const { chats } = this.state
        return (
            <div className={styles.MessageList}>
                <h2>Chats</h2>
                <section>
                    {chats.map((chat, index) => (
                        <div key={index}>{chat.name}</div>
                    ))}
                </section>
            </div>
        )
    }
}
