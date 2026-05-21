-- CreateEnum
CREATE TYPE "Status" AS ENUM ('draft', 'ready', 'posted');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Script" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "mission" TEXT,
    "status" "Status" NOT NULL DEFAULT 'draft',
    "hookTitle" TEXT,
    "hookVisual" TEXT,
    "hookVerbal" TEXT,
    "storyProblem" TEXT,
    "storyPromise" TEXT,
    "storyCredibility" TEXT,
    "storyDelivery" TEXT,
    "storyCta" TEXT,
    "footageNeeded" TEXT,
    "audio" TEXT,
    "caption" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Script_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Script" ADD CONSTRAINT "Script_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
