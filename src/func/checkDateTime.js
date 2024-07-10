export function getCurrentDateTime() {
  const now = new Date();
  const adjustedNow = new Date(now.getTime()); // Add offset in milliseconds
  const isoString = adjustedNow.toLocaleTimeString(); // Format: "YYYY-MM-DDTHH:MM"
  return isoString.slice(0, 16); // Return only the date and time part
}

export default function checkDateTime(dateTime) {
  const now = new Date();
  const adjustedNow = new Date(now.getTime()); // Add offset in milliseconds
  const isoString = adjustedNow.toLocaleTimeString(); // Format: "YYYY-MM-DDTHH:MM"
  const currentDateTime = isoString.slice(0, 16); // Return only the date and time part

  const intervalDateTime = new Promise((resolve, reject) => {
    setInterval(() => {
      if (dateTime === currentDateTime || dateTime < currentDateTime) {
        clearInterval(intervalDateTime);
        resolve(true);
      } else {
        reject(false);
      }
    }, 1000);
  });
}
