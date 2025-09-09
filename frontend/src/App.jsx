import ChatsList from "./Components/ChatsList";
import ChatWindow from "./Components/ChatWindow";
import { Component } from "react";

export default class App extends Component {
  render() {
    return (
      <>
        <ChatsList chats={[{ name: "Adriel" }, { name: "Maria Luiza" }]} />
        <ChatWindow />
      </>
    );
  }
}
