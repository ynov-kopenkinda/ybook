/*
  Warnings:

  - Added the required column `content` to the `ConversationMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ConversationMessage" ADD COLUMN     "content" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "avatarS3Key" DROP NOT NULL,
ALTER COLUMN "coverPicS3Key" DROP NOT NULL;