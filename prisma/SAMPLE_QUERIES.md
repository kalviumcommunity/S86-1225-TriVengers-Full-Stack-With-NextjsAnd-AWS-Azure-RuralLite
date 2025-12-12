Examples: Common Prisma client queries for this schema

1) Get tasks for a project with assignee & tags

```js
const tasks = await prisma.task.findMany({
  where: { projectId: 1 },
  include: { assignee: true, tags: { include: { tag: true } } }
});
```

2) Get projects for a team with members and tasks

```js
const projects = await prisma.project.findMany({
  where: { teamId: 1 },
  include: { members: { include: { user: true } }, tasks: true }
});
```

3) Get a user's assigned tasks

```js
const userTasks = await prisma.task.findMany({ where: { assigneeId: 2 } });
```

4) Create a new task with tags

```js
const newTask = await prisma.task.create({
  data: {
    title: 'New Task',
    projectId: 1,
    assigneeId: 2,
    tags: { create: [{ tag: { connectOrCreate: { where: { name: 'backend' }, create: { name: 'backend' } } } }] }
  }
})
```
