import * as latinize from "latinize";

export const normalize = (sequence: string): string => latinize(sequence.trim().toLowerCase());
