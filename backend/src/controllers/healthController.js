export function getHealth(req, res) {
  const uptime = process.uptime();

  res.status(200).json({
    status: 'healthy',
    version: '1.0.0',
    service: 'justiceai-backend',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(uptime * 100) / 100,
    modules: {
      chat: 'active',
      njdgService: 'active',
      judgeService: 'active',
      eCourtsService: 'active',
      documentService: 'active',
      ragRetriever: 'active'
    }
  });
}
