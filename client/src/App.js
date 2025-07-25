import React, { useState, useEffect } from "react";
import CardPreview from "./components/CardPreview";
import CardForm from "./components/CardForm";
import CurrencyInput from "./components/CurrencyInput";

const API_URL = "http://localhost:8000/api/cards";

const currencyList = [
  { id: "RUB", icon: <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.2301 15.2189V18.472H8.72564V15.2189H8.485C7.0055 15.2189 5.72802 14.7703 4.65256 13.8731C3.58304 12.9699 3.04828 11.8499 3.04828 10.513C3.04828 10.3348 3.05422 10.1387 3.0661 9.92477C3.07799 9.70493 3.09581 9.51182 3.11958 9.34545L5.62404 9.64848L5.58839 10.0496C5.5765 10.1862 5.57056 10.3199 5.57056 10.4506C5.57056 11.2468 5.86765 11.9153 6.46183 12.456C7.06194 12.9907 7.81655 13.2581 8.72564 13.2581V7.40249C7.35309 7.40249 6.30437 7.16482 5.57947 6.68948C4.85458 6.2082 4.49213 5.5338 4.49213 4.66631C4.49213 3.75127 4.85755 3.04717 5.58839 2.55401C6.31922 2.0549 7.36498 1.80534 8.72564 1.80534H11.2301V5.40606C13.0067 5.40606 14.403 5.86654 15.419 6.78752C16.4351 7.70849 16.9431 8.96815 16.9431 10.5665C16.9431 11.9985 16.4291 13.1333 15.4012 13.9711C14.3792 14.803 12.9889 15.2189 11.2301 15.2189ZM8.72564 3.63244C8.04234 3.63244 7.54917 3.71265 7.24614 3.87308C6.94905 4.02757 6.80051 4.26227 6.80051 4.57718C6.80051 4.88021 6.96094 5.09411 7.28179 5.21889C7.60859 5.34367 8.08987 5.40606 8.72564 5.40606V3.63244ZM11.2301 7.42032V13.2581C12.2164 13.2581 12.9889 13.0115 13.5474 12.5184C14.1059 12.0252 14.3852 11.3627 14.3852 10.5308C14.3852 9.48508 14.1297 8.70671 13.6187 8.19572C13.1136 7.67878 12.3174 7.42032 11.2301 7.42032Z" fill="#8F90A6"/></svg> },
  { id: "USD", icon: <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.4601 11.6462C15.0405 11.6462 16.7051 9.47915 16.7051 6.87235C16.7051 4.26555 15.0405 2.09846 11.4601 2.09846H5.83817V9.91885H3.29418V11.6462H5.83817V13.1538H3.29418V14.8812H5.83817V18.1789H7.78541V14.8812H11.3344V13.1538H7.78541V11.6462H11.4601ZM7.78541 9.91885V3.82585H11.4601C13.7214 3.82585 14.7892 5.11355 14.7892 6.87235C14.7892 8.63116 13.7214 9.91885 11.4601 9.91885H7.78541Z" fill="#8F90A6"/><path fill-rule="evenodd" clip-rule="evenodd" d="M5.54581 1.80534H11.4608C13.3114 1.80534 14.7037 2.36685 15.6337 3.30105C16.5621 4.23373 16.9989 5.507 16.9989 6.87232C16.9989 8.23764 16.5621 9.51091 15.6337 10.4436C14.7037 11.3778 13.3114 11.9393 11.4608 11.9393H8.07924V12.8607H11.6283V15.1742H8.07924V18.472H5.54581V15.1742H3.00183V12.8607H5.54581V11.9393H3.00183V9.62573H5.54581V1.80534ZM5.83817 2.09846H11.4601C15.0405 2.09846 16.7051 4.26555 16.7051 6.87235C16.7051 9.47915 15.0405 11.6462 11.4601 11.6462H7.78541V13.1538H11.3344V14.8812H7.78541V18.1789H5.83817V14.8812H3.29418V13.1538H5.83817V11.6462H3.29418V9.91885H5.83817V2.09846ZM8.07924 4.11891V9.62573H11.4608C12.5361 9.62573 13.2865 9.3206 13.7676 8.84639C14.2489 8.372 14.4969 7.69272 14.4969 6.87232C14.4969 6.05192 14.2489 5.37264 13.7676 4.89825C13.2865 4.42404 12.5361 4.11891 11.4608 4.11891H8.07924ZM7.78541 9.91885H11.4601C13.7214 9.91885 14.7892 8.63116 14.7892 6.87235C14.7892 5.11355 13.7214 3.82585 11.4601 3.82585H7.78541V9.91885Z" fill="#8F90A6"/></svg> },
];

function App() {
  const [cards, setCards] = useState([]);
  const [showCardForm, setShowCardForm] = useState(false);
  const [currentCard, setCurrentCard] = useState({});

  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState(currencyList[0]);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(setCards);
  }, []);

  const handleCurrencyChange = id => {
    const c = currencyList.find(cur => cur.id === id);
    setCurrency(c);
    setAmount(value => {
      if (!value) return "";
      if (id === "RUB") return Math.round(Number(value) * 15);
      if (id === "USD") return Math.round(Number(value) / 15);
      return value;
    });
  };

  const handleCardAdded = card => {
    setCards(prev => [...prev, card]);
    setShowCardForm(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-10 w-full max-w-xl flex flex-col">
        <h2 className="text-2xl font-semibold mb-2">Пополнить банковской картой</h2>
        <div className="text-gray-500 mb-6 uppercase">Укажите сумму</div>
        <div className="mb-8">
          <CurrencyInput
            value={amount}
            onChange={setAmount}
            currency={currency}
            onCurrencyChange={handleCurrencyChange}
            currencies={currencyList}
          />
        </div>

        <div className="flex flex-wrap gap-4 w-full items-end mb-8">
          <div className={Object.keys(cards).length > 0 ? 'flex flex-wrap gap-4' : 'hidden'}>
            {cards.map(card => (
              <CardPreview
                key={card.id}
                card={card}
                isActive={currentCard.id === card.id}
                setCurrentCard={setCurrentCard}
              />
            ))}
          </div>
          <button
            className="flex flex-col items-center bg-blue-50 hover:bg-blue-400 hover:text-white border-2 border-blue-400 text-custom-gray gap-1 p-[12px] rounded-2xl font-medium transition"
            onClick={() => { setCurrentCard({}); setShowCardForm(true); }}
            title="Добавить новую карту"
          >
            <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 5.97201V22.3053" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round"/>
              <path d="M5.83331 14.1387H22.1666" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round"/>
            </svg>
            <span className="text-nowrap">Новая карта</span>
          </button>
        </div>

        {showCardForm
          ? <CardForm onAdded={handleCardAdded} amount={amount} />
          : <button
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-full md:w-[141px] py-3 font-semibold text-lg disabled:opacity-50 transition"
              disabled={!amount || !currentCard.id}
              onClick={() => alert("Покупка оплачена картой: " + currentCard.card_number)}
            >
              Оплатить
            </button>
        }
      </div>
    </div>
  );
}

export default App;
