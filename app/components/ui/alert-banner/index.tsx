import { IoWarning } from "react-icons/io5";
import { MdLiveTv } from "react-icons/md";
import { cn } from "~/lib/utils/cn";

const style = {
  default: {
    bgColor: "bg-brand-100 dark:bg-brand-950",
    borderColor: "border-brand",
    icon: (
      <div className="py-1">
        <svg
          className="w-6 h-6 mr-4 fill-current text-brand-500 dark:text-brand-300"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
        </svg>
      </div>
    ),
    textColor: "text-brand-500 dark:text-brand-300",
    bannerSize: "w-full max-w-2xl mx-auto",
    textDirection: "text-left",
  },
  warning: {
    bgColor: "dark:bg-transparent bg-white",
    borderColor: "border-yellow-400",
    icon: (
      <IoWarning className="w-10 h-10 mb-4 text-yellow-400 fill-current dark:text-yellow-300 md:mb-0 md:w-8 md:h-8 md:mr-6 md:block " />
    ),
    textColor: "dark:text-white text-gray-800",
    bannerSize: "w-full max-w-2xl mx-auto",
    textDirection: "text-left",
  },
  streaming: {
    bgColor: "dark:bg-transparent bg-white",
    borderColor: "border-red-500",
    icon: (
      <MdLiveTv className="w-10 h-10 mb-4 text-red-500 fill-current dark:text-red-300 md:mb-0 md:w-8 md:h-8 md:mr-6 md:block " />
    ),
    textColor: "dark:text-white text-gray-800",
    bannerSize: "w-full max-w-2xl",
    textDirection: "text-center md:text-left",
  },
};

function AlertBanner({
  title,
  subtitle,
  type = "default",
  className,
  titleMargin,
}: {
  title: string;
  subtitle: React.ReactNode;
  type?: "default" | "warning" | "streaming";
  className?: string;
  titleMargin?: string;
}) {
  const textColor = style[type].textColor;
  const bgColor = style[type].bgColor;
  const borderColor = style[type].borderColor;
  const icon = style[type].icon;
  const bannerSize = style[type].bannerSize;
  const textDirection = style[type].textDirection;

  return (
    <div
      className={cn(
        "px-4 py-3 mb-8 -mt-8 border rounded shadow-md",
        bgColor,
        borderColor,
        bannerSize,
        className,
      )}
    >
      <div className="flex flex-col items-center md:flex-row">
        {icon}
        <div className="flex-1">
          <div
            className={cn("font-bold", textColor, textDirection, titleMargin)}
          >
            {title}
          </div>
          <div className={cn("text-sm", textColor, textDirection)}>
            {subtitle}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlertBanner;
