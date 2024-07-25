export default function checkTime(targetTime) {
  const targetDate = new Date(targetTime); // แปลงเวลาที่รับมาให้เป็น Date object
  console.log(targetDate, "targerDate");
  const interval = 500; // ความถี่ในการตรวจสอบ (500 มิลลิวินาที)

  // ฟังก์ชันสำหรับตรวจสอบเวลา
  function check() {
    const currentDate = new Date(); // เวลาปัจจุบัน
    console.log(
      "Running check",
      currentDate,
      targetDate,
      currentDate >= targetDate
    );
    if (currentDate >= targetDate) {
      console.log("Time is up!");
      clearInterval(timer); // หยุดการตรวจสอบเมื่อถึงเวลาที่กำหนด
      return true;
    }
  }

  // เริ่มตรวจสอบทุก ๆ 500 มิลลิวินาที
  const timer = setInterval(check, interval);

  // คืนค่าเป็นฟังก์ชันที่สามารถหยุดการตรวจสอบได้
  return () => clearInterval(timer);
}

// การใช้งาน
// const targetTime = "2024-07-10T12:00:00"; // ตัวอย่างเวลาที่ต้องการตรวจสอบ
const stopChecking = checkTime(targetTime);

// หากต้องการหยุดการตรวจสอบก่อนถึงเวลาที่กำหนด
// stopChecking();
