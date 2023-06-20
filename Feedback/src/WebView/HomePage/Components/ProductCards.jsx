import axios from "axios";
import React, { useEffect, useState } from "react";

export default function ProductCards(props) {
  const [cards, setCards] = useState([]);
  useEffect(() => {
    getCards(props.chosenCategory, "s");
  }, [props.chosenCategory]);
  return <div className="productCards"></div>;
}

async function getCards(category, sortBy) {
  const cards = await axios.get("https://feedback-d89u.onrender.com/feedback");
  if (category == 'All') return cards;
  const filteredCard = cards.data.filter((item) =>
    item.category.includes(category)
  );
  return filteredCard;
}
