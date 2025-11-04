const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function distributeCandidates() {
  console.log('🔄 Adaylar dağıtılıyor...\n');

  // 1. Organizasyonları al
  const mainOrg = await prisma.organization.findFirst({
    where: { slug: 'default' }
  });

  const testOrgs = await prisma.organization.findMany({
    where: {
      slug: {
        in: ['test-org-free', 'test-org-pro', 'test-org-enterprise']
      }
    },
    orderBy: { slug: 'asc' }
  });

  if (!mainOrg) {
    throw new Error('Ana organizasyon bulunamadı!');
  }

  if (testOrgs.length !== 3) {
    throw new Error('3 test organizasyonu bulunamadı!');
  }

  console.log(`📦 Ana organizasyon: ${mainOrg.name} (${mainOrg.slug})`);
  console.log(`📦 Test organizasyonlar: ${testOrgs.map(o => o.name).join(', ')}\n`);

  // 2. Tüm aktif adayları al (isDeleted=false)
  const allCandidates = await prisma.candidate.findMany({
    where: {
      organizationId: mainOrg.id,
      isDeleted: false
    },
    orderBy: { createdAt: 'asc' }
  });

  console.log(`👥 Toplam aday: ${allCandidates.length}`);

  if (allCandidates.length < 5) {
    console.log('⚠️  En az 5 aday olmalı (2 kalacak + 3 dağıtılacak)');
    return;
  }

  // 3. İlk 2 aday ana org'da kalsın
  const keepCandidates = allCandidates.slice(0, 2);
  const distributeCandidates = allCandidates.slice(2);

  console.log(`✅ Ana org'da kalacak: ${keepCandidates.length} aday`);
  console.log(`🔄 Dağıtılacak: ${distributeCandidates.length} aday\n`);

  // 4. Eşit dağıt
  const perOrg = Math.floor(distributeCandidates.length / 3);
  const remainder = distributeCandidates.length % 3;

  console.log(`📊 Her org'a: ${perOrg} aday (${remainder} fazladan paylaştırılacak)\n`);

  let startIdx = 0;
  for (let i = 0; i < testOrgs.length; i++) {
    const org = testOrgs[i];
    // İlk remainder org'a 1 fazla ver
    const count = perOrg + (i < remainder ? 1 : 0);
    const candidates = distributeCandidates.slice(startIdx, startIdx + count);

    console.log(`\n🔄 ${org.name}:`);
    console.log(`   Dağıtılacak aday sayısı: ${candidates.length}`);

    // Update candidates
    await prisma.candidate.updateMany({
      where: {
        id: {
          in: candidates.map(c => c.id)
        }
      },
      data: {
        organizationId: org.id
      }
    });

    console.log(`   ✅ ${candidates.length} aday taşındı`);
    startIdx += count;
  }

  // 5. Sonuç kontrol
  console.log('\n\n📊 Final Dağılım:');

  const finalMain = await prisma.candidate.count({
    where: { organizationId: mainOrg.id }
  });
  console.log(`   ${mainOrg.name}: ${finalMain} aday`);

  for (const org of testOrgs) {
    const count = await prisma.candidate.count({
      where: { organizationId: org.id }
    });
    console.log(`   ${org.name}: ${count} aday`);
  }

  console.log('\n✅ Dağıtım tamamlandı!\n');
}

distributeCandidates()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error('❌ Hata:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
