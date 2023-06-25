import axios from "axios";
import React, { useEffect, useState } from "react";
import "./ProductCards.css";
import commentImage from "./commentIcon.png";
import commentButton from "./commentButton.png";
import sendComment from "./sendComment.png";

export default function ProductCards(props) {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [comment, setComment] = useState("");
  useEffect(() => {
    (async () =>
      setCards(await getCards(props.chosenCategory, props.sortBy)))();
  }, [props.chosenCategory]);
  useEffect(() => {
    const sorted = sortCards(cards, props.sortBy);
    setCards([...sorted]);
  }, [props.sortBy]);
  async function handleUpVote(companyName) {
    try {
      const upVote = await axios.post(
        "https://feedback-d89u.onrender.com/upvote",
        {
          companyName: companyName,
        },
        {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        }
      );
      setCards(await getCards(props.chosenCategory, props.sortBy));
    } catch (e) {
      console.log(e);
    }
  }
  function handleComment(companyName) {
    setSelectedCard(companyName);
    setComment("");
  }
  async function postComment(companyName) {
    try {
      await axios.post(
        "https://feedback-d89u.onrender.com/comment",
        {
          companyName: companyName,
          comment: comment,
        },
        {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        }
      );
      setCards(await getCards(props.chosenCategory, props.sortBy));
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <>
      {displayCards(
        cards,
        handleUpVote,
        handleComment,
        selectedCard,
        setComment,
        postComment
      )}
    </>
  );
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

function displayCards(
  cards,
  handleUpVote,
  handleComment,
  selectedCard,
  setComment,
  postComment
) {
  return (
    <div className="cards">
      {cards.map((item, key) => {
        return (
          <div key={key}>
            <div className="card" key={key}>
              <img src={`${item.logoURL}`} alt={"image"} className="logo"/>
              <p>{item.companyName}</p>
              <p>{item.productDescrip}</p>
              <div
                className="cardContainer"
                onClick={() => {
                  handleComment(null);
                }}
              >
                {item.category.map((item, key) => (
                  <button key={key}>{item}</button>
                ))}
              </div>
              <div
                className="commentButton"
                onClick={() => {
                  handleComment(item.companyName);
                }}
              >
                <img src={commentButton} alt="comment" />
                &nbsp;&nbsp;&nbsp;Comment
              </div>
              <button
                className="upvotes"
                onClick={() => handleUpVote(item.companyName)}
              >
                <span>^</span>
                <span>{item.upVotes}</span>
              </button>
              <div className="comment">
                {item.comments.length}
                <img src={commentImage} alt="Comment" />
              </div>
            </div>
            {selectedCard === item.companyName && (
              <div className="commentSection">
                <input
                  type="text"
                  placeholder="Add a comment"
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key == "Enter") {
                      postComment(item.companyName);
                      setComment("");
                      e.target.value = "";
                    }
                  }}
                />
                <img
                  src={sendComment}
                  alt="Send"
                  onClick={() => {
                    postComment(item.companyName);
                    setComment("");
                  }}
                />
                <div className="previousComments">
                  {item.comments.map((item, key) => {
                    return (
                      <ul key={key}>
                        <li>{item}</li>
                      </ul>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
