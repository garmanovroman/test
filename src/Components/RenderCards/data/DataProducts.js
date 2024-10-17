import { v4 as uuidv4 } from 'uuid';

export const ProductsData_Test = [
  { name: 'Product1', id: uuidv4() },
  { name: 'Product1', id: uuidv4() },
  { name: 'Product1', id: uuidv4() },
];

const listFields = [
  {
    name: 'Поле1',
    ext: [],
    id: uuidv4(),
  },
  {
    name: 'Поле2',
    ext: [],
    id: uuidv4(),
  },
  {
    name: 'Поле3',
    ext: [
      { name: 'Доп. Поле 3-1', id: uuidv4() },
      { name: 'Доп. Поле 3-2', id: uuidv4() },
    ],
    id: uuidv4(),
  },
  {
    name: 'Поле4',
    ext: [],
    id: uuidv4(),
  },
  {
    name: 'Поле5',
    id: uuidv4(),
    ext: [
      { name: 'Доп. Поле 5-1', id: uuidv4() },
      { name: 'Доп. Поле 5-2', id: uuidv4() },
      { name: 'Доп. Поле 5-3', id: uuidv4() },
    ],
  },
  {
    name: 'Поле6',
    ext: [],
    id: uuidv4(),
  },
  {
    name: 'Поле7',
    ext: [],
    id: uuidv4(),
  },
  {
    name: 'Поле8',
    ext: [],
    id: uuidv4(),
  },
];

const config = {
  lengthList: listFields.length,
};

const randomNumber = ({ lengthList, isZero = true }) => {
  if (isZero) {
    return Math.floor(Math.random() * lengthList);
  } else {
    return Math.ceil(Math.random() * (lengthList - 1));
  }
};

export const getRandomFieldsMenu = () => {
  const fields = [];
  const saveInxRandom = [];
  const countRandom = randomNumber({ lengthList: config.lengthList, isZero: false });
  if (!countRandom) {
    debugger;
  }
  for (let i = 0; i < countRandom; i++) {
    const inxRandom = randomNumber({ lengthList: config.lengthList });
    const isInx = saveInxRandom.includes(inxRandom);
    if (!isInx) {
      saveInxRandom.push(inxRandom);
      fields.push(listFields[inxRandom]);
    }
  }
  return fields;
};

export const resServerData = [
  { name: 'Product1', id: uuidv4() },
  { name: 'Product2', id: uuidv4() },
  { name: 'Product3', id: uuidv4() },
];
