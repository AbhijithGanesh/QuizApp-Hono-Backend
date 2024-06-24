import { swaggerUI } from "@hono/swagger-ui";
import { Hono } from "hono";
import { logger } from "hono/logger";

import type { Answers, Options, Question } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

import * as openapiDocument from "@aghono/openapi.json";
import type { IAnswer, IOptionID, IQuestionResponse } from "@aghono/types";

const prisma = new PrismaClient();
const app = new Hono();
app.use(logger());

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
		},
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
			options: _options,
		});
	});

	return c.json({ questions: _questions });
});

app.post("/upload-questions", async (c) => {
	const body = await c.req.json();
	const questions = body.questions as Question[];
	try {
		await prisma.question.createMany({
			data: questions,
		});
		return c.json({ message: "Questions uploaded successfully" });
	} catch (e) {
		console.error(e);
		return c.json({ error: "Internal Server Error" });
	}
});

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
});

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
		await Promise.all(answers.map((answer) => process(answer)));
	};

	await processAnswers(answers);
	return c.json({ score: score });
});

app.delete("/delete-question", async (c) => {
	const body = await c.req.json();
	const questionID = body.questionID;
	if (!questionID) {
		return c.json({ error: "Question ID is required" });
	}
	try {
		await prisma.options.deleteMany({
			where: {
				refQID: questionID,
			},
		});

		return c.json({ message: "Question deleted successfully" });
	} catch (e) {
		console.error(e);
		return c.json({ error: "Internal Server Error" });
	}
});

app.patch("/update-question", async (c) => {
	const body = await c.req.json();
	const questionID = body.questionID;
	const questionText = body.questionText;
	if (!questionID) {
		return c.json({ error: "Question ID is required" });
	}
	if (!questionText) {
		return c.json({ error: "Question Text is required" });
	}
	try {
		await prisma.question.update({
			where: {
				QuestionID: questionID,
			},
			data: {
				QuestionText: questionText,
			},
		});
		return c.json({ message: "Question updated successfully" });
	} catch (e) {
		console.error(e);
		return c.json({ error: "Internal Server Error" });
	}
});

app.patch("/update-option", async (c) => {
	const body = await c.req.json();
	const optionID = body.optionID;
	const optionText = body.optionText;
	if (!optionID) {
		return c.json({ error: "Option ID is required" });
	}
	if (!optionText) {
		return c.json({ error: "Option Text is required" });
	}
	try {
		await prisma.options.update({
			where: {
				OptionID: optionID,
			},
			data: {
				text: optionText,
			},
		});
		return c.json({ message: "Option updated successfully" });
	} catch (e) {
		console.error(e);
		return c.json({ error: "Internal Server Error" });
	}
});

app.get(
	"/ui",
	swaggerUI({
		url: "http://localhost:3000/openapi.json",
	}),
);

app.get("/openapi.json", async (c) => {
	return c.json(openapiDocument);
});

export default {
	port: 8000,
	fetch: app.fetch,
};
