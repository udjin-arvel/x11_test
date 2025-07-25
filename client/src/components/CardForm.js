import React, { useState } from "react";

const API_URL = "http://localhost:8000/api/cards";

function CardForm({ onAdded, amount }) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [cvv, setCvv] = useState("");
  const [saveCard, setSaveCard] = useState(true);

  const [errors, setErrors] = useState({});

  const validate = () => {
    let errs = {};

    if (!amount) errs.amount = "Укажите сумму";
    if (!/^\d{16}$/.test(cardNumber)) errs.cardNumber = "Номер карты должен состоять из 16 цифр";
    if (!/^\d{3}$/.test(cvv)) errs.cvv = "CVV должен состоять из 3 цифр";
    if (!/^\d{2}$/.test(expiryYear) || !/^\d{2}$/.test(expiryMonth)) {
      errs.expiryYear = "Укажите дату XX / XX";
    } else if (Number(expiryMonth) > 12) {
      errs.expiryMonth = "Укажите корректный месяц";
    } else {
      let now = new Date();
      let inputDate = new Date(2000 + Number(expiryYear), Number(expiryMonth));
      if (inputDate <= now) errs.expiryYear = "Эта дата не подходит";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!validate()) return;

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        card_number: cardNumber,
        expiry_year: expiryYear,
        expiry_month: expiryMonth,
        cvv
      })
    })
      .then(async res => {
        if (!res.ok) {
          const data = await res.json();
          setErrors(data);
          return;
        }
        return res.json();
      })
      .then(card => {
        if (card) {
          onAdded(card);
          setCardNumber("");
          setExpiryYear("");
          setExpiryMonth("");
          setCvv("");

          alert("Покупка оплачена картой: " + card.card_number);
        }
      });
  };

  return (
    <div className="flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="relative bg-white w-full"
      >
        <div className="relative flex flex-col md:flex-row h-[232px]">
          <div
            className="bg-[url('./card.png')] bg-no-repeat bg-cover md:absolute top-0 left-0 z-20 md:min-w-[324px] h-[208px] p-[20px] rounded-2xl md:mb-6 shadow flex flex-col gap-2">
            <label htmlFor="number" className="text-white uppercase text-sm pt-5">Номер карты</label>
            <input
              type="text"
              className={
                "bg-white rounded-md border-b-2 p-2 h-[38px] mb-2 outline-none transition " +
                (errors.cardNumber
                  ? "border-red-400"
                  : "border-blue-200 focus:border-blue-500"
                )
              }
              placeholder="Номер карты"
              id="number"
              required
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
              maxLength={16}
              autoFocus
            />

            <label htmlFor="month" className="text-white uppercase text-sm">Действует до</label>

            <div className="flex items-center">
              <input
                type="text"
                className={
                  "bg-white rounded-md border-b-2 p-2 h-[38px] w-[72px] outline-none transition " +
                  (errors.expiryYear || errors.expiryMonth
                    ? "border-red-400"
                    : "border-blue-200 focus:border-blue-500"
                  )
                }
                id="month"
                placeholder="ММ"
                required
                value={expiryMonth}
                maxLength={2}
                onChange={e => setExpiryMonth(e.target.value)}
              />
              <span className="text-white text-lg px-2">/</span>
              <input
                type="text"
                className={
                  "bg-white rounded-md border-b-2 p-2 h-[38px] w-[72px] outline-none transition " +
                  (errors.expiryYear
                    ? "border-red-400"
                    : "border-blue-200 focus:border-blue-500"
                  )
                }
                id="year"
                placeholder="ГГ"
                required
                value={expiryYear}
                maxLength={2}
                onChange={e => setExpiryYear(e.target.value)}
              />
            </div>
          </div>

          <div className="relative md:absolute flex flex-col md:items-end right-0 top-[-54px] md:top-[5px] z-10 w-full p-[20px] h-[198px] bg-gray-200 rounded-2xl">
            <div className="md:absolute top-[20px] right-0 md:bg-custom-smoke w-full h-[40px]"></div>

            <div className="flex flex-col">
              <label htmlFor="cvv" className="text-custom-gray uppercase text-sm pt-2 md:pt-[54px] pb-2">CVV / CVC</label>

              <div className="flex md:flex-col gap-2">
                <input
                  type="text"
                  className={
                    "w-[72px] rounded-md border p-2 h-[38px] text-base outline-none transition " +
                    (errors.cvv
                      ? "border-red-400"
                      : "border-gray-300 focus:border-blue-400"
                    )
                  }
                  placeholder="000"
                  id="cvv"
                  required
                  value={cvv}
                  onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                  maxLength={3}
                />
                <div className="w-[128px] text-custom-gray text-[12px] md:text-[10px]">три цифры с обратной стороны карты</div>
              </div>
            </div>
          </div>
        </div>

        {Object.keys(errors)?.length > 0 && (
          <div className="hidden md:flex flex-col gap-2 mb-6">
            {Object.values(errors).map(error => (
              <p className="text-xs text-red-500">- {error}</p>
            ))}
          </div>
        )}

        <div className="flex mb-6 pt-[100px] md:pt-0">
          <input
            type="checkbox"
            id="remember"
            checked={saveCard}
            onChange={e => setSaveCard(e.target.checked)}
            className="mr-2 accent-blue-500 w-[20px] h-[20px]"
          />
          <label htmlFor="remember" className="text-gray-500 text-sm flex flex-wrap">
            Запомнить эту карту. Это безопасно.
            <span className="px-1" title="Условный tooltip">
              <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M0.833313 10.1387C0.833313 5.07607 4.93737 0.972015 9.99998 0.972015C15.0626 0.972015 19.1666 5.07607 19.1666 10.1387C19.1666 15.2013 15.0626 19.3053 9.99998 19.3053C4.93737 19.3053 0.833313 15.2013 0.833313 10.1387ZM9.99998 2.63868C5.85784 2.63868 2.49998 5.99655 2.49998 10.1387C2.49998 14.2808 5.85784 17.6387 9.99998 17.6387C14.1421 17.6387 17.5 14.2808 17.5 10.1387C17.5 5.99655 14.1421 2.63868 9.99998 2.63868Z"
                      fill="#C7C9D9"/>
                <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M9.99998 5.97201C10.4602 5.97201 10.8333 6.34511 10.8333 6.80535V10.1387C10.8333 10.5989 10.4602 10.972 9.99998 10.972C9.53974 10.972 9.16665 10.5989 9.16665 10.1387V6.80535C9.16665 6.34511 9.53974 5.97201 9.99998 5.97201Z"
                      fill="#C7C9D9"/>
                <path
                  d="M10.8333 13.472C10.8333 13.9323 10.4602 14.3053 9.99998 14.3053C9.53974 14.3053 9.16665 13.9323 9.16665 13.472C9.16665 13.0118 9.53974 12.6387 9.99998 12.6387C10.4602 12.6387 10.8333 13.0118 10.8333 13.472Z"
                  fill="#C7C9D9"/>
              </svg>
            </span>
            <span className="w-full">Сохраняя карту, вы соглашаетесь с условиями привязки карты.</span>
          </label>
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-full md:w-[141px] py-3 font-semibold text-lg transition"
          type="submit"
        >
          Оплатить
        </button>
      </form>
    </div>
  );
}

export default CardForm;
