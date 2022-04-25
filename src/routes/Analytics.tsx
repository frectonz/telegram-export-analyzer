import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Content,
  useStore,
  countMessages,
  getForwardedMessages,
  getMembersWithMessages,
  shouldNavigateToHomePage,
} from "../store";
import { formatNumber } from "../helpers/helpers";

export default function Analytics() {
  const store = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (shouldNavigateToHomePage(store)) {
      navigate("/");
    }
  }, [store]);

  return store.match({
    None() {
      return <></>;
    },
    Some(value) {
      return value.match({
        Ok(store) {
          return <AnalyticsDisplay content={store} />;
        },
        Err() {
          return <></>;
        },
      });
    },
  });
}

function AnalyticsDisplay({ content }: { content: Content }) {
  const totalMessages = countMessages(content);
  const members = getMembersWithMessages(content);
  const forwardedMessages = getForwardedMessages(content);

  return (
    <main className="container mx-auto p-2">
      <section className="my-8 mx-4">
        <div className="badge badge-secondary uppercase">
          {content.type.replace("_", " ")}
        </div>
        <h1 className="text-4xl font-bold">
          Analysis results for <b className="text-primary">{content.name}</b>{" "}
        </h1>
      </section>
      <section className="py-8">
        <StatBoxes
          totalMembers={members.length}
          totalMessages={totalMessages}
          totalForwardedMessages={forwardedMessages.length}
        />
        <MembersList members={members} totalMessages={totalMessages} />
      </section>
    </main>
  );
}

function StatBoxes({
  totalMembers,
  totalMessages,
  totalForwardedMessages,
}: {
  totalMembers: number;
  totalMessages: number;
  totalForwardedMessages: number;
}) {
  const stats = [
    {
      title: "Total Members",
      value: totalMembers,
      description: "Total number of members who have sent messages.",
      className: "text-primary",
      icon: (
        <path d="M12.075,10.812c1.358-0.853,2.242-2.507,2.242-4.037c0-2.181-1.795-4.618-4.198-4.618S5.921,4.594,5.921,6.775c0,1.53,0.884,3.185,2.242,4.037c-3.222,0.865-5.6,3.807-5.6,7.298c0,0.23,0.189,0.42,0.42,0.42h14.273c0.23,0,0.42-0.189,0.42-0.42C17.676,14.619,15.297,11.677,12.075,10.812 M6.761,6.775c0-2.162,1.773-3.778,3.358-3.778s3.359,1.616,3.359,3.778c0,2.162-1.774,3.778-3.359,3.778S6.761,8.937,6.761,6.775 M3.415,17.69c0.218-3.51,3.142-6.297,6.704-6.297c3.562,0,6.486,2.787,6.705,6.297H3.415z" />
      ),
    },
    {
      title: "Total Messages",
      value: totalMessages,
      description: "Total messages sent in the group.",
      className: "text-secondary",
      icon: (
        <path d="M17.659,3.681H8.468c-0.211,0-0.383,0.172-0.383,0.383v2.681H2.341c-0.21,0-0.383,0.172-0.383,0.383v6.126c0,0.211,0.172,0.383,0.383,0.383h1.532v2.298c0,0.566,0.554,0.368,0.653,0.27l2.569-2.567h4.437c0.21,0,0.383-0.172,0.383-0.383v-2.681h1.013l2.546,2.567c0.242,0.249,0.652,0.065,0.652-0.27v-2.298h1.533c0.211,0,0.383-0.172,0.383-0.382V4.063C18.042,3.853,17.87,3.681,17.659,3.681 M11.148,12.87H6.937c-0.102,0-0.199,0.04-0.27,0.113l-2.028,2.025v-1.756c0-0.211-0.172-0.383-0.383-0.383H2.724V7.51h5.361v2.68c0,0.21,0.172,0.382,0.383,0.382h2.68V12.87z M17.276,9.807h-1.533c-0.211,0-0.383,0.172-0.383,0.383v1.755L13.356,9.92c-0.07-0.073-0.169-0.113-0.27-0.113H8.851v-5.36h8.425V9.807z" />
      ),
    },
    {
      title: "Total Forwarded Messages",
      value: totalForwardedMessages,
      description: "Total messages forwarded to the group.",
      className: "text-accent",
      icon: (
        <path d="M1.729,9.212h14.656l-4.184-4.184c-0.307-0.306-0.307-0.801,0-1.107c0.305-0.306,0.801-0.306,1.106,0l5.481,5.482c0.018,0.014,0.037,0.019,0.053,0.034c0.181,0.181,0.242,0.425,0.209,0.66c-0.004,0.038-0.012,0.071-0.021,0.109c-0.028,0.098-0.075,0.188-0.143,0.271c-0.021,0.026-0.021,0.061-0.045,0.085c-0.015,0.016-0.034,0.02-0.051,0.033l-5.483,5.483c-0.306,0.307-0.802,0.307-1.106,0c-0.307-0.305-0.307-0.801,0-1.105l4.184-4.185H1.729c-0.436,0-0.788-0.353-0.788-0.788S1.293,9.212,1.729,9.212z" />
      ),
    },
  ];

  return (
    <div className="stats stats-vertical lg:stats-horizontal shadow-xl w-full mb-8">
      {stats.map((stat, i) => (
        <div className="stat" key={i}>
          <div className={`stat-figure hidden xs:block ${stat.className}`}>
            <svg
              fill="none"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              className="inline-block w-10 h-10 stroke-current"
            >
              {stat.icon}
            </svg>
          </div>
          <div className="stat-title whitespace-normal">{stat.title}</div>
          <div className={`stat-value ${stat.className}`}>
            {formatNumber(stat.value)}
          </div>
          <div className="stat-desc whitespace-normal">{stat.description}</div>
        </div>
      ))}
    </div>
  );
}

function MembersList({
  members,
  totalMessages,
}: {
  totalMessages: number;
  members: { name: string; messages: number }[];
}) {
  return (
    <div className="card bg-base-100 shadow-xl my-5 p-4 ">
      <div className="card-body">
        <h2 className="card-title">Members</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {members.map((member, idx) => (
          <div className="card bg-base-100 shadow-xl" key={idx}>
            <div className="card-body">
              <h2 className="card-title">{member.name}</h2>
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
