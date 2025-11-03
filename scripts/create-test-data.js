const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createTestData() {
  console.log('🚀 Test organizasyonları ve kullanıcılar oluşturuluyor...\n');

  const testPassword = await bcrypt.hash('TestPass123!', 10);

  // 3 Test Organizasyonu
  const orgs = [
    {
      name: 'Test Organization Free',
      slug: 'test-org-free',
      plan: 'FREE',
      maxAnalysisPerMonth: 10,
      maxCvPerMonth: 50,
      maxUsers: 2
    },
    {
      name: 'Test Organization Startup',
      slug: 'test-org-startup',
      plan: 'STARTUP',
      maxAnalysisPerMonth: 50,
      maxCvPerMonth: 200,
      maxUsers: 10
    },
    {
      name: 'Test Organization Enterprise',
      slug: 'test-org-enterprise',
      plan: 'ENTERPRISE',
      maxAnalysisPerMonth: 200,
      maxCvPerMonth: 1000,
      maxUsers: 50
    }
  ];

  // 4 rol (SUPER_ADMIN hariç - o Mustafa Asan'da)
  const roles = ['ADMIN', 'MANAGER', 'HR_SPECIALIST', 'USER'];

  for (let i = 0; i < orgs.length; i++) {
    const orgData = orgs[i];

    console.log(`\n📦 ${orgData.name} oluşturuluyor...`);

    // Organizasyon oluştur
    const org = await prisma.organization.create({
      data: orgData
    });

    console.log(`   ✅ Organization ID: ${org.id}`);
    console.log(`   📋 Plan: ${org.plan}`);

    // Her rol için kullanıcı oluştur
    for (const role of roles) {
      const email = `test-${role.toLowerCase()}@test-org-${i + 1}.com`;
      const name = `Test ${role.replace('_', ' ')} ${i + 1}`;

      const user = await prisma.user.create({
        data: {
          email,
          password: testPassword,
          name,
          role,
          organizationId: org.id
        }
      });

      console.log(`   👤 ${role}: ${email}`);
    }
  }

  console.log('\n✅ Tüm test verileri oluşturuldu!\n');
  console.log('📊 Özet:');
  console.log('   - 3 test organizasyonu');
  console.log('   - 12 test kullanıcısı (her org\'da 4 rol)');
  console.log('   - Şifre (hepsi): TestPass123!');
  console.log('\n🔐 SUPER_ADMIN: info@gaiai.ai (Mustafa Asan - değişmedi)\n');
}

createTestData()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error('❌ Hata:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
