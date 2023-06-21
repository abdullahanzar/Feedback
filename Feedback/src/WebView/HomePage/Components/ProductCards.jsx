import axios from "axios";
import React, { useEffect, useState } from "react";
import "./ProductCards.css";

export default function ProductCards(props) {
  const [cards, setCards] = useState([]);
  useEffect(() => {
    (async () =>
      setCards(await getCards(props.chosenCategory, props.sortBy)))();
  }, [props.chosenCategory]);
  useEffect(() => {
    const sorted = sortCards(cards, props.sortBy);
    setCards([...sorted]);
  }, [props.sortBy]);
  return <>{displayCards(cards)}</>;
}

async function getCards(category, sortBy) {
  const cards = await axios.get("https://feedback-d89u.onrender.com/feedback");
  if (category == "All") return sortCards(cards.data, sortBy);
  const filteredCard = cards.data.filter((item) =>
    item.category.includes(category)
  );
  return sortCards(filteredCard, sortBy);
}

function sortCards(cards, sortBy) {
  if (sortBy == "Upvotes") {
    cards.sort((a, b) => b.upVotes - a.upVotes);
    return cards;
  }
  if (sortBy == "Comments") {
    cards.sort((a, b) => b.comments.length - a.comments.length);
    return cards;
  }
}

function displayCards(cards) {
  return (
    <div className="cards">
      {cards.map((item, key) => {
        return (<>
          <div className="card" key={key}>
            <img src={`${item.logoURL}`} alt={"image"} />
            <p>{item.companyName}</p>
            <p>{item.productDescrip}</p>
            {item.category.map((item, key) => (
              <button key={key}>{item}</button>
            ))}
            <button className="upvotes" onClick={()=>handleUpVote(item.companyName)}><span>^</span><span>{item.upVotes}</span></button>
          </div>
          </>
        );
      })}
    </div>
  );
}

async function handleUpVote(companyName) {
  try {
    const upVote = await axios.post('https://feedback-d89u.onrender.com/upvote', {
      companyName: companyName,
    })
    console.log(upVote)
  } catch(e) {
    console.log(e)
  }
}
