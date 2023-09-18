import { Link } from "@remix-run/react";
import CardItemRibbon from "~/components/cards/card-item-ribbon";
import type { ChallengeCard as ChallengeCardType } from "~/models/challenge.server";
import CardItemDifficulty from "./card-item-difficulty";
import CardItemTag from "./card-item-tag";
import PlayIcon from "./icons/playIcon.svg";
import TooltipWrapper from "../tooltip";
import type { User } from "~/models/user.server";
import UserAvatar from "../user-avatar";

export default function ChallengeCard({
  challenge,
  loggedUser,
}: {
  challenge: ChallengeCardType;
  loggedUser?: User;
}) {
  return (
    <Link
      onClick={(e) => challenge?.status === "soon" && e.preventDefault()}
      to={
        challenge?.status === "soon" ? `#` : `/mini-projetos/${challenge?.slug}`
      }
      className={
        challenge?.status === "soon" ? "cursor-not-allowed" : "cursor-pointer"
      }
    >
      <article
        className="group
          relative max-w-[300px] h-[450px] bg-background-50 dark:bg-background-800 shadow-md rounded-2xl
          font-lexend border-[1.5px] border-background-200 dark:border-background-600
        hover:border-blue-300 hover:shadow-lg dark:hover:border-blue-900 dark:hover:shadow-lg transition-shadow"
      >
        <div
          className={`flex m-1 items-center justify-center h-44 bg-opacity-20 rounded-t-xl dark:bg-opacity-40 bg-background-600 overflow-hidden`}
        >
          <img
            src={challenge.image_url}
            className={`inline-block -mb-3 h-full object-cover ${
              challenge.status === "soon"
                ? "group-hover:animate-tada"
                : "group-hover:animate-float"
            }`}
            alt=""
          />
        </div>
        {challenge?.status === "soon" && (
          <CardItemRibbon
            className="group-hover:animate-tada"
            text="Em breve"
          />
        )}
        <div className="flex flex-col justify-between p-6 pt-3">
          <div>
            <div className="mb-4 card-header">
              <CardItemDifficulty
                className="mb-3"
                difficulty={challenge?.difficulty}
              />
              <h2 className="mb-1 text-lg font-bold leading-tight text-gray-700 dark:text-gray-50">
                {challenge?.name}
              </h2>
              <div className="tags">
                {challenge?.tags?.map((tag) => (
                  <CardItemTag
                    key={tag.id ?? tag.name}
                    tagName={tag.name}
                    className="text-blue-900 bg-blue-200 dark:text-gray-300 dark:bg-blue-900"
                  />
                ))}
              </div>
            </div>
            <p className="text-sm font-light text-gray-600 line-clamp-3 slate-600 dark:text-gray-300">
              {challenge?.short_description}
            </p>
          </div>
          <div className="absolute bottom-0 right-0 flex items-center justify-between w-full p-6 mt-4 card-footer">
            <section>
              {challenge?.has_workshop && (
                <TooltipWrapper text="Resolução disponível">
                  <img src={PlayIcon} alt="Ícone de vídeo" />
                </TooltipWrapper>
              )}
            </section>
            <section className="">
              <div className="flex -space-x-2 overflow-hidden">
                {challenge.current_user_is_enrolled && loggedUser && (
                  <UserAvatar
                    key={loggedUser.id}
                    avatarUrl={loggedUser.avatar_url}
                  />
                )}
                {challenge.current_user_is_enrolled
                  ? challenge?.users
                      ?.filter(
                        (user) => user.avatar_url !== loggedUser?.avatar_url
                      )
                      .slice(0, 4)
                      .map((user, index) => (
                        <UserAvatar key={index} avatarUrl={user.avatar_url} />
                      ))
                  : challenge?.users?.map((user, index) => (
                      <UserAvatar key={index} avatarUrl={user.avatar_url} />
                    ))}
                {challenge.enrolled_users_count > 5 && (
                  <div className="w-7 h-7 text-[0.7rem] m-[2px] flex items-center justify-center rounded-full ring-2 ring-white dark:ring-background-800 bg-blue-300 text-blue-900 font-bold">
                    +{challenge.enrolled_users_count - 5}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </article>
    </Link>
  );
}
