/*
  Warnings:

  - You are about to drop the `ManyQuestionOptionsMap` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `Text` on the `Options` table. All the data in the column will be lost.
  - You are about to drop the column `optionsOptionID` on the `Question` table. All the data in the column will be lost.
  - Added the required column `isCorrect` to the `Options` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refQID` to the `Options` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `Options` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ManyQuestionOptionsMap";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Answers" (
    "AnswerID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "questionID" INTEGER NOT NULL,
    "optionsID" INTEGER NOT NULL,
    CONSTRAINT "Answers_questionID_fkey" FOREIGN KEY ("questionID") REFERENCES "Question" ("QuestionID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Answers_optionsID_fkey" FOREIGN KEY ("optionsID") REFERENCES "Options" ("OptionID") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Options" (
    "OptionID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "refQID" INTEGER NOT NULL,
    CONSTRAINT "Options_refQID_fkey" FOREIGN KEY ("refQID") REFERENCES "Question" ("QuestionID") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Options" ("OptionID") SELECT "OptionID" FROM "Options";
DROP TABLE "Options";
ALTER TABLE "new_Options" RENAME TO "Options";
CREATE TABLE "new_Question" (
    "QuestionID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "QuestionText" TEXT NOT NULL
);
INSERT INTO "new_Question" ("QuestionID", "QuestionText") SELECT "QuestionID", "QuestionText" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
