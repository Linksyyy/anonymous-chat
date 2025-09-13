import ChatWindow from "../../Components/ChatWindow";

export default function loungePage() {
  return (
    <ChatWindow
      messages={[
        { text: "teste", sendedByMe: true },
        { text: "teste", sendedByMe: true },
        { text: "teste", sendedByMe: true },
        { text: "teste", sendedByMe: false },
        { text: "teste", sendedByMe: true },
        { text: "teste", sendedByMe: false },
        { text: "teste", sendedByMe: false },
        { text: "teste", sendedByMe: false },
        { text: "teste", sendedByMe: true },
        { text: "teste", sendedByMe: true },
      ]}
    />
  );
}
