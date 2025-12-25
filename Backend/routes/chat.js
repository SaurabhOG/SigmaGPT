import express from "express";
import Thread from "../models/Thread.js";
import GoogleAIAPIResponse from "../utils/googleai.js";

const router = express.Router();

// test route
router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "abc",
      title: "Testing New Thread 2",
    });

    const response = await thread.save();
    res.send(response);
  } catch (err) {
    console.log(err);
    res.send(500).json({ error: "Failed to save DB" });
  }
});

// get all thread
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    res.json(threads);
  } catch (err) {
    console.log(err);
    res.send(500).json({ error: "Failed to Fetch Threads" });
  }
});

router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    let thread = await Thread.findOne({ threadId });

    if (!thread) {
      res.status(404).json({ error: "Thread Not Found" });
    }
    res.json(thread.messages);
  } catch (err) {
    console.log(err);
    res.send(500).json({ error: "Failed to Fetch Chat" });
  }
});

router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId });

    if (!deletedThread) {
      res.status(404).json({ error: "Thread Not Found" });
    }
    res.status(200).json({ success: "Thread delete successfully" });
  } catch (err) {
    console.log(err);
    res.send(500).json({ error: "Failed to Delete Thread" });
  }
});

router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  if (!message || !threadId) {
    res.status(400).json({ error: "missing required field" });
  }

  try {
    let thread = await Thread.findOne({ threadId });

    if (!thread) {
      thread = new Thread({
        threadId,
        title: message,
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    const assistantReply = await GoogleAIAPIResponse(message);
    thread.messages.push({ role: "assistant", content: assistantReply });

    thread.updatedAt = new Date();

    await thread.save();
    res.json({ reply: assistantReply });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went Wrong" });
  }
});

export default router;
