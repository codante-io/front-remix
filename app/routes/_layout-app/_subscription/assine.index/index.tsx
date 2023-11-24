import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import type { AxiosError } from "axios";
import axios from "axios";
import PriceCard from "~/components/cards/pricing/price-card";
import {
  freePlanDetails,
  freePlanFeatures,
  proPlanDetails,
  proPlanFeatures,
} from "~/components/cards/pricing/pricing-data";
import type { Subscription } from "~/models/subscription.server";
import { currentToken } from "~/services/auth.server";
import faqQuestions from "../faq-questions";
import { useState } from "react";
import { RiArrowDownSLine } from "react-icons/ri";
import { AnimatePresence, motion } from "framer-motion";
import useSound from "use-sound";
import switchSound from "~/sounds/switch.mp3";
import classNames from "~/utils/class-names";
import type { Plan } from "~/models/plan.server";
import { getPlanDetails } from "~/models/plan.server";
import { useLoaderData } from "@remix-run/react";
import ProSpanWrapper from "~/components/pro-span-wrapper";

export async function loader({ request }: LoaderFunctionArgs) {
  const plan = await getPlanDetails();
  return { request, plan };
}

export async function action({ request }: { request: Request }) {
  let token = await currentToken({ request });

  try {
    const response = await axios.get<{
      checkoutLink: string;
      pagarmeOrderID: string;
      subscription: Subscription;
    }>(`${process.env.API_HOST}/api/pagarme/get-link`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    return redirect(`${response.data.checkoutLink}`);
  } catch (error: any) {
    // if it is an axios error
    if (error.isAxiosError) {
      const axiosError = error as AxiosError;

      // console.log(error);

      // return "errror";
      // if it is a 401 error
      if (axiosError.response?.status === 401) {
        // redirect to login page
        return redirect("/login");
      }

      const errorMessage = error.response.data.message;
      const encodedErrorMessage = encodeURIComponent(errorMessage);

      return redirect(`/assine/erro?error=${encodedErrorMessage}`);
    }

    return redirect(`/assine/erro`);
  }
}

export default function AssinePage() {
  const loaderData = useLoaderData<typeof loader>();
  const plan = loaderData.plan as Plan;

  const proPlanWithPrice = {
    ...proPlanDetails,
    monthlyPrice: Math.round(plan?.price_in_cents / 100 / 12),
    totalPrice: plan.price_in_cents / 100,
  };
  return (
    <>
      <div className="bg-black w-full border-t border-b border-amber-400 px-0 lg:px-20 py-10 mb-10 md:mb-0">
        <div className="container mx-auto text-white text-center">
          <h3 className="font-[Tourney] text-5xl mb-6">
            <span className="text-amber-400">{"<"}</span>
            {"Black Friday Codante"}
            <span className="text-amber-400">{" />"}</span>
          </h3>
          <div className="">
            <p className="font-light text-lg">
              Aproveite essa Black Friday aprimorar seus conhecimentos em Front!{" "}
            </p>
            <p className="font-light text-lg ">
              Assine o plano <ProSpanWrapper>PRO</ProSpanWrapper> por 12x de
              R$49 com{" "}
              <span className="decoration-brand font-bold underline">
                acesso vitalício
              </span>
              .
            </p>
            <p className="text-gray-400 mt-4 text-sm">
              Preço exclusivo para essa Black Friday!{" "}
            </p>
          </div>
        </div>
      </div>
      <main className="container mx-auto ">
        {/* <h1 className="mb-10 text-3xl md:text-4xl text-center font-lexend">
          <span className="font-bold border-b-4 border-amber-400">Assine</span>{" "}
          o Codante
        </h1> */}

        <section>
          <div className="flex flex-col items-center ">
            <p className="mt-2 mb-4 font-light text-center font-inter text-md md:text-xl lg:max-w-3xl">
              Assine nosso{" "}
              <span className="text-brand-400">
                plano vitalício com valor promocional de lançamento
              </span>{" "}
              <span className="font-bold underline text-brand-400">
                por tempo limitado
              </span>
              . Sem assinaturas. Pague apenas uma vez, acesse para sempre.
            </p>

            <section className="flex flex-col-reverse justify-center gap-20 mt-10 mb-20 lg:flex-row">
              <PriceCard
                featuresByCategory={freePlanFeatures}
                data={freePlanDetails}
              />
              <PriceCard
                data={proPlanWithPrice}
                featuresByCategory={proPlanFeatures}
              />
            </section>
          </div>
        </section>
        <section className="mt-12">
          <h2 className="mb-10 text-3xl md:text-4xl text-center font-lexend">
            Perguntas{" "}
            <span className="font-bold border-b-4 border-amber-400">
              Frequentes
            </span>
          </h2>
          <section className="mt-14">
            {faqQuestions.map((question, index) => (
              <FaqItem
                key={index}
                question={question.question}
                answer={question.answer}
              />
            ))}
          </section>
        </section>
      </main>
    </>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const [playSound] = useSound(switchSound, { volume: 0.25 });

  return (
    <div
      className={classNames(
        isVisible
          ? "border-brand-500"
          : "border-transparent hover:border-gray-300 hover:dark:border-gray-600",
        "cursor-pointer shadow mb-6 mx-2 lg:mx-24 border font-lexend rounded-lg bg-white dark:bg-background-800 px-4 md:px-10 py-4",
      )}
      onClick={() => {
        setIsVisible(!isVisible);
        playSound();
      }}
    >
      <section className="flex justify-between items-center">
        <h3
          className={`py-4 md:py-6 text-lg md:text-xl  font-light text-gray-700 dark:text-white`}
        >
          {question}
        </h3>
        <RiArrowDownSLine
          className={`text-3xl md:text-4xl transition-transform flex-shrink-0 ${
            isVisible ? "-rotate-180 text-brand-500" : "text-gray-400"
          }`}
        />
      </section>
      <AnimatePresence initial={false}>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isVisible ? 1 : 0,
            height: isVisible ? "auto" : 0,
            transition: { opacity: { duration: 0.6 } },
          }}
          exit={{
            opacity: 0,
            height: 0,
            transition: { opacity: { duration: 0.1 } },
          }}
          key={isVisible ? "open" : "closed"}
          className={`${isVisible ? "visible" : "invisible"} `}
        >
          <p className="font-extralight dark:text-gray-300 text-gray-600 pb-4 md:leading-relaxed text-sm md:text-base">
            {answer}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
