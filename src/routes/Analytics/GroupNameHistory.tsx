export default function GroupNameHistory({
  history,
}: {
  history: {
    actor: string;
    date: string;
    title: string;
  }[];
}) {
  return (
    <div className="card bg-base-100 shadow-xl my-5 p-4">
      <div className="card-body">
        <h2 className="card-title">Group Name History</h2>
      </div>
      <div className="card-body">
        <ul className="steps steps-vertical">
          {history.map((history, i) => (
            <li key={i} className="step step-primary">
              <p>
                <strong>{history.actor}</strong> changed it to{" "}
                <strong className="text-secondary">{history.title}</strong> on{" "}
                <strong className="text-accent">
                  {new Date(history.date).toDateString()}
                </strong>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
