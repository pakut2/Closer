import * as latinize from "latinize";

export const removeDiacritics = (sequence: string): string => latinize(sequence.toLowerCase());
