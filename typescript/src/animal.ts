type WithName = {
  name: string;
};

export type WithIdentifier = {
  id: number;
};

type WithTimestamps = {
  createdDate: Date;
  updatedDate: Date;
};

type WithBirthDate = {
  dateOfBirth: Date;
};

export type Client = {
  address: string;
} & WithName &
  WithBirthDate &
  WithIdentifier;

type BaseAnimal = {
  family: string;
  race: string;
  pelage: string;
} & WithName &
  WithBirthDate;

export type Animal = BaseAnimal & WithIdentifier & WithTimestamps;

function createAnimal(data: BaseAnimal): Animal {
  const newAnimal = {
    id: Date.now(),
    createdDate: new Date(),
    updatedDate: new Date(),
    ...data,
  };
  animals.push(newAnimal);

  return newAnimal;
}

const animals: Animal[] = [];

const animal = createAnimal({
  name: "Adenor",
  dateOfBirth: new Date(),
  family: "chien",
  pelage: "roux",
  race: "berlinois",
});

function updateAnimal(id: WithIdentifier["id"], data: Partial<Animal>): Animal {
  const index = animals.findIndex((a) => a.id === id);
  const oldAnimal = animals[index];

  if (oldAnimal === undefined) throw new Error("Not found");

  const newAnimal = {
    ...oldAnimal,
    ...data,
  };

  animals[index] = newAnimal;

  return newAnimal;
}

updateAnimal(animal.id, { race: "bouvier" });

function deleteAnimal(id: WithIdentifier["id"]): void {
  const index = animals.findIndex((a) => a.id === id);
  if (index !== -1) {
    animals.splice(index, 1);
  }
}

deleteAnimal(0);
