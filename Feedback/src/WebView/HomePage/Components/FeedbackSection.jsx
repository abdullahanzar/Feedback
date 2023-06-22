import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FeedbackSection.css";
import ProductCards from "./ProductCards";

export default function FeedbackSection() {
  const [suggestionsNo, setSuggestionsNo] = useState(0);
  const [sortBy, setSortBy] = useState("Upvotes");
  const [categories, setCategories] = useState(["All"]);
  const [chosenCategory, setChosenCategory] = useState("All");
  useEffect(() => {
    (async () => setSuggestionsNo(await getSuggestionsNo()))();
    (async () => setCategories(await getCategories()))();
  }, []);
  const handleSelectedCategory = (item) => {
    setChosenCategory(item);
  };
  return (
    <div className="FeedbackSection">
      <div className="banner">
        <p>Feedback</p>
        <p>Apply Filter</p>
      </div>
      <div className="suggestions">
        <p>
          <span>{suggestionsNo}&nbsp;</span>Suggestions
        </p>
        <p>
          Sort by:{" "}
          <span
            onClick={() => {
              if (sortBy == "Upvotes") setSortBy("Comments");
              if (sortBy == "Comments") setSortBy("Upvotes");
            }}
          >
            {sortBy} &#11205;
          </span>
        </p>
        <button>+ Add Product</button>
      </div>
      <div className="choiceCard">
        {categories.map((item, key) => {
          return (
            <button
              id={key}
              key={key}
              onClick={() => handleSelectedCategory(item)}
              className={chosenCategory == item ? "selected" : ""}
            >
              {item}
            </button>
          );
        })}
      </div>
      <ProductCards sortBy={sortBy} chosenCategory={chosenCategory}/>
    </div>
  );
}

async function getSuggestionsNo() {
  const products = await axios.get(
    "https://feedback-d89u.onrender.com/feedback"
  );
  return products.data.length;
}

async function getCategories() {
  const products = await axios.get(
    "https://feedback-d89u.onrender.com/feedback"
  );
  const categories = products.data.reduce((accumulator, item) => {
    accumulator.push(...item.category);
    return accumulator;
  }, []);
  let uniqueCategories = categories.filter(
    (item, index) => categories.indexOf(item) === index
  );
  uniqueCategories = ["All", ...uniqueCategories];
  return uniqueCategories;
}
