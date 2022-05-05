import { useParams } from "react-router-dom";
import { Content, NormalMessage } from "../../store";

export default function Messages({ content }: { content: Content }) {
  const params = useParams();

  const messages = (
    content.messages.filter((message) => {
      if (message.type === "message") {
        if (message.from_id === params.userID) {
          return true;
        }
      }

      return false;
    }) as NormalMessage[]
  )
    .map((message) => {
      if (message.text === "") {
        message.text = "(File not included.)";
      }
      return message;
    })
    .map((message) => {
      if (Array.isArray(message.text)) {
        message.text = message.text
          .map((text) => {
            if (typeof text === "object") {
              return text.text;
            }

            return text;
          })
          .join("");
      }

      return message;
    });

  const name =
    (messages.length !== 0 && messages[0].from) ||
    messages[0].from_id ||
    "Unknown";

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h1 className="my-2 card-title text-2xl">
          Messages from <span className="text-secondary">{name}</span>
        </h1>
        <ul>
          {messages.map((message) => (
            <li
              className="bg-base-300 px-2 py-4 my-2 w-fit rounded-2xl rounded-bl-none"
              key={message.id}
            >
              {message.forwarded_from && (
                <span className="badge badge-primary badge-lg block mb-2">
                  {`Forwarded from ${message.forwarded_from}`}
                </span>
              )}
              {message.text.toString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
