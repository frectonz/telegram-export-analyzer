import { useLocation, Link } from "react-router-dom";
import { formatNumber } from "../../helpers/helpers";

export default function MembersList({
  title,
  members,
  totalMessages,
}: {
  title: string;
  totalMessages: number;
  members: { name: string; messages: number }[];
}) {
  const { pathname } = useLocation();
  const visibility = pathname !== "/analytics" ? "hidden" : "";

  return (
    <div className="card bg-base-100 shadow-xl my-5 p-4 ">
      <div className="card-body flex flex-row justify-between">
        <h2 className="card-title">{title}</h2>
        <Link
          to="members"
          title="See all members"
          className={`btn btn-secondary btn-ghost ${visibility}`}
        >
          <svg
            fill="none"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            className="inline-block w-10 stroke-current fill-current"
          >
            <path d="M1.729,9.212h14.656l-4.184-4.184c-0.307-0.306-0.307-0.801,0-1.107c0.305-0.306,0.801-0.306,1.106,0l5.481,5.482c0.018,0.014,0.037,0.019,0.053,0.034c0.181,0.181,0.242,0.425,0.209,0.66c-0.004,0.038-0.012,0.071-0.021,0.109c-0.028,0.098-0.075,0.188-0.143,0.271c-0.021,0.026-0.021,0.061-0.045,0.085c-0.015,0.016-0.034,0.02-0.051,0.033l-5.483,5.483c-0.306,0.307-0.802,0.307-1.106,0c-0.307-0.305-0.307-0.801,0-1.105l4.184-4.185H1.729c-0.436,0-0.788-0.353-0.788-0.788S1.293,9.212,1.729,9.212z" />
          </svg>
        </Link>
      </div>

      <div className="card-body grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {members.map((member, idx) => (
          <div className="card bg-base-100 shadow-xl" key={idx}>
            <div className="card-body">
              <h2 className="card-title">
                <strong className="badge badge-secondary">{idx + 1}</strong>
                {member.name}
              </h2>
              <p>
                <b>{formatNumber(member.messages)}</b> messages
              </p>
              <progress
                className="progress progress-primary w-56"
                value={member.messages}
                max={totalMessages}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
