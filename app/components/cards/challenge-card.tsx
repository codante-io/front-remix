import type { ChallengeCardInfo } from "~/models/challenge.server";
import CardItemDifficulty from "./card-item-difficulty";
import CardItemDuration from "./card-item-duration";
import CardItemTag from "./card-item-tag";

export default function ChallengeCard({
  challenge,
}: {
  challenge: ChallengeCardInfo;
}) {
  return (
    <article className="mx-auto w-[300px] bg-white dark:bg-neutral-900 shadow-md rounded-2xl p-6 pt-3 font-lexend border-[1.5px] border-gray-300 dark:border-slate-600">
      <CardItemDifficulty className="mb-3" difficulty={challenge.difficulty} />
      <div className="p-16 bg-purple-200 dark:bg-purple-900 h-32 rounded-2xl flex items-center justify-center mb-6">
        <img src="/img/keyboard-icon.png" className=" inline-block" alt="" />
      </div>
      <div className="card-header mb-8">
        <h2 className="font-bold text-lg text-slate-800 dark:text-white mb-1">
          {challenge.name}
        </h2>
        <div className="tags">
          {challenge.tags.map((tag) => (
            <CardItemTag
              key={tag}
              tagName={tag}
              className="dark:bg-zinc-600 dark:text-zinc-900"
            />
          ))}
        </div>
      </div>
      <p className="slate-600 font-light text-sm mb-12 text-slate-600 dark:text-zinc-400">
        {challenge.short_description}
      </p>
      <div className="card-footer flex items-center justify-between">
        <div className="text-xs text-zinc-400">
          {challenge.enrolled_users_count} pessoas
        </div>
        <CardItemDuration durationString="3h30" />
      </div>
    </article>
  );
}
