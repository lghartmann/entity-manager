export default function manageEntity<T, Y, K extends keyof T & keyof Y>(
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
      if (!removed) throw new Error(`Item: ${removed} not found`);

      const originalIndex = removedIndexes[String(entity[keyToCompare])];
      if (!originalIndex) {
        throw new Error(`Item Index: ${originalIndex} index not found`);
      }

      delete removedIndexes[String(entity[keyToCompare])];
      relatedEntities.splice(originalIndex, 0, removed);
      return;
    }

    const indexOfInFreeEntities = freeEntities.findIndex(
      (free) => free[keyToCompare] === entity[keyToCompare]
    );
    const [added] = freeEntities.splice(indexOfInFreeEntities, 1);
    if (!added) throw new Error(`Item: ${added} not found`);

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
      if (!added) throw new Error(`Item: ${added} not found`);

      const originalIndex = addedIndexes[String(entity[keyToCompare])];
      if (!originalIndex) {
        throw new Error(`Item Index: ${originalIndex} index not found`);
      }

      delete addedIndexes[String(entity[keyToCompare])];
      freeEntities.splice(originalIndex, 0, added);
      return;
    }

    const indexOfInRelatedEntities = relatedEntities.findIndex(
      (rel) => rel[keyToCompare] === entity[keyToCompare]
    );
    const [removed] = relatedEntities.splice(indexOfInRelatedEntities, 1);
    if (!removed) throw new Error(`Item: ${removed} not found`);

    removedEntities.push(removed);
    removedIndexes[String(entity[keyToCompare])] = indexOfInRelatedEntities;
  }

  return { addedEntities, removedEntities, addEntity, removeEntity };
}
