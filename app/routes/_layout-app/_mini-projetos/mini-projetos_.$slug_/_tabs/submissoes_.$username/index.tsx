import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import type { Challenge } from "~/models/challenge.server";
import type { ChallengeUser, User } from "~/models/user.server";
import UserAvatar from "~/components/user-avatar";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import ReactionsButton from "~/components/reactions-button";
import {
  FacebookShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
} from "react-share";
import { useEffect, useState } from "react";
import {
  RiFacebookBoxLine,
  RiLinkedinBoxLine,
  RiWhatsappLine,
} from "react-icons/ri";
import { formatName } from "~/utils/format-name";
import toast from "react-hot-toast";
import { HiOutlineLink } from "react-icons/hi";
import { BsGithub } from "react-icons/bs";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  return {
    params,
  };
};

export default function MySolution() {
  const { params } = useLoaderData<typeof loader>();

  const { challenge, challengeUsers, user } = useOutletContext<{
    challengeUser: ChallengeUser;
    challenge: Challenge;
    challengeUsers: ChallengeUser[];
    user: User;
  }>();

  // console.log(user)

  const [location, setLocation] = useState("");

  useEffect(() => {
    setLocation(window.location.href);
  }, []);

  const navigate = useNavigate();
  const submissionUser = challengeUsers.find(
    (user) => user.user_github_user === params.username,
  );

  if (!submissionUser)
    return (
      <div className="flex flex-col items-start justify-center h-full container">
        <h1 className="mb-5 text-2xl font-bold dark:text-gray-300 text-gray-800">
          Nenhuma submissão encontrada
        </h1>
        <p className="text-gray-600 dark:text-gray-500">
          Este usuário ainda não submeteu uma solução para este Mini Projeto.
        </p>
      </div>
    );

  function handleClickLinkedin() {
    if (!submissionUser) return false;
    if (submissionUser?.linkedin_url)
      return window.open(submissionUser.linkedin_url, "_blank");
    if (user && user.id === submissionUser?.user_id)
      return navigate("/minha-conta");
    return toast.error(
      `${formatName(
        submissionUser.user_name,
      )} não vinculou sua conta do LinkedIn.`,
    );
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(location);
    toast.success("Link copiado para a área de transferência!");
  }

  return (
    <div className="container text-center">
      <h1
        className="text-2xl md:text-4xl font-lexend mb-2 cursor-pointer hover:opacity-80"
        onClick={() => navigate(`/mini-projetos/${params.slug}`)}
      >
        {challenge.name}
      </h1>
      <h2 className="text-lg md:text-xl">
        Solução de{" "}
        <span className="md:text-xl font-bold text-brand-500">
          {formatName(submissionUser.user_name)}
        </span>
      </h2>
      <section
        id="share-section"
        className="mb-14 md:mb-24 text-start md:text-right mt-5 md:mt-0"
      >
        <h2>Compartilhe nas redes</h2>
        <section className="mt-2 flex items-center justify-start md:justify-end gap-2">
          <button
            title="Copiar link"
            onClick={copyToClipboard}
            className="border border-brand-500 rounded-md flex p-1 hover:text-brand-500 hover:opacity-70"
          >
            <HiOutlineLink className="text-xl" />
          </button>
          <LinkedinShareButton url={location} title={challenge.name}>
            <div className="border border-brand-500 rounded-md flex p-1 hover:text-brand-500 hover:opacity-70">
              <RiLinkedinBoxLine title="Linkedin" className="text-xl" />
            </div>
          </LinkedinShareButton>
          <WhatsappShareButton url={location}>
            <div className="border border-brand-500 hover:text-brand-500 hover:opacity-70 rounded-md flex p-1">
              <RiWhatsappLine title="WhatsApp" className="text-xl" />
            </div>
          </WhatsappShareButton>
          <FacebookShareButton url={location}>
            <div className="border border-brand-500 hover:text-brand-500 hover:opacity-70 rounded-md flex p-1">
              <RiFacebookBoxLine title="Facebook" className="text-lg " />
            </div>
          </FacebookShareButton>
        </section>
      </section>
      <main className="relative">
        <UserAvatar
          avatar={submissionUser.avatar}
          className="lg:w-32 lg:h-32 absolute left-1/2 transform -translate-x-1/2 lg:-top-16 md:w-24 md:h-24 md:-top-12 w-16 h-16 -top-8"
          showTooltip={false}
        />
        <div className="overflow-hidden rounded-xl border-[1.5px] shadow-sm text-gray-800 dark:text-white transition-shadow dark:border-background-600  border-background-200 w-full dark:bg-background-700">
          <header className="h-12 md:h-20 lg:h-32 flex justify-around gap-32 md:gap-36 lg:gap-40 items-center">
            <div
              className="flex flex-col items-center justify-center md:gap-1 cursor-pointer hover:text-gray-500 text-gray-400 dark:text-gray-500 dark:hover:text-gray-300"
              onClick={handleClickLinkedin}
            >
              <FaLinkedin className="lg:text-3xl md:text-2xl text-xl" />
              {!submissionUser.linkedin_url &&
              user &&
              user.id === submissionUser.user_id ? (
                <span className="font-light md:text-base md:inline hidden text-sm">
                  Cadastre seu LinkedIn!
                </span>
              ) : (
                <span className="font-light md:text-base md:inline hidden text-sm">{`${formatName(
                  submissionUser.avatar.name,
                )}`}</span>
              )}
            </div>
            <div
              className="flex flex-col items-center justify-center md:gap-1 cursor-pointer hover:text-gray-500 text-gray-400 dark:text-gray-500 dark:hover:text-gray-300"
              onClick={() =>
                window.open(
                  `https://www.github.com/${submissionUser.user_github_user}`,
                  "_blank",
                )
              }
            >
              <FaGithub className="lg:text-3xl md:text-2xl text-xl" />
              <span className="font-light md:text-base md:inline hidden text-sm">{`@${submissionUser.user_github_user}`}</span>
            </div>
          </header>
          <img
            className="cursor-pointer"
            src={submissionUser.submission_image_url}
            alt={`Print Screen da submissão de ${formatName(
              submissionUser.user_name,
            )}`}
            onClick={() => window.open(submissionUser.submission_url, "_blank")}
          />
        </div>
      </main>
      <section className="flex justify-between mt-6">
        <div
          className="flex items-center cursor-pointer gap-2 hover:opacity-70 border border-brand-500 px-2 py-1 rounded-md"
          onClick={() => {
            if (submissionUser.is_solution) {
              return navigate(`/mini-projetos/${params.slug}/resolucao`);
            }
            window.open(submissionUser.fork_url as string, "_blank");
          }}
        >
          <BsGithub />
          <h3 className="font-light ">Acessar código no GitHub</h3>
        </div>
        <div className="flex items-center">
          <ReactionsButton
            reactions={submissionUser.reactions}
            reactableId={submissionUser.id}
            reactableType="ChallengeUser"
            iconSize="text-2xl"
          />
        </div>
      </section>
    </div>
  );
}
