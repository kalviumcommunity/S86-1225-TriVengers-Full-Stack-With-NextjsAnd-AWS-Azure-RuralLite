#!/usr/bin/env node
import prisma from '../prismaClient.js'

async function main(){
  console.log('Setting placeholder passwords where password IS NULL...')
  const res = await prisma.$executeRaw`UPDATE "User" SET password = 'changeme' WHERE password IS NULL;`
  console.log('Update result:', res)

  const [{ count }] = await prisma.$queryRaw`SELECT count(*)::int FROM "User" WHERE password IS NULL;`
  console.log('Remaining NULL passwords:', count)
  await prisma.$disconnect()
}

main().catch(e=>{ console.error(e); process.exit(1) })
