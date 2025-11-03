-- AlterTable
ALTER TABLE "job_offers" ADD COLUMN     "templateId" TEXT;

-- CreateTable
CREATE TABLE "offer_template_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "offer_template_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offer_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" TEXT,
    "position" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "salaryMin" INTEGER NOT NULL,
    "salaryMax" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "benefits" JSONB NOT NULL,
    "workType" TEXT NOT NULL DEFAULT 'office',
    "terms" TEXT NOT NULL,
    "emailSubject" TEXT NOT NULL,
    "emailBody" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "offer_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "offer_template_categories_order_idx" ON "offer_template_categories"("order");

-- CreateIndex
CREATE INDEX "offer_templates_categoryId_idx" ON "offer_templates"("categoryId");

-- CreateIndex
CREATE INDEX "offer_templates_isActive_idx" ON "offer_templates"("isActive");

-- CreateIndex
CREATE INDEX "offer_templates_usageCount_idx" ON "offer_templates"("usageCount" DESC);

-- CreateIndex
CREATE INDEX "job_offers_templateId_idx" ON "job_offers"("templateId");

-- AddForeignKey
ALTER TABLE "offer_templates" ADD CONSTRAINT "offer_templates_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "offer_template_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_offers" ADD CONSTRAINT "job_offers_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "offer_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;
