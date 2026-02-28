/*
  Warnings:

  - You are about to drop the column `summaary` on the `Article` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Article` DROP COLUMN `summaary`,
    ADD COLUMN `summary` TEXT NULL;
