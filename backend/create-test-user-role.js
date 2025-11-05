// Create TEST USER role for test-org-1
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Get test-org-free organization
    const org = await prisma.organization.findUnique({
      where: { slug: 'test-org-free' }
    });

    if (!org) {
      console.error('❌ test-org-free not found');
      process.exit(1);
    }

    console.log(`✅ Found organization: ${org.name} (${org.id})`);

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: 'test-user@test-org-1.com' }
    });

    if (existing) {
      console.log('⚠️ User already exists:', existing.email);

      // Update to USER role if different
      if (existing.role !== 'USER') {
        await prisma.user.update({
          where: { id: existing.id },
          data: { role: 'USER' }
        });
        console.log('✅ Updated role to USER');
      }

      process.exit(0);
    }

    // Hash password: TestPass123!
    const hashedPassword = await bcrypt.hash('TestPass123!', 10);

    // Create USER
    const user = await prisma.user.create({
      data: {
        email: 'test-user@test-org-1.com',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User 1',
        role: 'USER',
        organizationId: org.id,
        isOnboarded: true
      }
    });

    console.log('✅ USER created successfully:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Organization: ${org.name}`);
    console.log(`   Password: TestPass123!`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
