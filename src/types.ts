interface IOptionID {
    OptionID: number;
    text: string;
}

interface IAnswer {
    questionID: number;
    optionsID: number;
    email: string;
}

interface IQuestionResponse {
    question: string;
    options: IOptionID[];
}

export {
    IOptionID,
    IAnswer,
    IQuestionResponse
}