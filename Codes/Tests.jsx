import React, { useEffect, useState } from "react";
import { Button, Input, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { useTranslation } from "react-i18next";
import { tgBot } from "../Utils/tgBot";

export default function Test({ tests, type }) {
  const [user, setUser] = useState("");
  const [modal, setModal] = useState(false);
  const [completeModal, setCompleteModal] = useState(false);
  const [time, setTime] = useState(30000 * 60);
  const [result, setResult] = useState({});
  const [text, setText] = useState({});
  const [ctx] = useTranslation("global");
  const navigate = useNavigate();

  const right = Object.keys(result).length;

  useEffect(() => {
    setUser(localStorage.getItem("userNameOfIbs"));
    if (user === "") toggle();
  }, []);

  useEffect(() => {
    if (user !== "" && !modal) {
      setInterval(() => {
        setTime((p) => p - 1000);
      }, 1000);
    }
  }, [user, modal]);

  const formatTime = (time) => {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    return (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;
  };

  const toggle = () => setModal(!modal);

  const toggleComplete = () => setCompleteModal(!completeModal);

  const checker = (test, answerIndex, testIndex) => {
    test.choices.map(() => {
      setText((p) => {
        return { ...p, [testIndex]: test.choices[answerIndex - 1] };
      });
      if (answerIndex === test.answerIndex) {
        setResult((p) => {
          return { ...p, [testIndex]: true };
        });
      } else {
        setResult((p) => {
          delete p[testIndex];
          return p;
        });
      }
    });
  };

  const complete = () => {
    navigate("/tests");
    setResult({});
    setText({});
    toggleComplete();
    const text = `<blockquote>Test - ${type}</blockquote>\n👤 Name: <b>${user}</b>\n🏆 Score: <b>${
      right + " from " + tests.length
    }</b>\n🎓 Level: ${getLevel()}`;
    tgBot(text, "HTML");
  };

  const getPercent = () => {
    return parseInt((right / tests.length) * 100);
  };

  const getLevel = () => {
    if (getPercent() >= 0 && getPercent() < 35) return "Grade Level";
    else if (getPercent() >= 35 && getPercent() < 70)
      return "Instructional Level";
    else if (getPercent() >= 70 && getPercent() < 100) return "Ability Level";
  };

  const saveUser = (e) => {
    setUser(e);
    localStorage.setItem("userNameOfIbs", e);
  };

  return (
    <TestsBlock>
      <div className="head">
        <div onClick={toggle} className="name">
          <img
            src={require("../Assets/Animated-Icons/Wave.gif")}
            className="icon"
          />
          <b>{user}</b>
        </div>
        <div>
          <b>{type}</b>
          <b>
            {ctx("tests.time")} -{" "}
            <span>{formatTime(Math.floor(time / 1000))}</span>
          </b>
        </div>
      </div>
      <div className="tests">
        {tests.map((test, index) => (
          <div key={index} className="testCard">
            <img
              src={require("../Assets/Animated-Icons/Quiz.gif")}
              className="icon"
            />
            <div className="quiz">
              <h3>
                <q>{index + 1}</q>{" "}
                <span
                  dangerouslySetInnerHTML={{
                    __html: text[index + 1]
                      ? test.question.replace(
                          "....",
                          `<mark>${text[index + 1]}</mark>`
                        )
                      : test.question,
                  }}
                ></span>
              </h3>
            </div>
            {test.choices.map((answer, i) => (
              <label
                className="answer"
                htmlFor={answer + i + test.question}
                onClick={() => checker(test, i + 1, index + 1)}
                key={i}
              >
                <input
                  type="radio"
                  id={answer + i + test.question}
                  name={test.question}
                />
                <b>{answer}</b>
              </label>
            ))}
          </div>
        ))}
      </div>
      <Button onClick={toggleComplete}>{ctx("tests.end")}</Button>
      <Modal
        open={modal}
        title={ctx("tests.nameForm")}
        cancelButtonProps={{ style: { display: "none" } }}
        closable={false}
        onOk={user !== "" ? toggle : null}
      >
        <Input value={user} onChange={(e) => saveUser(e.target.value)} />
      </Modal>
      <Modal
        open={completeModal}
        title={ctx("tests.result")}
        onOk={complete}
        closable={false}
        cancelButtonProps={{ style: { display: "none" } }}
        className="newsModal"
      >
        <img
          src={require("../Assets/Animated-Icons/Award.gif")}
          className="icon lg-icon"
        />
        <h1>
          From {tests.length} quizes {right} correct answer
        </h1>
        <h1>It consists of {getPercent()}%</h1>
        <h1>{getLevel()}</h1>
      </Modal>
    </TestsBlock>
  );
}

const TestsBlock = styled.div`
  .head {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 50px;
    .name {
      cursor: pointer;
    }
    div {
      display: flex;
      align-items: center;
      justify-content: start;
      gap: 15px;
      b {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: pre;
        display: flex;
        align-items: center;
        span {
          animation: time 1s ease-in infinite;
          @keyframes time {
            50% {
              color: red;
            }
          }
        }
      }
    }
  }
  .tests {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    padding: 10px 50px;
    gap: 50px;
    .testCard {
      display: flex;
      flex-direction: column;
      width: 48%;
      border-radius: 20px;
      background: #fffcf5;
      box-shadow: 0px 18px 50px -10px #c38c002c;
      padding: 20px;
      position: relative;
      .quiz {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        mark {
          border-radius: 10px;
          color: #1f1f1f;
          padding: 0 5px;
        }
      }
      .answer {
        width: 100%;
        height: 45px;
        background: #fffcf5;
        padding: 10px;
        margin: 10px 0;
        border-radius: 10px;
        border: 2px dashed gold;
        cursor: pointer;
        display: flex;
        align-items: center;
        b {
          margin-left: 10px;
        }
        input[type="radio"]:checked {
          accent-color: #fff;
          mix-blend-mode: screen;
        }
        &:has(> input:checked) {
          background: gold;
          color: #fff;
        }
      }
      &::before,
      &::after {
        content: "";
        z-index: -1;
        position: absolute;
        width: 200px;
        height: 200px;
        border-radius: 20px;
        background: gold;
        background: #fffcf5;
        border: 2px solid #fff;
        box-shadow: 0px 18px 50px -10px #c38c002c;
        transition: 0.3s;
      }
      &::before {
        top: 0;
        right: 0;
        transform: translate(20px, -20px);
      }
      &::after {
        bottom: 0;
        left: 0;
        transform: translate(-20px, 20px);
      }
    }
  }
  button {
    display: block;
    height: 45px;
    padding: 0 50px;
    font-size: 20px;
    background: #fffde7;
    border-radius: 10px;
    margin: 25px auto;
    border: 1px dashed gold !important;
    i {
      margin-left: 7px;
    }
    &:hover {
      background: gold !important;
      border: gold;
      color: #fff !important;
    }
    &:active {
      transform: scale(1.05);
      border: 1px solid gold !important;
    }
  }
  @media screen and (max-width: 720px) {
    .head {
      flex-wrap: wrap;
      gap: 20px;
      div {
        width: 100%;
        justify-content: center;
      }
    }
    .tests {
      padding: 20px;
      .testCard {
        width: 100%;
        .quiz {
          font-size: 15px;
        }
        .answer {
          b {
            font-size: 15px;
          }
        }
      }
    }
  }
`;
