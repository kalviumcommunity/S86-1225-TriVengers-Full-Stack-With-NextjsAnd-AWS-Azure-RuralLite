const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.quizResult.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.note.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const student1 = await prisma.user.create({
    data: {
      email: "student1@rural.local",
      name: "Raj Kumar",
      role: "STUDENT",
      password: "hashedpassword123",
    },
  });

  const student2 = await prisma.user.create({
    data: {
      email: "student2@rural.local",
      name: "Priya Singh",
      role: "STUDENT",
      password: "hashedpassword123",
    },
  });

  const teacher = await prisma.user.create({
    data: {
      email: "teacher@rural.local",
      name: "Mrs. Sharma",
      role: "TEACHER",
      password: "hashedpassword123",
    },
  });

  // Create lessons
  const lesson1 = await prisma.lesson.create({
    data: {
      title: "Introduction to Mathematics",
      description: "Basic arithmetic and number concepts",
      content:
        "# Introduction to Mathematics\n\nLearn the fundamentals of mathematics starting with basic arithmetic operations.",
      subject: "Mathematics",
      grade: 5,
      difficulty: "BEGINNER",
      isOffline: true,
      downloadSize: 2048,
    },
  });

  const lesson2 = await prisma.lesson.create({
    data: {
      title: "English Grammar Basics",
      description: "Parts of speech and sentence structure",
      content:
        "# English Grammar\n\nUnderstand the basic building blocks of the English language.",
      subject: "English",
      grade: 5,
      difficulty: "BEGINNER",
      isOffline: true,
      downloadSize: 1536,
    },
  });

  // Create quizzes
  const quiz1 = await prisma.quiz.create({
    data: {
      lessonId: lesson1.id,
      title: "Math Basics Quiz",
      description: "Test your understanding of basic math",
      passingScore: 70,
      timeLimit: 30,
    },
  });

  // Create questions
  await prisma.question.createMany({
    data: [
      {
        quizId: quiz1.id,
        question: "What is 5 + 3?",
        options: ["6", "7", "8", "9"],
        correctAnswer: "8",
        points: 1,
        orderIndex: 0,
      },
      {
        quizId: quiz1.id,
        question: "What is 10 - 4?",
        options: ["5", "6", "7", "8"],
        correctAnswer: "6",
        points: 1,
        orderIndex: 1,
      },
    ],
  });

  // Create progress records
  await prisma.progress.create({
    data: {
      userId: student1.id,
      lessonId: lesson1.id,
      completed: true,
      progress: 100,
      lastAccessed: new Date(),
    },
  });

  // Create quiz results
  await prisma.quizResult.create({
    data: {
      userId: student1.id,
      quizId: quiz1.id,
      score: 85,
      completedAt: new Date(),
    },
  });

  // Create notes
  await prisma.note.create({
    data: {
      userId: student1.id,
      title: "Math Notes",
      content: "Remember to practice addition and subtraction daily!",
      tags: ["math", "practice"],
    },
  });

  console.log("Seed data created successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
