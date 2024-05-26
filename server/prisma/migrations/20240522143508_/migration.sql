-- CreateTable
CREATE TABLE "_lastReplyJ" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_lastReplyJ_A_fkey" FOREIGN KEY ("A") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_lastReplyJ_B_fkey" FOREIGN KEY ("B") REFERENCES "Reply" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_lastReplyJ_AB_unique" ON "_lastReplyJ"("A", "B");

-- CreateIndex
CREATE INDEX "_lastReplyJ_B_index" ON "_lastReplyJ"("B");
