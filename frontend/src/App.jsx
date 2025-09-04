import MessageList from "./Components/MessageList";
import ChatWindow from "./Components/ChatWindow";
import { Component } from "react";

export default class App extends Component {
  render() {
    return (
      <>
        <MessageList />
        <ChatWindow />
      </>
    );
  }
}
