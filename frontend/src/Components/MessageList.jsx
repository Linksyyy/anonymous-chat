import { Component } from "react";

export default class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: this.props.messages,
    };
  }

  render() {
    return (
      <aside className="bg-primary border-r-1 border-secondary flex gap-2 items-center h-full absolute w-64 flex-col">
        <div className="w-50 h-20 bg-red-900"></div>
        <div className="w-50 h-20 bg-red-900"></div>
        <div className="w-50 h-20 bg-red-900"></div>
      </aside>
    );
  }
}
