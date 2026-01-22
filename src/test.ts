import Mynth from ".";

const mynth = new Mynth({
  apiKey: "mak_872ab2cbae88e0ac8570f5ec105ec51c05b69fb35d9dea52",
  baseUrl: "https://77aee3d7fc8e.ngrok-free.app",
});

const taskAsync = await mynth.generate(
  {
    prompt: {
      positive: "A beautiful sunset over mountains",
      magic: false,
    },
    model: "black-forest-labs/flux-1-schnell",
    metadata: {
      userId: "user123",
      requestId: "req456",
      tagCount: 2,
    },
  },
  { mode: "async" }
);

console.log(taskAsync.id, taskAsync);

const task = await taskAsync.toTask();

console.log(task.id, task);

console.log(task.getImages());
