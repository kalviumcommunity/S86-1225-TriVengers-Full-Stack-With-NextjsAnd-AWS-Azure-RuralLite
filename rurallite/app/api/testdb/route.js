import prisma from '../../prismaClient'
import { NextResponse } from 'next/server'

export async function GET() {
  const users = await prisma.user.count()
  const projects = await prisma.project.count()
  const tasks = await prisma.task.count()

  return NextResponse.json({ users, projects, tasks })
}
