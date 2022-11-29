export default function convertVND(num) {
  return `${num} VNĐ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
