import "./bubble.css";

interface Props {
  message: string;
  sender: string;
  isSender?: boolean;
}

const Bubble = ({ message, sender, isSender }: Props) => {
  return (
    <div className="bubble-container">
      <p className={`bubble-sender ${isSender ? "sender" : ""}`}>{sender}</p>
      <div className={`bubble ${isSender ? "sender" : ""}`}>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Bubble;
