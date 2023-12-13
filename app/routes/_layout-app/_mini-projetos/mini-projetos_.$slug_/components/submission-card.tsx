import { CodeBracketIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "@remix-run/react";
import React, { useState } from "react";
import { BsGlobe } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import ReactionsButton from "~/components/reactions-button";
import TooltipWrapper from "~/components/tooltip";
import UserAvatar from "~/components/user-avatar";
import type {
  UserAvatar as UserAvatarType,
  ChallengeUser,
} from "~/models/user.server";
import classNames from "~/utils/class-names";
import { formatName } from "~/utils/format-name";

type RequiredChallengeUserProps = {
  avatar: UserAvatarType;
  id: number;
};

export default function SubmissionCard({
  challengeUser,
  size = "large",
  showEditForm,
  isEditing,
  challengeSlug,
  showReactions = true,
  className,
  isHomePage = false,
  footerPadding = "px-4 py-4",
}: {
  footerPadding?: string;
  showReactions?: boolean;
  isEditing?: boolean;
  challengeUser: RequiredChallengeUserProps & Partial<ChallengeUser>;
  size?: "medium" | "large" | "small";
  showEditForm?: () => void;
  challengeSlug?: string;
  className?: string;
  isHomePage?: boolean;
}) {
  const [editSubmition, setEditSubmition] = useState(false);

  function handleEditSubmition() {
    if (showEditForm) {
      showEditForm();
      setEditSubmition(!editSubmition);
    }
  }

  return (
    <article
      className={classNames(
        "relative overflow-hidden rounded-xl border-[1.5px] shadow-sm text-gray-800 dark:text-white transition-shadow",
        size === "medium" && "max-w-[377px]",
        challengeUser.is_solution
          ? "border-brand-500"
          : "dark:border-background-600 border-background-200",
        size === "small" && "max-w-[275px]",
        className,
      )}
    >
      <a
        className={classNames(
          "overflow-hidden group relative",
          !challengeUser.is_solution ? "cursor-pointer" : "cursor-default",
        )}
        onClick={(event) => {
          if (!challengeUser.is_solution) return;
          event.preventDefault();
        }}
        href={`/mini-projetos/${challengeSlug}/submissoes/${challengeUser.user_github_user}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {challengeUser.is_solution ? (
          <>
            <SubmissionButton
              href={challengeUser.submission_url}
              size={size}
              position="right"
            >
              <BsGlobe className="text-4xl text-gray-800 dark:text-white" />
            </SubmissionButton>
            <SubmissionButton
              link={`/mini-projetos/${challengeSlug}/resolucao-codigo`}
              size={size}
              position="left"
            >
              <CodeBracketIcon className="w-10 text-gray-800 dark:text-white" />
            </SubmissionButton>
          </>
        ) : null}
        <img
          src={challengeUser.submission_image_url}
          alt="Screenshot da aplicação submetida"
          className={classNames(
            "w-full transition-all delay-75 aspect-video",
            isHomePage
              ? "opacity-40 blur-sm group-hover:blur-none group-hover:opacity-100"
              : "",
            challengeUser.is_solution
              ? "group-hover:opacity-40 group-hover:blur-sm"
              : "",
          )}
        />
      </a>

      <footer
        className={classNames(
          footerPadding,
          "flex items-center justify-between gap-4 dark:bg-background-700",
        )}
      >
        <div className="w-10 h-10 flex-none">
          <UserAvatar
            avatar={challengeUser.avatar}
            className="w-10 h-10 flex-shrink-0"
          />
        </div>
        <div className="w-full">
          <h4 className="text-xs dark:text-gray-400 font-regular">
            {challengeUser.is_solution ? (
              <span className="text-brand-500">
                Resolução <b>oficial</b> de
              </span>
            ) : (
              <span>Resolução de</span>
            )}
          </h4>
          <h3
            className="font-semibold line-clamp-1 text-gray-700 dark:text-white"
            title={formatName(challengeUser.avatar.name)}
          >
            {formatName(challengeUser.avatar.name)}
          </h3>
        </div>
        <div className="flex items-center gap-x-4">
          {showEditForm && (
            <TooltipWrapper text="Editar" side="bottom">
              <FiEdit
                onClick={handleEditSubmition}
                className={`w-4 h-4 font-thin transition-all hover:text-brand-500 hover:scale-110 ${
                  isEditing
                    ? "text-brand-500 scale-110"
                    : "text-current scale-100"
                }`}
              />
            </TooltipWrapper>
          )}
          {showReactions && challengeUser.reactions && (
            <ReactionsButton
              reactions={challengeUser.reactions}
              reactableId={challengeUser.id}
              reactableType="ChallengeUser"
            />
          )}
        </div>
      </footer>
    </article>
  );
}

function SubmissionButton({
  size,
  href,
  children,
  position,
  link,
}: {
  size: "medium" | "large" | "small";
  href?: string;
  link?: string;
  children: React.ReactNode;
  position: "left" | "right";
}) {
  const navigate = useNavigate();

  function handleRedirect() {
    if (href) window.open(href, "_blank");
    if (link) navigate(link);
  }

  const responsivePositionClass = classNames(
    size === "medium" && position === "left" && `md:w-14 md:h-14 md:left-32`,
    size === "medium" && position === "right" && `md:w-14 md:h-14 md:right-32`,
    size === "large" && position === "left" && `md:w-28 md:h-24 md:left-44`,
    size === "large" && position === "right" && `md:w-28 md:h-24 md:right-44`,
  );

  return (
    <button
      className={classNames(
        responsivePositionClass,
        `absolute inset-0 ${position}-32 z-10 flex items-center justify-center w-20 h-16 p-6 m-auto transition-all shadow-lg opacity-100 md:w-14 md:h-14 md:p-4 bg-background-100 rounded-xl dark:bg-background-700 md:opacity-0 md:group-hover:opacity-100`,
      )}
      onClick={handleRedirect}
    >
      {children}
    </button>
  );
}
