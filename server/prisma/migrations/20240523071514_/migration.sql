/*
  Warnings:

  - You are about to drop the `_lastReplyJ` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `lastReply` on the `Post` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "_lastReplyJ_B_index";

-- DropIndex
DROP INDEX "_lastReplyJ_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_lastReplyJ";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReplyId" INTEGER,
    CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Post_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Post_lastReplyId_fkey" FOREIGN KEY ("lastReplyId") REFERENCES "Reply" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("content", "created", "id", "published", "tagId", "title", "updated", "userId") SELECT "content", "created", "id", "published", "tagId", "title", "updated", "userId" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE UNIQUE INDEX "Post_lastReplyId_key" ON "Post"("lastReplyId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
