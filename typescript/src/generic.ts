import type { Client, Animal, WithIdentifier } from "./animal";

class Pile<T extends WithIdentifier> {
  private piles: T[] = [];

  push(item: T) {
    this.piles.push(item);
    return this.piles.length;
  }

  pop(
    failIfNotFound: boolean
  ): T | (typeof failIfNotFound extends true ? void : undefined) {
    const result = this.piles.pop();
    if (failIfNotFound) {
      throw new Error("no data left");
    }
    return result;
  }

  change<Name extends keyof T>(id: T["id"], name: Name, value: T[Name]) {}
}

const pileClient = new Pile<Client>();
const client: Client = {
  id: Date.now(),
  name: "Toto",
  dateOfBirth: new Date(),
  address: "dgfhjklm",
};
pileClient.push(client);

const pileAnimal = new Pile<Animal>();
const animal: Animal = {
  id: Date.now(),
  updatedDate: new Date(),
  createdDate: new Date(),
  race: " cgjhk",
  pelage: "vjhbknlk,",
  dateOfBirth: new Date(),
  family: "chien",
  name: "Rufus",
};
pileAnimal.change(0, "name", "test");
pileAnimal.push(animal);
//pileAnimal.push(client);
