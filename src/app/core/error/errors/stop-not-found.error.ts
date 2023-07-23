export class StopNotFoundError extends Error {
  constructor(private readonly stopName?: string) {
    super(`In my restless dreams, I see that stop. ${stopName ? `${stopName}.` : ""}`);
  }
}
