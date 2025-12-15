import { prisma } from '@/lib/prisma';

/**
 * Test Prisma connection and query
 * This file demonstrates basic Prisma usage
 */

export async function testConnection() {
    try {
        console.log('🔗 Testing Prisma connection...');

        // Test connection by counting users
        const userCount = await prisma.user.count();
        console.log(`✅ Connected! Found ${userCount} users in database.`);

        return { success: true, count: userCount };
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        return { success: false, error: error.message };
    } finally {
        await prisma.$disconnect();
    }
}

// Example: Create a new lesson
export async function createSampleLesson() {
    try {
        const lesson = await prisma.lesson.create({
            data: {
                title: 'Introduction to Mathematics',
                description: 'Basic mathematical concepts for Grade 5',
                content: '# Welcome to Math!\n\nLet\'s learn together.',
                subject: 'Mathematics',
                grade: 5,
                difficulty: 'BEGINNER',
                isOffline: true,
            },
        });

        console.log('✅ Lesson created:', lesson);
        return lesson;
    } catch (error) {
        console.error('❌ Error creating lesson:', error);
        throw error;
    }
}

// Example: Get all lessons
export async function getAllLessons() {
    try {
        const lessons = await prisma.lesson.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
        });

        console.log(`✅ Found ${lessons.length} lessons`);
        return lessons;
    } catch (error) {
        console.error('❌ Error fetching lessons:', error);
        throw error;
    }
}
