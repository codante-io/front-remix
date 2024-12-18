import { Link, useFetcher, useLocation } from "@remix-run/react";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import "filepond/dist/filepond.min.css";
import { InfoIcon } from "lucide-react";
import party from "party-js";
import { useEffect, useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import { BsDiscord } from "react-icons/bs";
import DiscordButton from "~/components/features/auth/discord-button";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useToasterWithSound } from "~/lib/hooks/useToasterWithSound";
import Step from "~/routes/_layout-app/_mini-projetos/mini-projetos_.$slug_/_tabs/_overview/components/steps/step";
import {
  UserStep,
  UserStepsIds,
} from "~/routes/_layout-app/_mini-projetos/mini-projetos_.$slug_/build-steps.server";
import "./filepond-style.css";

registerPlugin(FilePondPluginFileValidateType);

function getButtonStatus(
  formData: FormData | undefined,
  stepId: string,
  fetcherState: "idle" | "submitting" | "loading",
) {
  if (!formData || fetcherState === "idle") return fetcherState;

  const submittedStepId = formData.get("stepId")?.toString();
  return submittedStepId === stepId ? fetcherState : "idle";
}

export default function LessonSubmitSolution({
  challenge,
  steps,
}: {
  challenge: any;
  steps: UserStep[];
}) {
  const [hasDeployUrl, setHasDeployUrl] = useState(true);

  function handleToggleHasDeploy() {
    setHasDeployUrl((prev) => !prev);
  }
  const action = "/api/challenge";
  const fetcher = useFetcher<{ error?: string; success?: string }>();
  const location = useLocation();

  const { showSuccessToast, showErrorToast } = useToasterWithSound();

  useEffect(() => {
    if (fetcher.data?.error) {
      showErrorToast(fetcher.data?.error);
    }

    if (fetcher.data?.success) {
      showSuccessToast(fetcher.data?.success);
    }
  }, [fetcher.data, showErrorToast, showSuccessToast]);

  const githubRepoUrl = "server-actions-no-nextjs";

  return (
    <div className="max-w-prose pt-10">
      <Step.StepsContainer>
        <Step
          title="Conecte o seu Github"
          description="Para participar é necessário conectar com o GitHub."
          id="connect-github"
          status={
            steps.find((step) => step.id === "connect-github")?.status ??
            "upcoming"
          }
        >
          <fetcher.Form method="post" action={action}>
            <input type="hidden" name="redirectTo" value={location.pathname} />
            <input type="hidden" name="stepId" value="connect-github" />
            <Step.PrimaryButton
              stepId="connect-github"
              status={getButtonStatus(
                fetcher.formData,
                "connect-github",
                fetcher.state,
              )}
            >
              Conectar Github
            </Step.PrimaryButton>
          </fetcher.Form>
        </Step>
        <Step
          id="join-challenge"
          title="Participe do Mini Projeto"
          description="Participe. É 100% gratuito!"
          status={
            steps.find((step) => step.id === "join-challenge")?.status ??
            "upcoming"
          }
        >
          <fetcher.Form method="post" action={action}>
            <input type="hidden" name="slug" value={challenge.slug} />
            <input type="hidden" name="stepId" value="join-challenge" />
            <Step.PrimaryButton
              stepId="join-challenge"
              status={getButtonStatus(
                fetcher.formData,
                "join-challenge",
                fetcher.state,
              )}
            >
              Participar
            </Step.PrimaryButton>
          </fetcher.Form>
        </Step>
        <Step
          id="join-discord"
          title="Participe da nossa comunidade"
          description="Tire dúvidas e conecte-se com outras pessoas que estão fazendo esse Mini Projeto."
          status={
            steps.find((step) => step.id === "join-discord")?.status ??
            "upcoming"
          }
        >
          <fetcher.Form action={action}>
            <section className="flex gap-2 items-center mt-2">
              <DiscordButton>
                <BsDiscord className="w-3 h-3 mr-2" />
                <span>Entrar</span>
              </DiscordButton>
              <Button
                type="submit"
                variant="outline"
                className=""
                name="intent"
                value="skip-discord"
              >
                Pronto
              </Button>
            </section>
          </fetcher.Form>
        </Step>
        <Step
          id="verify-fork"
          title="Faça o fork do repositório"
          description={
            <span>
              Acesse o{" "}
              {steps.find((step) => step.id === "verify-fork")?.status ===
              "current" ? (
                <Link
                  to={`https://github.com/codante-io/${githubRepoUrl}`}
                  target="_blank"
                  className="text-brand hover:underline"
                >
                  link do repositório
                </Link>
              ) : (
                "link do repositório"
              )}
              , faça um fork e clique em "Verificar".
            </span>
          }
          status={
            steps.find((step) => step.id === "verify-fork")?.status ??
            "upcoming"
          }
        >
          <fetcher.Form method="post" action={action}>
            <input type="hidden" name="slug" value={challenge.slug} />
            <input type="hidden" name="stepId" value="verify-fork" />
            <Step.PrimaryButton
              stepId="verify-fork"
              status={getButtonStatus(
                fetcher.formData,
                "verify-fork",
                fetcher.state,
              )}
            >
              Verificar Fork
            </Step.PrimaryButton>
          </fetcher.Form>
        </Step>
        <Step
          id="submit-challenge"
          title="Submeta sua resolução"
          description="Faça deploy do seu Mini Projeto e envie o link para aparecer na galeria de submissões."
          status={
            steps.find((step) => step.id === "submit-challenge")?.status ??
            "upcoming"
          }
        >
          <fetcher.Form
            method="post"
            encType="multipart/form-data" // important!
            action={action}
            className="mt-4"
          >
            <input type="hidden" name="slug" value={challenge.slug} />
            <input type="hidden" name="stepId" value="submit-challenge" />
            {hasDeployUrl && (
              <>
                <Input
                  placeholder="URL do seu deploy"
                  name="submission-url"
                  id="submission-url"
                  className="pr-1 dark:bg-background-900 w-full"
                />

                <div className="flex justify-between gap-1">
                  <Step.PrimaryButton
                    stepId="submit-challenge"
                    status={getButtonStatus(
                      fetcher.formData,
                      "submit-challenge",
                      fetcher.state,
                    )}
                  >
                    Submeter
                  </Step.PrimaryButton>
                  <Button
                    variant={"link"}
                    type="button"
                    className="text-xs pr-2 pl-2 dark:text-gray-500"
                    onClick={handleToggleHasDeploy}
                  >
                    Não tem deploy?
                  </Button>
                </div>
              </>
            )}
            {!hasDeployUrl && (
              <div>
                <p className="font-light text-gray-400 mb-4">
                  <span>
                    <InfoIcon className="w-4 h-4 inline-block mr-1" />
                  </span>
                  Envie o screenshot da sua aplicação por aqui. A imagem
                  idealmente deverá possuir 1920x1080 pixels. Uma ferramenta
                  útil e gratuita é o{" "}
                  <a
                    className="hover:underline"
                    target="_blank"
                    href="https://screenshot.rocks"
                    rel="noreferrer"
                  >
                    Screenshot.rocks
                  </a>
                  . Você poderá substituir a imagem depois.
                </p>
                <FilePond
                  labelIdle="Arraste a imagem ou <span class='filepond--label-action'>clique aqui</span>"
                  labelThousandsSeparator="."
                  storeAsFile={true}
                  required
                  acceptedFileTypes={["image/*"]}
                  name={"submission_image"}
                  credits={false}
                />
                <div className="flex justify-between gap-1">
                  <Step.PrimaryButton
                    stepId={"submit-challenge-without-deploy" as UserStepsIds}
                    status={getButtonStatus(
                      fetcher.formData,
                      "submit-challenge-without-deploy",
                      fetcher.state,
                    )}
                  >
                    Submeter
                  </Step.PrimaryButton>
                  <Button
                    variant={"link"}
                    type="button"
                    className="text-xs pr-2 pl-2 dark:text-gray-500"
                    onClick={handleToggleHasDeploy}
                  >
                    Possui deploy?
                  </Button>
                </div>
              </div>
            )}
          </fetcher.Form>
        </Step>
        <Step
          id="finish-challenge"
          title="Finalizar projeto"
          description="Quando acabar o seu Mini Projeto é só marcar aqui como concluído."
          last
          status={
            steps.find((step) => step.id === "finish-challenge")?.status ??
            "upcoming"
          }
        >
          <fetcher.Form method="post" action="/api/challenge">
            <input type="hidden" name="slug" value={challenge.slug} />
            <input type="hidden" name="stepId" value="finish-challenge" />
            <Step.PrimaryButton
              onClick={(e: any) =>
                party.confetti(e.target as HTMLElement, {
                  count: party.variation.range(40, 250),
                })
              }
              stepId="finish-challenge"
              status={getButtonStatus(
                fetcher.formData,
                "finish-challenge",
                fetcher.state,
              )}
            >
              Marcar como concluído
            </Step.PrimaryButton>
          </fetcher.Form>
        </Step>
      </Step.StepsContainer>
    </div>
  );
}
