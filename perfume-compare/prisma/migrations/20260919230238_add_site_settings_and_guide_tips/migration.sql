-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "heroEyebrow" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "heroDescription" TEXT NOT NULL,
    "heroCtaPrimary" TEXT NOT NULL,
    "heroCtaSecondary" TEXT NOT NULL,
    "pillar1Title" TEXT NOT NULL,
    "pillar1Description" TEXT NOT NULL,
    "pillar2Title" TEXT NOT NULL,
    "pillar2Description" TEXT NOT NULL,
    "pillar3Title" TEXT NOT NULL,
    "pillar3Description" TEXT NOT NULL,
    "familiesEyebrow" TEXT NOT NULL,
    "familiesTitle" TEXT NOT NULL,
    "footerTagline" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuideTip" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuideTip_pkey" PRIMARY KEY ("id")
);
