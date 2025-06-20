type Details = {
  image: string;
  title: string;
  tag: string;
  tool: string;
  price: number;
  link: string;
};

export default function ProjectCard({
  image,
  title,
  tool,
  price,
  tag,
  link,
}: Details) {
  return (
    <div className="bg-white mx-auto flex w-full max-w-sm flex-col rounded-2xl p-3 shadow">
      <img
        src={image}
        alt={title}
        className="h-full w-full rounded-t-lg object-cover"
      />
      <div className="bg-white flex min-h-[140px] w-full max-w-md flex-col justify-between rounded-2xl p-4 shadow">
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-3 text-2xl font-semibold text-[#223344]">
              {title}
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-gray-400 p-2 text-sm text-gray-500">
                {tool}
              </span>
              <span className="rounded-lg border border-zinc-500 bg-gray-400 p-2 text-sm text-gray-500">
                ${price}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <span className="text-white mb-2 rounded-b-lg bg-[#bdc4c8] px-3 py-2 text-xs font-semibold shadow">
              {tag}
            </span>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-xl bg-[#22333a] p-3 transition hover:bg-[#334466]"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path
                  d="M7 17L17 7M17 7H7M17 7V17"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
