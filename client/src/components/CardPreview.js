import React from "react";

function CardPreview({ card, setCurrentCard, isActive }) {
  return (
    <div
      className={`bg-blue-400 rounded-2xl w-[116px] min-h-[85px] px-4 py-2 flex flex-col justify-center shadow-sm ${isActive && 'border-2 border-blue-600'}`}
      role="button"
      onClick={() => setCurrentCard(!isActive ? card : {})}
    >
      <div className="flex items-center">
        <span className="text-nowrap text-white text-[10px] mr-2 tracking-widest">● ● ● ●</span>
        <span className="text-white">{card.card_number.slice(-4)}</span>
      </div>
      <span className="text-sm text-white">{card.expiry_month} / {card.expiry_year}</span>
    </div>
  );
}

export default CardPreview;
