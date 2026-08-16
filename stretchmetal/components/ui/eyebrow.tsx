// Numbered section label — the signature STRETCH eyebrow: red bold number +
// tracked uppercase grey label. On dark sections the number uses the brighter
// red (#e00000 fails AA at 13px on black) and the label lightens.
type EyebrowProps = {
  num?: string;
  label: string;
  tone?: 'light' | 'dark';
};

export default function Eyebrow({ num, label, tone = 'light' }: EyebrowProps) {
  return (
    <div className="eyebrow mb-[18px] flex items-center gap-[13px]">
      {num ? (
        <span
          className={`text-[13px] font-bold tracking-[0.16em] ${
            tone === 'dark' ? 'text-red-bright' : 'text-red'
          }`}
        >
          {num}
        </span>
      ) : (
        <span className="inline-block h-[2px] w-[34px] bg-red" aria-hidden />
      )}
      <span
        className={`text-[12.5px] font-bold uppercase tracking-[0.2em] ${
          tone === 'dark' ? 'text-on-dark-muted' : 'text-text-faint'
        }`}
      >
        {label}
      </span>
    </div>
  );
}
