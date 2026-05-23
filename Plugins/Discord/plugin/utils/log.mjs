const log = console;
process.on('uncaughtException', (error) => {
  log.error('Uncaught Exception:', error);
});
process.on('unhandledRejection', (reason) => {
  log.error('Unhandled Rejection:', reason);
});
export { log };
