import { getRequestErrorString } from '../string'


const arrayOfObject1 = {
  errors: [
    {global: "toto"},
  ]
};

const arrayOfObject2 = {
  errors: [
    {global: "toto"},
    {booking: "titi"},
  ]
};

const objectWithArrays1 = {
  errors: {
    global: ["toto"],
  },
};

const objectWithArrays2 = {
  errors: {
    global: ["toto", "titi"],
    booking: ["tata"],
  },
};


test("parse array of objects", () => {
  expect(getRequestErrorString(arrayOfObject1)).toBe("toto")
  expect(getRequestErrorString(arrayOfObject2)).toBe("toto titi")
});


test("parse hash with arrays", () => {
  expect(getRequestErrorString(objectWithArrays1)).toBe("toto")
  expect(getRequestErrorString(objectWithArrays2)).toBe("toto titi tata")
});
