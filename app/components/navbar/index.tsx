import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Link, NavLink, useMatches, useNavigate } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { BsArrowRight, BsFillCaretDownFill } from "react-icons/bs";
import { RxDropdownMenu } from "react-icons/rx";
import useSound from "use-sound";
import ToggleColorMode from "~/components/toggle-color-mode";
import { useColorMode } from "~/contexts/color-mode-context";
import { setActiveClassForPath } from "~/utils/path-utils";
import LinkToLoginWithRedirect from "../link-to-login-with-redirect";
import ProfileMenu from "./profile-menu";
import switchSound from "./switch.mp3";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar({
  user,
  hideLinks,
}: {
  user: any;
  hideLinks?: boolean;
}) {
  const matches = useMatches();
  const navigate = useNavigate();
  const [playSound] = useSound(switchSound, { volume: 0.25 });

  const { colorMode } = useColorMode();

  const navigation = [
    {
      name: "Workshops",
      href: "/workshops",
    },
    {
      name: "Mini Projetos",
      href: "/mini-projetos",
    },
    // {
    //   name: "Agenda",
    //   href: "/agenda",
    // },
  ];

  const moreMenuNavigation = [
    {
      name: "Testes Técnicos",
      href: "/testes-tecnicos",
      external: false,
    },
    {
      name: "Ranking",
      href: "/ranking",
      external: false,
    },
    {
      name: "Blog",
      href: "/blog",
      external: false,
    },
    {
      name: "Changelog",
      href: "https://changelog.codante.io/",
      external: true,
    },
  ];

  return (
    <Disclosure
      as="nav"
      className="text-gray-900 bg-transparent data-[headlessui-state=open]:bg-white dark:data-[headlessui-state=open]:bg-background-900 lg:bg-transparent"
    >
      {({ open }) => (
        <>
          <div className="container mx-auto">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button
                  className="inline-flex items-center justify-center p-2 text-gray-900 rounded-md dark:text-gray-50 hover:bg-background-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => playSound()}
                >
                  <span className="sr-only">Open main menu</span>
                  <ToggleButton open={open} />
                </Disclosure.Button>
              </div>
              <div className="flex items-center justify-center flex-1 md:items-stretch md:justify-start">
                <div className="flex items-center flex-shrink-0">
                  <Link to="/">
                    {colorMode === "light" ? (
                      <img
                        className="hidden w-auto h-16 md:block"
                        src="/cdnt-light.svg"
                        alt="Codante"
                      />
                    ) : (
                      <img
                        className="hidden w-auto h-16 md:block"
                        src="/cdnt.svg"
                        alt="Codante"
                      />
                    )}
                  </Link>
                  <Link to="/">
                    {colorMode === "light" ? (
                      <img
                        className="block w-auto h-16 md:hidden"
                        src="/cdnt-light.svg"
                        alt="Codante"
                      />
                    ) : (
                      <img
                        className="block w-auto h-16 md:hidden"
                        src="/cdnt.svg"
                        alt="Codante"
                      />
                    )}
                  </Link>
                </div>
                {!hideLinks && (
                  <div className="hidden md:ml-6 md:pt-4 md:block">
                    <div className="flex items-center space-x-2 md:space-x-4">
                      {navigation.map((item) => (
                        <NavLink
                          prefetch="intent"
                          key={item.name}
                          to={item.href}
                          className={({ isActive }) =>
                            classNames(
                              isActive
                                ? "bg-background-100/70 dark:bg-background-700 dark:hover:bg-background-700 underline dark:text-white text-gray-700"
                                : "text-gray-700 dark:text-gray-300 hover:bg-background-100 dark:hover:bg-background-700 hover:text-gray-900",
                              "rounded-md px-3 py-2 text-sm font-medium"
                            )
                          }
                        >
                          {item.name}
                        </NavLink>
                      ))}
                      <Menu
                        as="div"
                        className="relative z-10 inline-block text-left"
                      >
                        <div>
                          <Menu.Button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md dark:text-gray-300 hover:bg-background-100 dark:hover:bg-background-700 hover:text-gray-900">
                            <RxDropdownMenu
                              className="text-2xl"
                              aria-label="Dropdown menu"
                            />
                          </Menu.Button>
                        </div>
                        <Transition
                          enter="transition ease-out duration-150"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 w-40 mt-2 divide-y rounded-md shadow-lg bg-background-100 dark:bg-background-700 ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="px-1 py-1 ">
                              {moreMenuNavigation.map((item) => (
                                <Menu.Item key={item.name}>
                                  {({ active }) => (
                                    <button
                                      className={`${
                                        active &&
                                        "bg-background-150 dark:bg-background-600"
                                      } group font-medium flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 dark:text-gray-300`}
                                      onClick={() => {
                                        item.external
                                          ? window.open(item.href, "_blank")
                                          : navigate(item.href);
                                      }}
                                    >
                                      {item.name}
                                    </button>
                                  )}
                                </Menu.Item>
                              ))}
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden mr-3 md:block">
                <ToggleColorMode />
              </div>

              {user ? (
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:pr-0">
                  {/* Profile dropdown */}
                  <ProfileMenu user={user} />
                </div>
              ) : (
                <LinkToLoginWithRedirect className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-700 dark:text-white gap-x-1 md:static md:inset-auto md:pr-0">
                  Login <BsArrowRight className="hidden md:inline" />
                </LinkToLoginWithRedirect>
              )}
            </div>
          </div>

          {/* <Disclosure.Panel className="sm:hidden"> */}
          <AnimatePresence>
            <motion.div
              layout
              animate={{ opacity: open ? 1 : 0, height: open ? "auto" : 0 }}
              transition={{ duration: 0.2 }}
              initial={{ opacity: 0, height: 0 }}
              exit={{ height: 0, transition: { duration: 0.2 } }}
              key="mobile-menu"
              className="px-2 space-y-1 overflow-hidden bg-white border-b-2 dark:border-slate-600 dark:bg-background-900"
            >
              <div className="py-2">
                {!hideLinks && (
                  <>
                    {navigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        className={`block px-3 py-2 text-base font-medium text-gray-700 rounded-md w-full dark:text-gray-300 hover:bg-background-100 dark:hover:bg-background-700 hover:text-gray-900 ${setActiveClassForPath(
                          matches,
                          item.href,
                          "dark:bg-background-800 dark:text-white bg-white text-gray-700 underline"
                        )} `}
                        onClick={() => navigate(item.href)}
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                    <Menu
                      as="div"
                      className="block w-full text-base font-medium text-gray-700 dark:text-gray-300"
                    >
                      <Menu.Button
                        className="flex items-center justify-center w-full px-3 py-2 rounded-md hover:bg-background-100 dark:hover:bg-background-700"
                        onClick={() => playSound()}
                      >
                        Mais
                        <BsFillCaretDownFill className="ml-1 text-xs transition-transform ui-not-open:rotate-0 ui-open:rotate-180" />
                      </Menu.Button>
                      <Transition
                        enter="transition ease-out duration-150"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="w-full m-auto mt-2 divide-y rounded-md shadow-lg focus:outline-none">
                          <div className="px-1 py-1 ">
                            {moreMenuNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <button
                                    className={`${
                                      active &&
                                      "bg-background-100 dark:bg-background-700"
                                    } group font-medium flex w-full items-center justify-center rounded-md px-2 py-2 text-sm text-gray-700 dark:text-gray-300`}
                                    onClick={() => {
                                      item.external
                                        ? window.open(item.href, "_blank")
                                        : navigate(item.href);
                                    }}
                                  >
                                    {item.name}
                                  </button>
                                )}
                              </Menu.Item>
                            ))}
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </>
                )}
                <div className="flex justify-end px-3 py-2">
                  <ToggleColorMode />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          {/* </Disclosure.Panel> */}
        </>
      )}
    </Disclosure>
  );
}
function ToggleButton({ open }: { open: boolean }) {
  return (
    <svg width="23" height="23" viewBox="-1.5 -1.5 23 23" className="">
      <Path
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          open: { d: "M 3 16.5 L 17 2.5" },
        }}
        animate={open ? "open" : "closed"}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
        animate={open ? "open" : "closed"}
      />
      <Path
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" },
          open: { d: "M 3 2.5 L 17 16.346" },
        }}
        animate={open ? "open" : "closed"}
      />
    </svg>
  );
}

function Path(props: any) {
  return (
    <motion.path
      initial={false}
      fill="transparent"
      strokeWidth="2"
      stroke="currentColor"
      strokeLinecap="round"
      {...props}
    />
  );
}
