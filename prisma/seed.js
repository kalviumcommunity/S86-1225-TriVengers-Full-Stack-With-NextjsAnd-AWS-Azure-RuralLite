const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Clean existing data (useful for rerunning seed)
  await prisma.taskTag.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.task.deleteMany()
  await prisma.projectMember.deleteMany()
  await prisma.project.deleteMany()
  await prisma.teamMember.deleteMany()
  await prisma.team.deleteMany()
  await prisma.user.deleteMany()

  // Users
  const alice = await prisma.user.create({
    data: { name: 'Alice', email: 'alice@example.com', role: 'ADMIN' },
  })
  const bob = await prisma.user.create({
    data: { name: 'Bob', email: 'bob@example.com' },
  })
  const carol = await prisma.user.create({
    data: { name: 'Carol', email: 'carol@example.com' },
  })

  // Team
  const team = await prisma.team.create({
    data: { name: 'Kalvium NHK Team', description: 'Demo team for assignment.' },
  })

  await prisma.teamMember.createMany({
    data: [
      { userId: alice.id, teamId: team.id },
      { userId: bob.id, teamId: team.id },
    ],
  })

  // Project
  const project = await prisma.project.create({
    data: {
      name: 'Student App',
      slug: 'student-app',
      description: 'App for managing students and assignments',
      ownerId: alice.id,
      teamId: team.id,
    },
  })

  await prisma.projectMember.createMany({
    data: [
      { userId: alice.id, projectId: project.id, role: 'OWNER' },
      { userId: bob.id, projectId: project.id, role: 'CONTRIBUTOR' },
      { userId: carol.id, projectId: project.id, role: 'VIEWER' },
    ],
  })

  // Tags
  const frontend = await prisma.tag.create({ data: { name: 'frontend' } })
  const backend = await prisma.tag.create({ data: { name: 'backend' } })

  // Tasks
  const task1 = await prisma.task.create({
    data: {
      title: 'Design database schema',
      description: 'Create normalized schema and prisma models',
      projectId: project.id,
      assigneeId: bob.id,
      priority: 2,
    },
  })

  const task2 = await prisma.task.create({
    data: {
      title: 'Implement seed and migrations',
      description: 'Add Prisma migrations and seed data',
      projectId: project.id,
      assigneeId: alice.id,
      priority: 1,
      status: 'IN_PROGRESS',
    },
  })

  await prisma.taskTag.createMany({
    data: [
      { taskId: task1.id, tagId: backend.id },
      { taskId: task2.id, tagId: backend.id },
      { taskId: task2.id, tagId: frontend.id },
    ],
  })

  await prisma.comment.create({
    data: {
      content: 'Initial DB design OK',
      authorId: alice.id,
      taskId: task1.id,
    },
  })

  console.log('Seed data created successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
