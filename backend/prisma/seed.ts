import { PrismaClient, Role, ActivityType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.activityEvent.deleteMany();
  await prisma.lessonCompletion.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);

  const mentor = await prisma.user.create({
    data: {
      email: "mentor@demo.com",
      password: passwordHash,
      name: "Priya Sharma",
      role: Role.MENTOR,
    },
  });

  const student1 = await prisma.user.create({
    data: {
      email: "student@demo.com",
      password: passwordHash,
      name: "Arjun Patel",
      role: Role.STUDENT,
    },
  });

  const student2 = await prisma.user.create({
    data: {
      email: "student2@demo.com",
      password: passwordHash,
      name: "Sneha Reddy",
      role: Role.STUDENT,
    },
  });

  const courses = await Promise.all([
    prisma.course.create({
      data: {
        title: "JavaScript Fundamentals",
        description: "Core JS concepts: variables, functions, arrays, and DOM basics.",
        category: "Programming",
      },
    }),
    prisma.course.create({
      data: {
        title: "React & Modern Frontend",
        description: "Build interactive UIs with React, hooks, and component patterns.",
        category: "Programming",
      },
    }),
    prisma.course.create({
      data: {
        title: "Data Structures & Algorithms",
        description: "Essential DSA for interviews and problem solving.",
        category: "Computer Science",
      },
    }),
  ]);

  const jsLessons = [
    { title: "Variables & Data Types", durationMin: 25, order: 1 },
    { title: "Functions & Scope", durationMin: 30, order: 2 },
    { title: "Arrays & Objects", durationMin: 35, order: 3 },
    { title: "Async JavaScript", durationMin: 40, order: 4 },
    { title: "DOM Manipulation", durationMin: 30, order: 5 },
    { title: "ES6+ Features", durationMin: 35, order: 6 },
  ];

  const reactLessons = [
    { title: "React Basics & JSX", durationMin: 30, order: 1 },
    { title: "Components & Props", durationMin: 35, order: 2 },
    { title: "State & useEffect", durationMin: 40, order: 3 },
    { title: "Context & Custom Hooks", durationMin: 45, order: 4 },
    { title: "React Router", durationMin: 30, order: 5 },
  ];

  const dsaLessons = [
    { title: "Big-O Notation", durationMin: 25, order: 1 },
    { title: "Arrays & Hash Maps", durationMin: 40, order: 2 },
    { title: "Linked Lists", durationMin: 35, order: 3 },
    { title: "Trees & Graphs", durationMin: 50, order: 4 },
    { title: "Dynamic Programming Intro", durationMin: 45, order: 5 },
    { title: "Sorting Algorithms", durationMin: 35, order: 6 },
    { title: "Binary Search", durationMin: 30, order: 7 },
  ];

  const allLessons: { courseId: string; title: string; durationMin: number; order: number }[] = [];

  for (const l of jsLessons) {
    allLessons.push({ courseId: courses[0].id, ...l });
  }
  for (const l of reactLessons) {
    allLessons.push({ courseId: courses[1].id, ...l });
  }
  for (const l of dsaLessons) {
    allLessons.push({ courseId: courses[2].id, ...l });
  }

  const createdLessons = await Promise.all(
    allLessons.map((l) =>
      prisma.lesson.create({
        data: {
          title: l.title,
          durationMin: l.durationMin,
          order: l.order,
          courseId: l.courseId,
          description: `Learn ${l.title.toLowerCase()} with hands-on exercises.`,
        },
      })
    )
  );

  const jsLessonIds = createdLessons.filter((l) => l.courseId === courses[0].id);
  const reactLessonIds = createdLessons.filter((l) => l.courseId === courses[1].id);
  const dsaLessonIds = createdLessons.filter((l) => l.courseId === courses[2].id);

  const student1Completions = [
    ...jsLessonIds.slice(0, 5),
    ...reactLessonIds.slice(0, 3),
    ...dsaLessonIds.slice(0, 2),
  ];

  const student2Completions = [
    ...jsLessonIds.slice(0, 6),
    ...reactLessonIds.slice(0, 4),
    ...dsaLessonIds.slice(0, 4),
  ];

  const now = new Date();

  for (let i = 0; i < student1Completions.length; i++) {
    const daysAgo = Math.floor(Math.random() * 28) + 1;
    const completedAt = new Date(now);
    completedAt.setDate(completedAt.getDate() - daysAgo);
    await prisma.lessonCompletion.create({
      data: {
        userId: student1.id,
        lessonId: student1Completions[i].id,
        completedAt,
      },
    });
  }

  for (let i = 0; i < student2Completions.length; i++) {
    const daysAgo = Math.floor(Math.random() * 28) + 1;
    const completedAt = new Date(now);
    completedAt.setDate(completedAt.getDate() - daysAgo);
    await prisma.lessonCompletion.create({
      data: {
        userId: student2.id,
        lessonId: student2Completions[i].id,
        completedAt,
      },
    });
  }

  const activityTypes: ActivityType[] = [ActivityType.LESSON, ActivityType.PRACTICE, ActivityType.REVIEW];

  for (const student of [student1, student2]) {
    const completions =
      student.id === student1.id ? student1Completions : student2Completions;

    for (let day = 29; day >= 0; day--) {
      const date = new Date(now);
      date.setDate(date.getDate() - day);
      date.setHours(0, 0, 0, 0);

      const sessionsToday = Math.random() > 0.3 ? Math.floor(Math.random() * 3) + 1 : 0;

      for (let s = 0; s < sessionsToday; s++) {
        const lesson = completions[Math.floor(Math.random() * completions.length)];
        const minutes = Math.floor(Math.random() * 45) + 15;
        await prisma.activityEvent.create({
          data: {
            userId: student.id,
            lessonId: lesson?.id ?? null,
            minutes,
            date,
            type: activityTypes[Math.floor(Math.random() * activityTypes.length)],
          },
        });
      }
    }
  }

  console.log("Seed completed successfully!");
  console.log("\nDemo credentials:");
  console.log("  Student:  student@demo.com  / password123");
  console.log("  Student:  student2@demo.com / password123");
  console.log("  Mentor:   mentor@demo.com   / password123");
  console.log(`\nCreated ${courses.length} courses, ${createdLessons.length} lessons`);
  console.log(`Mentor: ${mentor.name} (${mentor.email})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
