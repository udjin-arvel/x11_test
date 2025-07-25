import React, { useState } from "react";

function CurrencyInput({ value, onChange, currency, onCurrencyChange, currencies }) {
  const [amountRub, setAmountRub] = useState(value);
  const [amountUsd, setAmountUsd] = useState(value);
  const [isDollarFirst, setIsDollarFirst] = useState(true);
  const [open, setOpen] = useState(false);
  const EXCHANGE_RATE = 15;

  const handleCurrencyClick = () => setOpen(v => !v);

  const handleSelect = id => {
    setOpen(false);
    onCurrencyChange(id);
    setIsDollarFirst(prev => !prev);
  };

  const handleAmountChange = (e, isDollar) => {
    const newAmount = e.target.value;

    setAmountUsd(isDollar ? newAmount : Math.round(newAmount / EXCHANGE_RATE));
    setAmountRub(isDollar ? newAmount * EXCHANGE_RATE : newAmount);
    onChange(amountRub);
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-md w-full">
      <div className="relative border-r">
        <input
          type="text"
          className="w-full rounded-l-md py-2 pl-4 pr-12 border-0 focus:ring-2 focus:ring-blue-400 text-lg"
          value={isDollarFirst ? amountUsd : amountRub}
          onChange={e => handleAmountChange(e, isDollarFirst)}
          placeholder="0000.00"
        />
        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xl">
          {isDollarFirst
            ? currencies[0]['icon']
            : currencies[1]['icon']
          }
        </span>
      </div>

      <div className="relative">
        <input
          type="text"
          className="w-full rounded-r-md py-2 pl-4 pr-12 border-0 focus:ring-2 focus:ring-blue-400 text-lg"
          value={isDollarFirst ? amountRub : amountUsd}
          onChange={e => handleAmountChange(e, !isDollarFirst)}
          placeholder="0000.00"
        />
        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xl">
          {isDollarFirst
            ? currencies[1]['icon']
            : currencies[0]['icon']
          }
        </span>
      </div>

      <div className="relative flex items-center">
        <button
          type="button"
          className="flex items-center px-3 h-12 border-l border-gray-200 rounded-r-md hover:bg-blue-50 transition relative z-10"
          onClick={handleCurrencyClick}
        >
          <span className="text-lg">{currency.icon}</span>
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8.20711 10.1387C7.76165 10.1387 7.53857 10.6772 7.85355 10.9922L11.6464 14.7851C11.8417 14.9804 12.1583 14.9804 12.3536 14.7851L16.1464 10.9922C16.4614 10.6772 16.2383 10.1387 15.7929 10.1387H8.20711Z"
              fill="#8F90A6"/>
          </svg>
        </button>
        {open && (
          <ul className="absolute right-0 top-12 bg-white border border-gray-200 rounded-md shadow-md z-20 w-32">
            {currencies.map(c => (
              <li
                key={c.id}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-700"
                onClick={() => handleSelect(c.id)}
              >
                {c.icon}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CurrencyInput;
