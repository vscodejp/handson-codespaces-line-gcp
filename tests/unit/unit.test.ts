import { getFilename } from "../../src/unit";

test('check filename', async () => {
  const filename = getFilename()
  expect(filename.slice(-3)).toEqual("jpg");
});