import { json, type LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { Toaster } from "react-hot-toast";
import LoadingBar from "~/components/loading-bar";
import { ColorModeProvider } from "~/contexts/color-mode-context";
import stylesheet from "~/tailwind.css";
import { DarkModeScriptInnerHtml } from "~/utils/dark-mode";
import { GoogleTagManager } from "./components/google-tag-manager";
import { user } from "./services/auth.server";
import { getOgGeneratorUrl } from "./utils/path-utils";
import NotFound from "./components/errors/not-found";
import { Error500 } from "./components/errors/500";
import type { User } from "./models/user.server";
import { metaV1 } from "@remix-run/v1-meta";
import { environment } from "./models/environment.server";
import PublicEnv, { getPublicEnv } from "./components/public-env";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "preconnect", href: "https://rsms.me" },
  { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
  { rel: "icon", href: "/favicon.svg" },
];

export function meta(args: any) {
  return metaV1(args, {
    charset: "utf-8",
    title: "Codante - Cursos e Projetos Online de Programação",
    viewport: "width=device-width,initial-scale=1",
    description:
      "Fuja dos mesmos cursos e tutoriais de sempre e aprimore suas skills em programação com workshops e mini projetos ensinados pelos melhores profissionais do mercado!",

    "og:title": "Codante - Cursos e Projetos Online de Programação",
    "og:description": "Codante - Cursos e Projetos Online de Programação",
    "og:image": getOgGeneratorUrl("Codante"),
    "og:type": "website",

    "twitter:card": "summary_large_image",
    "twitter:domain": "codante.io",
    "twitter:title": "Codante - Cursos e Projetos Online de Programação",
    "twitter:description": "Codante - Cursos e Projetos Online de Programação",
    "twitter:image": getOgGeneratorUrl("Codante"),
    "twitter:image:alt": "Codante",
  });
}

export async function loader({ request }: { request: Request }) {
  const userData = (await user({ request })) as User | null;

  // if user is a response, it means that the user is not authenticated
  // we will return this response to destroy the session cookie
  if (userData instanceof Response) {
    return userData;
  }

  return json({
    user: userData,
    ENV: {
      BASE_URL: environment().BASE_URL,
      NODE_ENV: environment().NODE_ENV,
    },
  });
}

export default function App() {
  const loaderData = useLoaderData<typeof loader>();
  const user = loaderData.user;

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="text-gray-800 bg-white dark:bg-gradient-to-br dark:from-gray-darkest dark:to-gray-dark bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:text-gray-50">
        <script
          dangerouslySetInnerHTML={{
            __html: DarkModeScriptInnerHtml,
          }}
        />
        <GoogleTagManager
          environment={process.env.NODE_ENV}
          gtmTrackingId="GTM-NXHM2J7"
          user={user}
        />
        <ColorModeProvider>
          <LoadingBar />
          <Outlet context={{ user }} />
        </ColorModeProvider>
        <ScrollRestoration />
        {/* Env pública: https://remix.run/docs/en/main/guides/envvars | https://dev.to/remix-run-br/type-safe-environment-variables-on-both-client-and-server-with-remix-54l5 */}
        <PublicEnv {...loaderData.ENV} />
        <Scripts />
        <LiveReload />
        <Toaster
          toastOptions={{
            className:
              "bg-background-50 dark:bg-background-800 dark:text-gray-50",
          }}
        />
        {getPublicEnv('NODE_ENV') !== "production" && (
          <div className="fixed z-50 w-20 py-2 font-bold text-center text-blue-700 bg-blue-100 rounded-full bottom-2 left-2">
            <span className="block md:hidden">sm</span>
            <span className="hidden md:block lg:hidden">md</span>
            <span className="hidden lg:block xl:hidden">lg</span>
            <span className="hidden xl:block 2xl:hidden">xl</span>
            <span className="hidden 2xl:block">2xl</span>
          </div>
        )}
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <html>
      <head>
        <title>
          {isRouteErrorResponse(error)
            ? `Página não encontrada`
            : "Ops... algum erro aconteceu!"}
        </title>
        <Meta />
        <Links />
      </head>
      <body className="text-gray-800 dark:bg-background-900 bg-background-50 dark:text-gray-50">
        <script
          dangerouslySetInnerHTML={{
            __html: DarkModeScriptInnerHtml,
          }}
        />
        <ColorModeProvider>
          <LoadingBar />

          {isRouteErrorResponse(error) ? (
            <NotFound />
          ) : (
            <Error500 error={error} />
          )}
        </ColorModeProvider>
        <Scripts />
      </body>
    </html>
  );
}
