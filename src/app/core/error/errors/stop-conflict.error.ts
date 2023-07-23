export class StopConflictError extends Error {
  constructor(private readonly stopName: string) {
    super(`You see ${stopName} too?`);
  }
}
