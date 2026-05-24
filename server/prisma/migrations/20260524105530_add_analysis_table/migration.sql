-- CreateEnum
CREATE TYPE "Pacing" AS ENUM ('fast', 'medium', 'slow');

-- CreateEnum
CREATE TYPE "Audio" AS ENUM ('mix', 'voiceover', 'trending_sounds', 'dialogue_bg_music', 'dialogue_only', 'no_voice', 'custom');

-- CreateTable
CREATE TABLE "Analysis" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "creatorName" TEXT NOT NULL,
    "reelLink" TEXT,
    "views" INTEGER,
    "hookTitle" TEXT,
    "hookVisual" TEXT,
    "hookVerbal" TEXT,
    "storyArc" TEXT,
    "pacing" "Pacing",
    "cta" TEXT,
    "format" TEXT,
    "duration" TEXT,
    "audio" "Audio",
    "audioCustom" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
