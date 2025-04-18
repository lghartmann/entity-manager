import { describe, it, expect } from "vitest";
function manageEntity<T, Y, K extends keyof T & keyof Y>(
  relatedEntities: T[],
  freeEntities: Y[],
  keyToCompare: K
) {
  const addedEntities: Y[] = [];
  const removedEntities: T[] = [];

  const addedIndexes: Record<string, number> = {};
  const removedIndexes: Record<string, number> = {};

  function addEntity(entity: T | Y) {
    const indexOfInRemovedEntities = removedEntities.findIndex(
      (rem) => rem[keyToCompare] === entity[keyToCompare]
    );
    const isInRemoved = indexOfInRemovedEntities > -1;
    if (isInRemoved) {
      const [removed] = removedEntities.splice(indexOfInRemovedEntities, 1);
      if (!removed) {
        throw new Error(
          `Removed entity: ${removed} not found in removedEntities`
        );
      }

      const originalIndex = removedIndexes[String(entity[keyToCompare])];
      if (typeof originalIndex !== "number") {
        throw new Error(`Removed entity Index: ${originalIndex} not found`);
      }

      delete removedIndexes[String(entity[keyToCompare])];
      relatedEntities.splice(originalIndex, 0, removed);
      return;
    }

    const indexOfInFreeEntities = freeEntities.findIndex(
      (free) => free[keyToCompare] === entity[keyToCompare]
    );
    const [added] = freeEntities.splice(indexOfInFreeEntities, 1);
    if (!added) throw new Error(`Free entity: ${added} not found`);

    addedEntities.push(added);
    addedIndexes[String(entity[keyToCompare])] = indexOfInFreeEntities;
  }

  function removeEntity(entity: T | Y) {
    const indexOfInAddedEntities = addedEntities.findIndex(
      (add) => add[keyToCompare] === entity[keyToCompare]
    );
    const isInAdded = indexOfInAddedEntities > -1;

    if (isInAdded) {
      const [added] = addedEntities.splice(indexOfInAddedEntities, 1);
      if (!added) {
        throw new Error(`Added entity: ${added} not found in addedEntities`);
      }

      const originalIndex = addedIndexes[String(entity[keyToCompare])];
      if (typeof originalIndex !== "number") {
        throw new Error(`Added entity index: ${originalIndex} not found`);
      }

      delete addedIndexes[String(entity[keyToCompare])];
      freeEntities.splice(originalIndex, 0, added);
      return;
    }

    const indexOfInRelatedEntities = relatedEntities.findIndex(
      (rel) => rel[keyToCompare] === entity[keyToCompare]
    );
    const [removed] = relatedEntities.splice(indexOfInRelatedEntities, 1);
    if (!removed) throw new Error(`Related entity: ${removed} not found`);

    removedEntities.push(removed);
    removedIndexes[String(entity[keyToCompare])] = indexOfInRelatedEntities;
  }

  return { addedEntities, removedEntities, addEntity, removeEntity };
}

type UserNormal = {
  id: number;
  name: string;
};

type UserExtra = {
  id: number;
  name: string;
  birthDate: Date;
};

const freeUsers: UserExtra[] = [
  {
    id: 1,
    name: "John",
    birthDate: new Date(),
  },
  {
    id: 2,
    name: "Mary",
    birthDate: new Date(),
  },
  {
    id: 3,
    name: "Edward",
    birthDate: new Date(),
  },
];

const relatedUsers: UserNormal[] = [
  {
    id: 4,
    name: "John",
  },
  {
    id: 5,
    name: "Mary",
  },
  {
    id: 6,
    name: "Edward",
  },
];
const { addedEntities, removedEntities, addEntity, removeEntity } =
  manageEntity(relatedUsers, freeUsers, "id");

describe("Entity Manager", () => {
  it("should add entities correctly", () => {
    const userCopy = { ...freeUsers[0] };
    addEntity(freeUsers[0]!);
    expect(userCopy.id).toEqual(addedEntities[0]?.id);
  });

  it("should remove entities correctly", () => {
    const userCopy = { ...relatedUsers[0] };
    removeEntity(relatedUsers[0]!);
    expect(userCopy.id).toEqual(removedEntities[0]?.id);
  });

  it("should remove added user from addedEntities", () => {
    const userCopy = { ...addedEntities[0] };
    removeEntity(addedEntities[0]!);
    expect(userCopy.id).toEqual(freeUsers[0]?.id);
  });

  it("should add removed user from removedEntities", () => {
    const userCopy = { ...removedEntities[0] };
    removeEntity(removedEntities[0]!);
    expect(userCopy.id).toEqual(relatedUsers[0]?.id);
  });
});
