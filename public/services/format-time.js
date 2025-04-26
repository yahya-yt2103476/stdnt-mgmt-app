export function convertToAmPmRange(timeStr) {
  const [start24, end24] = timeStr.split(" ");

  const toAmPm = (time24) => {
    let [hours, minutes] = time24.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // convert 0 -> 12
    return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  const startAmPm = toAmPm(start24);
  const endAmPm = toAmPm(end24);

  return `${startAmPm} - ${endAmPm}`;
}
