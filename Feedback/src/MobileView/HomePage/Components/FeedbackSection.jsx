import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./FeedbackSection.css";
import ProductCards from "./ProductCards";
import ReactModal from "react-modal";
import { FeedbackContext } from "../../../FeedbackContext";
import email from "../../SignUp Page/Components/email.png";
import mobile from "../../SignUp Page/Components/mobile.png";
import password from "../../SignUp Page/Components/password.png";
import user from "../../SignUp Page/Components/user.png";
import toast, { Toaster } from "react-hot-toast";

export default function FeedbackSection() {
  const [suggestionsNo, setSuggestionsNo] = useState(0);
  const [sortBy, setSortBy] = useState("Upvotes");
  const [categories, setCategories] = useState(["All"]);
  const [chosenCategory, setChosenCategory] = useState("All");
  const [modal, setModal] = useState(false);
  const [signUp, setSignUp] = useState(true);
  const [formDataLI, setFormDataLI] = useState({});
  const { isLoggedIn, setIsLoggedIn } = useContext(FeedbackContext);
  useEffect(() => {
    (async () => setSuggestionsNo(await getSuggestionsNo()))();
    (async () => setCategories(await getCategories()))();
    notify(
      "Give us a few seconds while we fetch the products from our servers."
    );
  }, []);
  const handleSelectedCategory = (item) => {
    setChosenCategory(item);
  };
  const notify = (message) => toast(message);
  return (
    <div className="FeedbackSection">
      <ReactModal
        isOpen={modal}
        onRequestClose={() => setModal(false)}
        className="modal"
      >
        <div className="formModal">
          {displayForm(
            isLoggedIn,
            setIsLoggedIn,
            signUp,
            setSignUp,
            notify,
            formDataLI,
            setFormDataLI
          )}
        </div>
      </ReactModal>
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
            {sortBy}
          </span>
        </p>
        <button
          onClick={() => {
            setModal(true);
          }}
        >
          + Add Product
        </button>
      </div>
      <div className="choiceCard">
        <p>Filters:</p>
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
      <ProductCards sortBy={sortBy} chosenCategory={chosenCategory} />
      <Toaster />
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

function displayForm(
  isLoggedIn,
  setIsLoggedIn,
  isSignUp,
  setSignUp,
  notify,
  formDataLI,
  setFormDataLI
) {
  if (isLoggedIn == false) {
    if (isSignUp)
      return (
        <div className="signUpForm">
          <p>Signup to Continue</p>
          <form
            action="https://feedback-d89u.onrender.com/register"
            method="post"
            onChange={(e) =>
              setFormDataLI({ ...formDataLI, [e.target.name]: e.target.value })
            }
            onSubmit={(e) => handleSignUp(e, formDataLI, notify)}
          >
            <div>
              <label htmlFor="name">
                <img src={user} alt="name" />
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                required
              />
            </div>
            <div>
              <label htmlFor="email">
                <img src={email} alt="email" />
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                required
              />
            </div>
            <div>
              <label htmlFor="mobile">
                <img src={mobile} alt="mobile" />
              </label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                placeholder="Mobile"
                required
              />
            </div>
            <div>
              <label htmlFor="password">
                <img src={password} alt="password" />
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                required
              />
            </div>
            <p className="signtext">
              Already have an account?&nbsp;
              <p
                style={{
                  color: "#36416A",
                  textDecorationLine: "underline",
                  cursor: "pointer",
                }}
                onClick={() => setSignUp(false)}
              >
                Log in
              </p>
            </p>
            <button type="submit">Sign Up</button>
          </form>
        </div>
      );
    return (
      <div className="signUpForm">
        <p>Log In to Continue</p>
        <form
          action="https://feedback-d89u.onrender.com/login"
          method="post"
          onChange={(e) =>
            setFormDataLI({ ...formDataLI, [e.target.name]: e.target.value })
          }
          onSubmit={(e) => handleLogIn(e, formDataLI, notify, setIsLoggedIn)}
        >
          <div>
            <label htmlFor="email">
              <img src={email} alt="email" />
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" name="password" id="password">
              <img src={password} alt="password" />
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              required
            />
          </div>
          <p className="signtext">
            Don't have an account?{" "}
            <p
              style={{
                color: "#36416A",
                textDecorationLine: "underline",
                cursor: "pointer",
              }}
              onClick={() => setSignUp(true)}
            >
              Sign Up
            </p>
          </p>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
  return (
    <div>
      <form
        action=""
        method="post"
        className="addProducts"
        onChange={(e) =>
          setFormDataLI({ ...formDataLI, [e.target.name]: e.target.value })
        }
        onSubmit={(e) => handleAddProduct(e, formDataLI, notify)}
      >
        <p>Add your Product</p>
        <input
          type="text"
          name="companyName"
          id="companyName"
          placeholder="Name of the company."
        />
        <input
          type="text"
          name="category"
          id="category"
          placeholder="Category"
        />
        <input
          type="text"
          name="logoURL"
          id="logoURL"
          placeholder="Add logo URL"
        />
        <input
          type="text"
          name="productLink"
          id="productLink"
          placeholder="Link of Product"
        />
        <input
          type="text"
          name="productDescrip"
          id="productDescrip"
          placeholder="Add description"
        />
        <button type="submit">+ Add</button>
      </form>
    </div>
  );
}

async function handleSignUp(e, formDataLI, notify) {
  e.preventDefault();
  console.log(formDataLI);
  try {
    const response = await axios.post(
      "https://feedback-d89u.onrender.com/register",
      formDataLI,
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log(response);
    if (response.data.error) notify(String(response.data.error));
    else notify(String(response.data.Success));
  } catch (e) {
    console.log(e);
  }
}

async function handleLogIn(e, formDataLI, notify, setIsLoggedIn) {
  e.preventDefault();
  try {
    const response = await axios.post(
      "https://feedback-d89u.onrender.com/login",
      formDataLI,
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    if (response.data.error)
      notify(String(response.data.error) + "\n Wrong Email/Password");
    else {
      localStorage.setItem("token", response.data.token);
      setIsLoggedIn(true);
    }
  } catch (e) {
    console.log(e);
  }
}

async function handleAddProduct(e, formDataLI, notify) {
  e.preventDefault();
  try {
    const response = await axios.post(
      "https://feedback-d89u.onrender.com/feedback",
      formDataLI,
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          token: localStorage.getItem("token"),
        },
      }
    );
    if (response.data.error)
      notify(String(response.data.error) + "\n Wrong Email/Password");
    else {
      notify(String(response.data.Success) + "\n Product Successfully Created");
    }
  } catch (e) {
    console.log(e);
  }
}
