const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUser() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });

    if (user) {
      console.log('User found in database:');
      console.log('ID:', user.id);
      console.log('Email:', user.email);
      console.log('Password (hashed):', user.password);
      console.log('Role:', user.role);
      console.log('Created At:', user.createdAt);
      console.log('\nPassword format check:');
      console.log('Starts with $2b$ (bcrypt):', user.password.startsWith('$2b$'));
      console.log('Password length:', user.password.length);
    } else {
      console.log('User not found');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
