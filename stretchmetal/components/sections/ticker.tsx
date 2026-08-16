// Red marquee band — the one large red fill the identity allows besides
// primary buttons. Content is duplicated so the -50% translate loops
// seamlessly; the duplicate is aria-hidden and reduced-motion freezes the
// animation via globals.css.
type TickerProps = { items: string[] };

function Row({ items, hidden }: { items: string[]; hidden?: boolean }) {
  return (
    <div className="flex items-center" aria-hidden={hidden}>
      {items.map((item, i) => (
        <span
          key={i}
          className="wdth-125 flex items-center gap-6 whitespace-nowrap px-6 text-[15px] font-black uppercase tracking-[0.08em]"
        >
          {item}
          <span className="h-[8px] w-[8px] bg-white" aria-hidden />
        </span>
      ))}
    </div>
  );
}

export default function Ticker({ items }: TickerProps) {
  return (
    <div className="overflow-hidden border-y-2 border-black bg-red py-4 text-white">
      <div className="ticker-track">
        <Row items={items} />
        <Row items={items} hidden />
      </div>
    </div>
  );
}
