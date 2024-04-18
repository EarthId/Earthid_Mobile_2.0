export const getColor = (item: string): string => {
  console.log("color+++++===>", item);
  let color = "";
  switch (item) {
    case "ID":
      // code block
      color = "rgba(246, 189, 233, 1)";
      break;
    case "Employment":
      // code block
      color = "#FFDD9B";
      break;
    case "Healthcare":
      // code block
      color = "#C5BDF6";
      break;
    case "Travel":
      // code block
      color = "#F5BCE8";
      break;
    case "Insurance":
      // code block
      color = "#A5F7B0";
      break;
    case "Finance":
      // code block
      color = "#D7EFFB";
      break;
    default:
    // code block
  }

  return color;
};
