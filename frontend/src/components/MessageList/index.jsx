import { Component } from "react";
import styles from "./MessageList.module.css"

export default class Main extends Component {
    state = {
        chats: [ // just for debug
            { name: 'Edmund Stamm' },
            { name: 'Floyd Brown' },
            { name: 'Jake Considine' },
            { name: 'Keith Klein' },
            { name: 'Hugo Kohler' },
            { name: 'Kurt Hartmann' },
            { name: 'Lori Hyatt' },
            { name: 'Jose Reilly' },
            { name: 'Pearl Muller' },
            { name: 'Josefina Howell' },
            { name: 'Lawrence Schoen' },
            { name: 'Charlene Jacobson' },
            { name: 'Mr.Alton' },
            { name: 'Madeline Gleichner' },
            { name: 'Delia Batz' },
            { name: 'Jan Bradtke' },
            { name: 'Terry Schmitt' },
            { name: 'Kerry Bednar' },
            { name: "joao" },
            { name: "maria" }
        ]
    }
    render = () => {
        const { chats } = this.state
        return (
            <div className={styles.MessageList}>
                <h2 style={{ padding: '1em' }}>Chats</h2>
                <section>
                    {chats.map((chat, index) => (
                        <div key={index} className={styles.ChatCahed}>{
                            chat.name}
                        </div>
                    ))}
                </section>
            </div>
        )
    }
}
