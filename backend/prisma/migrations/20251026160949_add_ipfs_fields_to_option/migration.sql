-- AlterTable
ALTER TABLE "Option" ADD COLUMN     "gateway_url" TEXT,
ADD COLUMN     "ipfs_cid" TEXT,
ADD COLUMN     "ipfs_uri" TEXT,
ALTER COLUMN "image_url" DROP NOT NULL;
