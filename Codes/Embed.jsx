export const embed = (link) => {
  const id =
    link.split("?v=")[1] ||
    link.split(".be/")[1] ||
    link.split(".com/embed/")[1];
  return "https://www.youtube.com/embed/" + id;
};
