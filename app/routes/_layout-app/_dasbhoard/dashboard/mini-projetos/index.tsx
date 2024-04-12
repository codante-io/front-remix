import { Link, useOutletContext } from "@remix-run/react";
// import CardItemMainTechnology from "~/components/ui/cards/card-item-main-technology";
import type {
  ChallengeUserDashboard,
  Dashboard,
} from "~/lib/models/dashboard.server";

export default function ChallengeDashboard() {
  const { dashboardData }: { dashboardData: Dashboard } = useOutletContext();
  const challengeUsers = dashboardData.challenge_users;

  const onGoingChallengeUsers = challengeUsers.filter(
    (challengeUser) => !challengeUser.completed,
  );

  const completedChallengeUsers = challengeUsers.filter(
    (challengeUser) => challengeUser.completed,
  );

  return (
    <>
      <div className="">
        <h1 className="text-2xl mb-8">
          Mini Projetos{" "}
          <span className="font-semibold text-brand-400">em andamento</span>
        </h1>
        <div className="flex flex-wrap gap-6 items-center">
          {onGoingChallengeUsers.length > 0 ? (
            onGoingChallengeUsers.map((challengeUser) => (
              <ChallengeCard key={challengeUser.id} challenge={challengeUser} />
            ))
          ) : (
            <h2 className="dark:text-gray-600 text-gray-400">
              Você não possui{" "}
              <span className="font-semibold">Mini Projetos</span> em andamento
            </h2>
          )}
        </div>

        <div className="w-full h-[1px] bg-gray-200 dark:bg-gray-700 my-10" />
        <h1 className="text-2xl mb-8">
          Mini Projetos{" "}
          <span className="font-semibold text-brand-400">concluídos</span>
        </h1>
        <div className="flex flex-wrap gap-6 items-center">
          {completedChallengeUsers.length > 0 ? (
            completedChallengeUsers.map((challengeUser) => (
              <ChallengeCard key={challengeUser.id} challenge={challengeUser} />
            ))
          ) : (
            <h2 className="dark:text-gray-600 text-gray-400">
              Você não concluiu nenhum{" "}
              <span className="font-semibold">Mini Projeto</span>
            </h2>
          )}
        </div>
      </div>
    </>
  );
}

function ChallengeCard({ challenge }: { challenge: ChallengeUserDashboard }) {
  return (
    <Link
      to={`/mini-projetos/${challenge.challenge_slug}`}
      className={"cursor-pointer"}
    >
      <article
        className={`group
          relative xl:max-w-[292px] max-w-[298px] sm:h-[255px] bg-background-50 dark:bg-background-800 shadow-md rounded-2xl
          font-lexend border-[1.5px] border-background-200 dark:border-background-600
        hover:border-blue-300 hover:shadow-lg dark:hover:border-blue-900 dark:hover:shadow-lg transition-shadow`}
      >
        <div
          className={`flex m-1 items-center justify-center h-44 bg-opacity-20 rounded-t-xl dark:bg-opacity-40 bg-background-600 overflow-hidden`}
        >
          {/* {challenge?.main_technology?.name && (
            <CardItemMainTechnology
              technologyName={challenge.main_technology?.name}
              technologyImgSrc={challenge.main_technology?.image_url}
            />
          )} */}
          <img
            src={challenge.challenge_image}
            className={`inline-block -mb-3 h-full object-cover group-hover:animate-float`}
            alt=""
          />
        </div>
        <div className="flex flex-col justify-between p-6 pt-3">
          <div>
            <div className="mb-2 card-header">
              <h2 className="mb-1 font-light leading-tight text-gray-700 dark:text-gray-50">
                {challenge.challenge_name}
              </h2>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
