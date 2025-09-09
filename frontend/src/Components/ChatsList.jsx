import { Component } from "react";

export default class ChatsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chats: this.props.chats || [],
    };
  }
  MessageList;

  render() {
    const { chats } = this.state;
    return (
      <aside className="bg-primary border-r-1 border-secondary gap-2 flex h-full absolute w-64 flex-col">
        {chats.map((chat) => (
          <div className="bg-secondary hover:bg-tertiary p-2 mx-4 mt-2 rounded-2xl">
            {chat.name}
          </div>
        ))}
      </aside>
    );
  }
}
