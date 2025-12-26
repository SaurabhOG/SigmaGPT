import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import { v1 as uuidv1 } from "uuid";
function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/thread");
      const res = await response.json();
      const filterData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      // console.log(filterData);
      setAllThreads(filterData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);

    try {
      const response = await fetch(
        `http://localhost:8080/api/thread/${newThreadId}`
      );
      const res = await response.json();
      console.log(res);
      setPrevChats(res);
      setNewChat(false);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <section className="sidebar">
      <button onClick={createNewChat}>
        <img
          src="src/assets/blacklogo.png"
          alt="gpt logo"
          className="logo"
        ></img>
        <i className="fa-solid fa-pen-to-square"></i>
      </button>

      {/* history */}

      <ul className="history">
        {allThreads?.map((thread, idx) => (
          <li key={idx} onClick={(e) => changeThread(thread.threadId)}>
            {thread.title}
          </li>
        ))}
      </ul>

      {/* sign */}
      <div className="sign">
        <p>
          By SaurabhOG <span>&hearts;</span>
        </p>
      </div>
    </section>
  );
}

export default Sidebar;
