import { atom } from "jotai";

// Example atom for demonstration
export const countAtom = atom(0);

// Example derived atom
export const doubleCountAtom = atom((get) => get(countAtom) * 2);

// Example write-only atom
export const incrementCountAtom = atom(null, (get, set) => {
  set(countAtom, get(countAtom) + 1);
});

export const decrementCountAtom = atom(null, (get, set) => {
  set(countAtom, get(countAtom) - 1);
});
