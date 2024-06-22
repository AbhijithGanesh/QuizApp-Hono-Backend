import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";

import type { Question, Answers, Options } from "@prisma/client";
import type { IAnswer, IOptionID, IQuestionResponse } from "./types";

const app = new Hono();
const prisma = new PrismaClient();



app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/get-all-questions", async (c) => {
  const questions = await prisma.question.findMany({});
  const options = await prisma.options.findMany({
    select: {
      OptionID: true,
      text: true,
      refQID: true,
    }
  });
  let _questions = [] as IQuestionResponse[];
  questions.forEach((question) => {
    let _options = [] as IOptionID[];
    options.forEach((option) => {
      if (option.refQID === question.QuestionID) {
        _options.push({
          OptionID: option.OptionID,
          text: option.text,
        });
      }
    });
    _questions.push({
      question: question.QuestionText,
      options: _options
    })
  });

  return c.json({ questions: _questions });
});

app.post("/upload-questions", async (c) => {
  const body = await c.req.json();
  const questions = body.questions as Question[];
  try {
    await prisma.question.create({
      data: {
        QuestionText: "What is the capital of India?",
      }
    })
    await prisma.question.createMany({
      data: questions,
    });
    return c.json({ message: "Questions uploaded successfully" });
  } catch (e) {
    console.error(e);
    return c.json({ error: "Internal Server Error" });
  }
})

app.post("/post-options", async (c) => {
  const body = await c.req.json();
  const options = body.options as Options[];
  try {
    await prisma.options.createMany({
      data: options,
    });
    return c.json({ message: "Options posted successfully" });
  } catch (e) {
    console.error(e);
    return c.json({ error: "Internal Server Error" });
  }
})

app.post("/post-answers", async (c) => {
  const body = await c.req.json();
  const email: string = body.email;
  const answers = body.answers;
  const _answers = [] as any[];

  answers.forEach((answer: IAnswer) => {
    _answers.push({
      questionID: answer.questionID as number,
      optionsID: answer.optionsID as number,
      email: email,
    });
  });

  try {
    await prisma.answers.createMany({
      data: _answers,
    });
    return c.json({ message: "Answers posted successfully" });
  } catch (e) {
    console.error(e);
    return c.json({ error: "Internal Server Error" });
  }
});

app.post("/return-scores", async (c) => {
  const body = await c.req.json();
  const email: string = body.email;
  const answers = await prisma.answers.findMany({
    where: {
      email: email,
    },
  });
  const options: number[] = [];
  answers.forEach((answer: Answers) => {
    options.push(answer.optionsID);
  });

  let score = 0;

  const process = async (answer: Answers) => {
    const option = await prisma.options.findUnique({
      where: {
        OptionID: answer.optionsID,
      },
    });
    if (option?.isCorrect === true) {
      score++;
    }
  };

  const processAnswers = async (answers: Answers[]) => {
    await Promise.all(answers.map(answer => process(answer)));
  };

  await processAnswers(answers);
  return c.json({ score: score });
});


export default {
  port: 3000,
  fetch: app.fetch,
};
