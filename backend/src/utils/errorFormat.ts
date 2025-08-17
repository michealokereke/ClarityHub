interface Format extends Error {
  status?: number;
}

export const errorFormat = (message: string, status?: number) => {
  const errror: Format = new Error(message);
  if (status) errror.status = status;
  return errror;
};
