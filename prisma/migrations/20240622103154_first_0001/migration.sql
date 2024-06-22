-- CreateTable
CREATE TABLE "Question" (
    "QuestionID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "QuestionText" TEXT NOT NULL,
    "optionsOptionID" INTEGER NOT NULL,
    CONSTRAINT "Question_optionsOptionID_fkey" FOREIGN KEY ("optionsOptionID") REFERENCES "Options" ("OptionID") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Options" (
    "OptionID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Text" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ManyQuestionOptionsMap" (
    "QuestionID" INTEGER NOT NULL,
    "OptionID" INTEGER NOT NULL,

    PRIMARY KEY ("QuestionID", "OptionID"),
    CONSTRAINT "ManyQuestionOptionsMap_QuestionID_fkey" FOREIGN KEY ("QuestionID") REFERENCES "Question" ("QuestionID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ManyQuestionOptionsMap_OptionID_fkey" FOREIGN KEY ("OptionID") REFERENCES "Options" ("OptionID") ON DELETE RESTRICT ON UPDATE CASCADE
);
